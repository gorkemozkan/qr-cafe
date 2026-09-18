---
sdd_schema_version: 2
document_type: software-design-description
scope: repository
project_name: only-menu
product_name: Only Menu
repository_url: https://github.com/gorkemozkan/qr-cafe
project_keys: [TBD]
product_aliases: [Only Menu, qr-cafe]
service_family: client
domain: client-web
status: active
technical_owner: TBD
last_verified: 2026-09-18
source_confidence: Medium
verified_against:
  branch: main
  commit: 6592d2c88b9ab659a9940fdc28175b8fa42013b6
  working_tree: modified
related_product_context: TBD
---

# only-menu Software Design Document

## 1. Repository and Domain Overview

- **Repository purpose**: Kafe ve restoranlar için QR menü SaaS platformu. Tek bir Next.js 15 uygulaması hem yönetim panelini hem de müşterinin QR okutunca gördüğü genel menüyü sunar.
- **Product context**: `package.json` adı `only-menu`, git remote `gorkemozkan/qr-cafe`. `README.md` ürünü "Manageable, multi-use QR Menu SaaS platform for cafes & restaurants" olarak tanımlar. Jira/proje key kanıtı repository içinde bulunamadı, bu yüzden `project_keys: [TBD]`.
- **Domain responsibility**: Kafe/kategori/ürün CRUD'u, görsel yükleme, QR üretimi, çok kiracılı (multi-tenant) veri izolasyonu ve genel menünün sunulması.
- **Owned capabilities**: Menü yönetimi, kimlik doğrulama, dosya depolama, genel menü sunumu, GDPR veri ihracı/silme, oran sınırlama (rate limiting), önbellekleme.
- **In scope**: Uygulama kodu, API route handler'ları, Supabase şema migration'ları, RLS politikaları, i18n katalogları.
- **Out of scope**: Supabase platformunun kendi iç tasarımı, Upstash Redis iç yapısı, Cloudflare Turnstile servisi, deployment platformu (kanıt repository içinde yok).
- **Current state**: `active`. Son değişiklikler (PR #143, #144) güvenlik yamaları ve genel menü 404/slug tekilliği düzeltmeleri.
- **Canonical sources**: `package.json`, `next.config.ts`, `middleware.ts`, `lib/env.ts`, `supabase/migrations/`, `types/db.ts`, `.github/workflows/`.

Uygulama ayrı bir backend servisi barındırmaz. Supabase hem veritabanı hem kimlik sağlayıcı hem de dosya deposudur; Next.js route handler'ları bu servisin önünde doğrulama, oran sınırlama ve önbellekleme katmanı olarak durur. Çok kiracılı izolasyonun asıl sınırı uygulama kodu değil, Postgres row-level security politikalarıdır.

Yeni gelen bir geliştiricinin bilmesi gereken iki sınır: (1) `lib/env.ts` modül yüklenirken `NEXT_PUBLIC_ENV` yoksa `throw` eder ve `next.config.ts` bunu import ettiği için uygulama hiç başlamaz; (2) route handler'ların yazdığı sorgular da RLS altında çalışır, dolayısıyla kiracılar arası tekillik kontrolleri uygulama katmanında yapılamaz.

### Product and System Relationships

| Product / Project Key | This Repository Role | Upstream Systems | Downstream Systems | Canonical Contract | Confidence |
| --- | --- | --- | --- | --- | --- |
| Only Menu / [TBD] | Full-stack web client + API layer | Tarayıcı (kafe sahibi, müşteri) | Supabase (Postgres, Auth, Storage) | `types/db.ts`, `supabase/migrations/` | High |
| Only Menu / [TBD] | Cache & rate-limit consumer | — | Upstash Redis | `lib/redis.ts`, `lib/rate-limiter-redis.ts` | High |
| Only Menu / [TBD] | CAPTCHA consumer | — | Cloudflare Turnstile | `components/common/Captcha.tsx` | Medium |
| Only Menu / [TBD] | Migration producer | GitHub Actions | Supabase (staging/production projeleri) | `.github/workflows/{staging,production}.yaml` | High |

Deployment platformu için repository içinde `vercel.json` veya eşdeğer bir manifest bulunamadı; yalnızca migration deployment'ı kanıtlanabilir durumda.

## 2. Technical Requirements and Constraints

| ID | Requirement / Quality Goal | Design Response | Evidence |
| --- | --- | --- | --- |
| TR-01 | Kiracılar birbirinin verisini göremez | Her tabloda `user_id` + `auth.uid() = user_id` RLS politikaları; anon key tarayıcıya açık | `supabase/migrations/20250924130740_remote_schema.sql` |
| TR-02 | QR kodu basıldıktan sonra URL değişmemeli | Locale URL'de değil cookie'de tutulur; `/<slug>` kalıcıdır | `middleware.ts`, `i18n.ts` |
| TR-03 | Genel menü hızlı ve ucuz sunulmalı | Redis'te 900 saniyelik payload önbelleği + açık invalidation | `lib/redis.ts`, `app/api/public/cafe/[slug]/route.ts` |
| TR-04 | Yanlış yapılandırılmış ortam sessizce ayağa kalkmamalı | `lib/env.ts` modül yüklenirken `throw` eder | `lib/env.ts` |
| TR-05 | Kimlik doğrulama ve yükleme uçları kötüye kullanıma kapalı olmalı | Dört ayrı Upstash sliding-window limiter + origin tabanlı CSRF | `lib/rate-limiter-redis.ts`, `lib/security.ts` |

### Constraints and assumptions

- **Platform/runtime**: Next.js 15.5.25 App Router, Turbopack, React 19.1, TypeScript 5.9, Node.js (sürüm `engines` ile sabitlenmemiş; `README.md` "Node.js 18+" der). Postgres 17 (`supabase/config.toml`).
- **Legacy/migration**: Migration zinciri append-only ve düzeltmeler için yeni dosya ekleniyor (örn. `20250908152055_migration.sql` kendinden önceki tekillik kısıtını düşürmüş, `20260918121034_restore_cafes_slug_unique.sql` geri getirmiş). `types/db.ts` üretilen ama commit'lenen bir dosya olduğu için elle yazılan migration'larda sürüklenme riski taşır.
- **Performance/reliability**: Redis erişilemezse önbellek çağrıları sessizce yutulur (`lib/redis.ts`), oran sınırlama ise **fail-open** davranır (`lib/rate-limiter-redis.ts`). İkisi de bilinçli tasarım kararı.
- **Security/privacy**: Servis rol anahtarı (service-role key) kod tabanında yoktur; tüm Supabase istemcileri anon key kullanır. GDPR ihraç/silme uçları mevcut (`app/api/gdpr/`).
- **Assumptions**: `NEXT_PUBLIC_APP_URL` doğru olmalıdır — genel menü sayfası kendi API'sini HTTP üzerinden çağırır, yanlış değer sunucu tarafı render'ı bozar.
- **Known limitations**: Otomatik test yoktur; CI yalnızca migration deploy eder, `tsc`/`biome`/`build` çalıştırmaz; `messages/en.json` ile `messages/tr.json` ayrışmıştır.

## 3. Architecture and Components

| Component / Layer | Responsibility | Main Paths | Dependencies | Data Owned | Status |
| --- | --- | --- | --- | --- | --- |
| Middleware | Oturum yenileme, admin yolları için auth kapısı, locale cookie | `middleware.ts`, `lib/supabase/middleware.ts` | Supabase Auth | Oturum ve locale cookie'leri | Active |
| Public menu surface | QR ile gelinen menünün sunucu tarafı render'ı | `app/(menu)/[slug]/` | `lib/repositories/public-menu-repository.ts` | Yok (okur) | Active |
| Admin surface | Kafe/kategori/ürün yönetim arayüzü | `app/(admin)/admin/app/` | React Query, repositories | İstemci önbelleği | Active |
| API route handlers | Doğrulama, CSRF, oran sınırlama, Supabase sorguları | `app/api/` | Supabase, Upstash | Yok (aracı) | Active |
| Repository layer | Tüm ağ çağrılarının tek kapısı | `lib/repositories/` | `lib/api-client.ts` | Yok | Active |
| Validation layer | Tarayıcı ve sunucuda ortak zod şemaları | `lib/schema.ts` | zod | Yok | Active |
| Security layer | CSRF origin kontrolü, CSP, dosya/XSS doğrulama | `lib/security.ts`, `lib/payload-validation.ts` | — | Yok | Active |
| Cache & rate limit | Redis önbelleği ve dört limiter | `lib/redis.ts`, `lib/rate-limiter-redis.ts` | Upstash | Önbellek anahtarları | Active |
| Database & RLS | Şema, politikalar, tetikleyiciler | `supabase/migrations/` | Postgres 17 | `cafes`, `categories`, `products` | Active |

### Capability Index

| Capability | Product(s) | Owning Component / Deployable | Primary Interface | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| Kafe yönetimi | Only Menu | API route handlers | REST | Active | `app/api/cafe/` |
| Kategori yönetimi + sıralama | Only Menu | API route handlers | REST | Active | `app/api/category/`, `lib/services/sortingService.ts` |
| Ürün yönetimi | Only Menu | API route handlers | REST | Active | `app/api/product/` |
| Genel menü sunumu | Only Menu | Public menu surface | Sunucu render + REST | Active | `app/(menu)/[slug]/`, `app/api/public/cafe/` |
| Kimlik doğrulama (e-posta/şifre) | Only Menu | Supabase Auth + middleware | REST + cookie | Active | `app/api/auth/`, `lib/supabase/middleware.ts` |
| CAPTCHA korumalı giriş | Only Menu | Captcha bileşeni | Turnstile widget | Active (opsiyonel yapılandırma) | `components/common/Captcha.tsx` |
| Dosya yükleme (logo/görsel) | Only Menu | Storage route handlers | REST → Supabase Storage | Active | `app/api/storage/`, `lib/supabase/storage.ts` |
| QR kodu üretimi | Only Menu | Admin surface | İstemci tarafı (`qrcode`) | Active | `components/cafe/CafeQRPreviewDialog.tsx` |
| GDPR veri ihracı/silme | Only Menu | GDPR route handlers | REST | Active | `app/api/gdpr/` |
| Dashboard istatistikleri | Only Menu | Stats route handler | REST | Active | `app/api/stats/route.ts` |
| Oran sınırlama | Only Menu | Cache & rate limit | Sunucu içi | Active | `lib/rate-limiter-redis.ts` |
| Çok dillilik (en, tr) | Only Menu | next-intl | Cookie tabanlı | Active | `i18n.ts`, `messages/` |
| Açık/koyu tema | Only Menu | ThemeContext + next-themes | İstemci | Active | `context/ThemeContext.tsx` |

Bir yeteneğin kodda bulunması, her ortamda etkin olduğu anlamına gelmez. Turnstile yalnızca `NEXT_PUBLIC_TURNSTILE_SITE_KEY` tanımlıysa render edilir; Redis bağlı değilse önbellek ve oran sınırlama sessizce devre dışı kalır.

### Architectural boundaries

**Entry/bootstrap**: İstek önce `middleware.ts`'e girer. `/admin` ile başlayan yollar `updateSession()` üzerinden oturum kontrolünden geçer; diğerleri yalnızca `x-locale` başlığı alır ve locale cookie'si yoksa varsayılan atanır. Ardından App Router ilgili route group'a yönlendirir. `app/layout.tsx` sağlayıcıları (QueryProvider, tema, font) kurar.

**Dependency direction**: Tek yönlüdür — `app/` → `components/` → `hooks/` → `lib/`. `lib/` hiçbir zaman `components/` veya `hooks/`'tan import etmez. `app/` doğrudan `lib/`'e erişebilir.

**Module boundaries**: Bileşenler `fetch` çağırmaz ve Supabase istemcisi import etmez; tüm ağ erişimi `lib/repositories/` üzerinden geçer. Doğrulama tek dosyada (`lib/schema.ts`) toplanır ve aynı şema hem React Hook Form'da hem route handler'da kullanılır.

**State ownership**: Admin tarafında sunucu durumu React Query'nin elindedir; anahtarlar `lib/query.ts` fabrikasından gelir. Genel menü sunucuda render edilir ve istemci durumu tutmaz.

**Shared/core boundaries**: `components/ui/` shadcn CLI tarafından üretilir ve yeniden üretilebilir kalmalıdır; `components/common/` üç ve daha fazla özellik tarafından kullanılan bileşenlere ayrılmıştır.

**Public/internal interfaces**: `app/api/public/` altındaki her şey oturumsuz erişilebilir; geri kalan uçlar Supabase oturum cookie'sine ve RLS'e bağlıdır. Eşleşmeyen tüm API yolları `app/api/[...slug]/route.ts` tarafından oran sınırlamalı 404 ile karşılanır.

**Current/legacy/target separation**: Repository'de paralel legacy bir mimari yoktur. `supabase/migrations/20250908152055_migration.sql` gibi geri alma migration'ları tarihsel kayıt olarak durur; güncel şema zincirin tamamının bileşkesidir.

**Independently deployable components**: Tek bir Next.js deployable. Migration'lar ayrı bir release yolundan (GitHub Actions) gider.

**External domains**: Supabase, Upstash ve Turnstile yalnızca yerel adaptör sınırında belgelenir (`lib/supabase/`, `lib/redis.ts`, `components/common/Captcha.tsx`). İç tasarımları bu SDD'nin kapsamı dışındadır.

## 4. Project Structure

```text
qr-cafe
├── app/(menu)/[slug]/        # QR ile gelinen genel menü (server component)
├── app/(admin)/admin/        # Kimlik doğrulamalı yönetim paneli
├── app/api/                  # Route handler'lar; Supabase'in tek sunucu kapısı
├── app/api/public/           # Oturumsuz erişilebilen menü API'si
├── components/ui/            # shadcn/ui primitifleri (üretilen, yeniden üretilebilir)
├── components/common/        # Uygulama geneli bileşikler (DataTable, FormSheet, Captcha)
├── lib/repositories/         # Tüm ağ çağrılarının tek kapısı
├── lib/supabase/             # client / server / middleware / storage istemcileri
├── lib/schema.ts             # Tüm zod şemaları ve türetilen tipler
├── lib/env.ts                # Ortam çözümlemesi; eksik yapılandırmada throw eder
├── supabase/migrations/      # Sıralı, append-only SQL migration zinciri
├── types/db.ts               # Supabase'den üretilen veritabanı tipleri (commit'li)
├── messages/                 # next-intl katalogları (en, tr)
├── middleware.ts             # Auth kapısı + locale cookie
└── .github/workflows/        # Migration deployment (staging, production)
```

Test dizini yoktur; `find` taraması `*.test.*`, `*.spec.*` veya `__tests__` eşleşmesi döndürmedi.

## 5. Data Design

### Data Ownership

| Data / Domain | Source of Truth | Storage | Writers | Readers | Schema / Migration Source |
| --- | --- | --- | --- | --- | --- |
| `cafes` | Supabase Postgres | Postgres | `app/api/cafe/{create,update}` | Admin UI, genel menü API'si | `supabase/migrations/` |
| `categories` | Supabase Postgres | Postgres | `app/api/category/*` | Admin UI, genel menü API'si | `supabase/migrations/` |
| `products` | Supabase Postgres | Postgres | `app/api/product/*` | Admin UI, genel menü API'si | `supabase/migrations/` |
| Kullanıcı kimliği | Supabase Auth | Supabase Auth + cookie | Supabase | `middleware.ts`, route handler'lar | `lib/supabase/` |
| Görseller | Supabase Storage | Object storage | `app/api/storage/upload` | Genel menü, admin UI | `supabase/migrations/`, `config.ts` |
| Genel menü payload önbelleği | Türetilmiş | Upstash Redis (900 s) | `app/api/public/cafe/[slug]` | Aynı uç | `lib/redis.ts` |
| Kullanıcı kafe listesi önbelleği | Türetilmiş | Upstash Redis | Kafe yazma uçları | Admin uçları | `lib/redis.ts` |
| Oran sınırlama sayaçları | Upstash | Redis | `lib/rate-limiter-redis.ts` | Aynı modül | `lib/rate-limiter-redis.ts` |

### Data Lifecycle

**Model sınırları**: `cafes` → `categories` → `products` hiyerarşisi. Her tablo RLS için `user_id` taşır. Alan envanteri bu belgeye kopyalanmamıştır; kanonik kaynak `types/db.ts` ve `supabase/migrations/`.

**Read/write akışı**: Yazmalar yalnızca route handler'lardan geçer. Okumalar admin tarafında React Query, genel tarafta sunucu render'ı üzerinden yapılır.

**Cache invalidation**: TTL'e güvenilmez; yazmalar açıkça `invalidateUserCafesCache(userId)` ve `invalidatePublicCafeCache(slug)` çağırır. Slug değiştiğinde **eski** slug de invalidate edilir (`app/api/cafe/update/route.ts`).

**İstemci durumu**: React Query — 5 dakika `staleTime`, 10 dakika `gcTime`, üç deneme üstel geri çekilme ile (`components/providers/QueryProvider.tsx`).

**Migrations/versioning**: Dosya adı sırasına göre uygulanır, append-only. `npm run supabase:migration:create` hem `supabase db diff` çalıştırır hem `types/db.ts` üretir.

**Transactions/consistency**: Uygulama seviyesinde açık transaction kullanımı bulunamadı. Kiracılar arası tekillik veritabanı kısıtına devredilmiştir (`cafes_slug_unique`); route handler'lar `23505`'i 409'a haritalar.

**Sensitive data**: Servis rol anahtarı yoktur. Hata gövdeleri `createSafeErrorResponse` üzerinden geçer ve production'da gerçek mesajı gizler.

**Retention/deletion**: `app/api/gdpr/export` kullanıcının `cafes`/`categories`/`products` satırlarını döndürür, `app/api/gdpr/delete` silme akışını yürütür. Saklama süresi politikası için repository içinde kanıt bulunamadı — `TBD`.

## 6. Interface Design

### UI / UX Surfaces

| Surface / Route | Responsibility | State Owner | Main States | Design / Source |
| --- | --- | --- | --- | --- |
| `/` | Pazarlama açılış sayfası | Sunucu | Success | `app/page.tsx`, `components/landing/` |
| `/<slug>` | QR ile gelinen genel menü | Sunucu (RSC) | Success / NotFound | `app/(menu)/[slug]/page.tsx` |
| `/admin/auth/login` | Giriş + CAPTCHA | React Hook Form | Idle/Loading/Error | `components/auth/LoginForm.tsx` |
| `/admin/app/dashboard` | Kafe listesi + istatistikler | React Query | Loading/Empty/Error/Success | `app/(admin)/admin/app/dashboard/page.tsx` |
| `/admin/app/cafe/[id]/categories` | Kategori yönetimi, sürükle-bırak sıralama | React Query | Loading/Empty/Error/Success | `components/category/` |
| `/admin/app/cafe/[id]/categories/[categoryId]` | Ürün yönetimi | React Query | Loading/Empty/Error/Success | `components/product/` |
| `/admin/app/gdpr` | Veri ihracı ve silme | React Query | Idle/Loading/Success | `components/gdpr/` |

Deep link davranışı: `/<slug>` kalıcı genel bağlantıdır ve QR kodlarında basılıdır. Locale URL'de taşınmaz.

### APIs, Events and External Systems

| Producer → Consumer | Purpose | Protocol | Canonical Contract / Source | Auth Context | Failure Behavior |
| --- | --- | --- | --- | --- | --- |
| Tarayıcı → `app/api/*` | Admin CRUD | REST/JSON | `lib/schema.ts` | Supabase oturum cookie'si | 400/401/403/409/413/429; `createSafeErrorResponse` |
| Sunucu/tarayıcı → `app/api/public/cafe/*` | Genel menü okuma | REST/JSON | `lib/repositories/public-menu-repository.ts` | Yok (anon + RLS) | 404 bilinmeyen slug, 429 sınır aşımı, 500 diğer |
| Route handler → Supabase | Veri ve kimlik | PostgREST/HTTPS | `types/db.ts`, `supabase/migrations/` | Anon key + RLS | PostgREST hata kodları (`PGRST116`, `23505`) |
| Route handler → Upstash Redis | Önbellek, oran sınırlama | HTTPS | `lib/redis.ts` | REST token | Önbellek: sessiz yutma; limiter: fail-open |
| Tarayıcı → Cloudflare Turnstile | CAPTCHA | Widget + doğrulama | `components/common/Captcha.tsx` | Site key | Site key yoksa render edilmez |
| GitHub Actions → Supabase | Migration deploy | Supabase CLI | `.github/workflows/` | `SUPABASE_ACCESS_TOKEN` | İş başarısız olursa deploy durur |

Zaman aşımı ve yeniden deneme politikası: İstemci tarafında React Query üç deneme yapar (üstel geri çekilme, maksimum 30 s). Sunucu tarafı `fetch` çağrıları için repository-local zaman aşımı yapılandırması bulunamadı. Sayfalama kanıtı bulunamadı. Idempotency anahtarı kullanımı bulunamadı.

### Contract Registry

| Contract | Producer | Consumer | Owner | Version / Status | Canonical Source | Product(s) |
| --- | --- | --- | --- | --- | --- | --- |
| Public menu payload | `app/api/public/cafe/[slug]` | `(menu)/[slug]` sayfası, `generateMetadata`, `opengraph-image` | Bu repository | Sürümsüz / Active | `lib/repositories/public-menu-repository.ts` | Only Menu |
| Cafe/Category/Product CRUD | `app/api/{cafe,category,product}` | Admin UI | Bu repository | Sürümsüz / Active | `lib/schema.ts` | Only Menu |
| Auth (login/logout) | `app/api/auth/*` | Admin UI | Bu repository + Supabase Auth | Sürümsüz / Active | `lib/schema.ts`, `lib/supabase/` | Only Menu |
| Storage upload/delete | `app/api/storage/*` | Admin UI | Bu repository | Sürümsüz / Active | `lib/security.ts`, `config.ts` | Only Menu |
| GDPR export/delete | `app/api/gdpr/*` | Admin UI | Bu repository | Sürümsüz / Active | `app/api/gdpr/` | Only Menu |
| Database schema | `supabase/migrations/` | Tüm route handler'lar | Bu repository | Zincir sırası / Active | `types/db.ts` | Only Menu |

API'ler için OpenAPI veya eşdeğer resmi bir şema dosyası repository içinde bulunamadı; kanonik kaynak zod şemaları ve route handler implementasyonlarıdır.

## 7. Core Runtime Flows

### Flow: Genel menünün QR ile açılması

- Product / Capability: Only Menu / Genel menü sunumu
- Cross-Repository Handoffs: `app/api/public/cafe/[slug]` → Supabase PostgREST (`types/db.ts`), → Upstash Redis (`lib/redis.ts`)

1. Müşteri QR kodunu okutur, tarayıcı `GET /<slug>` ister.
2. `middleware.ts` çalışır; `/admin` olmadığı için auth kontrolü yapılmaz, `x-locale` başlığı eklenir, locale cookie'si yoksa varsayılan atanır.
3. `app/(menu)/[slug]/page.tsx` (server component) `publicMenuRepository.getMenuBySlug(slug)` çağırır.
4. Repository `nextPublicBaseUrl` üzerinden kendi API'sine HTTP isteği yapar: `GET /api/public/cafe/<slug>`.
5. Route handler `checkPublicRateLimit` (50/dk) uygular, ardından Redis'te `public:cafe:<slug>` anahtarını arar. İsabet varsa önbellek döner.
6. İsabet yoksa Supabase'den `cafes` satırı `.maybeSingle()` ile, sonra `categories` ve `products` paralel çekilir; sonuç 900 saniye önbelleğe yazılır.
7. Başarı: `SimpleMenu` menüyü render eder; `generateMetadata` ve `opengraph-image` aynı payload'ı kullanır.
8. Başarısızlık: Bilinmeyen slug 404 döner, repository bunu `null`'a çevirir ve sayfa `notFound()` çağırır. Diğer hatalar yukarı kabarır — bozuk veritabanı boş menü olarak render edilmez. Redis erişilemezse önbellek atlanır ve akış devam eder.

Evidence:

- `app/(menu)/[slug]/page.tsx`
- `app/api/public/cafe/[slug]/route.ts`
- `lib/repositories/public-menu-repository.ts`
- `lib/api-client.ts`

### Flow: Kafe oluşturma

- Product / Capability: Only Menu / Kafe yönetimi
- Cross-Repository Handoffs: `app/api/cafe/create` → Supabase PostgREST (`types/db.ts`)

1. Kafe sahibi admin panelinde formu gönderir.
2. `components/cafe/CafeForm.tsx` `cafeSchema` ile tarayıcıda doğrular; `useRequest` mutasyonu `cafeRepository.create` çağırır.
3. `app/api/cafe/create/route.ts` sırayla `validatePayloadSize` → `verifyCsrfToken` → `checkApiRateLimit` → `request.json()` → `cafeSchema.safeParse` → `supabase.auth.getUser()` uygular.
4. `slugify(name)` ile slug üretilir ve mevcut kafelerde aranır. **Bu kontrol RLS altında çalışır**, yalnızca çağıranın kendi kafelerini görür.
5. `insert` çalışır; kiracılar arası çakışmayı veritabanı kısıtı `cafes_slug_unique` yakalar.
6. Başarı: 201 döner, `invalidateUserCafesCache(user.id)` çağrılır, React Query `QueryKeys.cafes` invalidate eder, sonner toast gösterir.
7. Başarısızlık: Aynı kullanıcının slug'ı varsa 409; farklı kullanıcının slug'ı varsa Postgres `23505` döner ve handler bunu da 409'a haritalar. Diğer hatalar `createSafeErrorResponse` üzerinden 500.

Evidence:

- `app/api/cafe/create/route.ts`
- `lib/schema.ts`
- `supabase/migrations/20260918121034_restore_cafes_slug_unique.sql`
- `lib/redis.ts`

### Flow: Admin oturum kapısı

- Product / Capability: Only Menu / Kimlik doğrulama
- Cross-Repository Handoffs: `lib/supabase/middleware.ts` → Supabase Auth

1. Kullanıcı `/admin/app/...` adresine gider.
2. `middleware.ts` yolun `admin` ile başladığını görür ve `updateSession(request)` çağırır.
3. `lib/supabase/middleware.ts` istek cookie'lerinden Supabase server client kurar ve `supabase.auth.getUser()` ile oturumu doğrular/yeniler.
4. Oturum yoksa ve yol genel değilse `/admin/auth/login`'e yönlendirilir.
5. Oturum varken login sayfasına gidiliyorsa `/admin/app/dashboard`'a yönlendirilir.
6. Yenilenen cookie'ler yanıta yazılır ve `x-locale` başlığı eklenir.
7. Başarı: Sayfa render edilir; sonraki veri çağrıları RLS altında yalnızca kullanıcının satırlarını görür.
8. Başarısızlık: Supabase Auth erişilemezse `getUser()` kullanıcı döndürmez ve akış login yönlendirmesine düşer.

Evidence:

- `middleware.ts`
- `lib/supabase/middleware.ts`

## 8. Cross-Cutting Design

- **Authentication and authorization**: Supabase Auth (e-posta/şifre), cookie tabanlı oturum. Yetkilendirmenin asıl yeri Postgres RLS politikalarıdır; route handler'lar yalnızca kimliği doğrular.
- **Security and privacy**: Origin tabanlı CSRF (`verifyCsrfToken`, yapılandırma yoksa fail-closed), içerik tipine göre payload boyut limitleri, `next.config.ts` üzerinden CSP ve güvenlik başlıkları (development'ta atlanır), dosya tipi/ad temizleme, XSS yardımcıları. Servis rol anahtarı yoktur.
- **Configuration and environments**: `NEXT_PUBLIC_ENV` üç ortamı (`development`/`staging`/`production`) seçer ve eşleşen Supabase değişkenlerini çözer (`lib/env.ts`). Eksik değişken modül yüklenirken `throw` eder. Değişken adları `env.example` ve `docs/environment-variables.md` içinde belgelidir; gerçek değerler repository'de yoktur.
- **Feature flags, Remote Config, or CMS**: Not applicable. Repository içinde flag veya remote config altyapısı bulunamadı.
- **Error handling and recovery**: Route handler'lar `createSafeErrorResponse` ile production'da jenerik mesaj döner. İstemci tarafında `components/common/ErrorBoundary.tsx` ve `app/error/` mevcuttur.
- **Logging, metrics, and traces**: Yapılandırılmış `console.error` kullanımı var (`lib/redis.ts`, `lib/rate-limiter-redis.ts`). Merkezi log/metric/trace toplayıcı kanıtı bulunamadı — `TBD`.
- **Crash/error reporting**: Sentry veya eşdeğer bir SDK repository'de bulunamadı — `TBD`.
- **Analytics**: `@next/third-parties` bağımlılığı mevcut; kullanım kapsamı bu incelemede doğrulanmadı — `TBD`.
- **Localization**: next-intl, cookie tabanlı. `i18n.ts` locale listesi `messages/` dosyalarıyla birebir eşleşmek zorundadır; eşleşmezse `getRequestConfig` throw eder ve 500 döner.
- **Accessibility**: `components/ui/` Radix tabanlıdır ve odak/rol/klavye davranışını taşır. Repository geneli erişilebilirlik testi kanıtı bulunamadı.
- **Performance**: Genel menü sunucu render'ı + Redis önbelleği; `next.config.ts` görsel kaliteleri ve uzak kaynakları sınırlar; Turbopack dev ve build'de kullanılır.
- **Timeout, retry, and limits**: React Query üç deneme (maks. 30 s geri çekilme). Payload limitleri: JSON 1 MB, multipart 5 MB, urlencoded 512 KB, text 256 KB. Sunucu `fetch` zaman aşımı yapılandırması bulunamadı.
- **Rate limiting and quota**: Dört Upstash sliding-window limiter — auth 5/15 dk, upload 10/dk, api 20/dk, public 50/dk. Anahtar IP + kırpılmış user-agent. Redis hatasında **fail-open**.
- **Background and lifecycle behavior**: Zamanlanmış iş, worker veya kuyruk yoktur. Tek arka plan davranışı `products` tablosundaki `update_products_updated_at` tetikleyicisidir.
- **Offline behavior**: Not applicable.
- **Concurrency or parallel processing**: Route handler'larda bağımsız sorgular `Promise.all` ile paralelleştirilir (`app/api/public/cafe/[slug]`, `app/api/stats`).

## 9. Engineering and Operations

### Local Development

| Action | Command | Expected Success Signal |
| --- | --- | --- |
| Bootstrap | `npm install` | Bağımlılıklar kurulur |
| Configure | `cp env.example .env.local` | `NEXT_PUBLIC_ENV` dahil değişkenler doldurulur |
| Run | `npm run dev` | `Ready in ...` ve `http://localhost:3000` |
| Lint | `npm run lint` | `Found 1 warning` (mevcut baseline) |
| Format | `npm run format` | Dosyalar biçimlenir |
| Typecheck | `npx tsc --noEmit` | Çıktı yok, exit 0 |
| Build | `npm run build` | `Generating static pages (27/27)` |
| Local DB | `npx supabase start` | Yerel stack ayağa kalkar, anon key basılır (Docker gerekir) |
| Apply migrations | `npm run supabase:push:local` | Migration'lar uygulanır |
| New migration | `npm run supabase:migration:create <name>` | SQL dosyası + yenilenmiş `types/db.ts` |

`npm run build` tip denetimi yapmaz; `npx tsc --noEmit` ayrıca çalıştırılmalıdır.

### Test Strategy

Otomatik test yoktur. Unit, integration, contract, UI ve E2E katmanlarının hiçbiri mevcut değildir; `*.test.*`, `*.spec.*` ve `__tests__` taraması boş döndü. Test double, fixture, coverage aracı veya kalite kapısı bulunamadı.

Pratikte doğrulama `tsc --noEmit`, `biome check`, `next build` ve elle yapılan HTTP duman testlerine dayanır. Bu, bu SDD'nin kaydettiği en büyük teknik borçtur.

### Build, Release and Observability

- **CI/CD kaynakları**: `.github/workflows/staging.yaml` ve `.github/workflows/production.yaml`. İkisi de yalnızca `supabase link` + `supabase db push` çalıştırır.
- **Release flow**: Özellik dalı → `staging` → `main`. `main`'e her push production veritabanına migration uygular. **Merge ile production DDL arasında manuel onay adımı yoktur.**
- **Environment selection**: Runtime'da `NEXT_PUBLIC_ENV`; CI'da workflow secret'ları (`STAGING_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN` vb. — yalnızca ad olarak kaydedilmiştir).
- **Deployment units**: Uygulamanın kendisi ayrı bir yoldan deploy edilir; repository içinde deployment manifesti bulunamadı — `TBD`.
- **Quality gates**: CI'da `tsc`, `biome` veya `next build` adımı **yoktur**.
- **Rollback**: Migration geri alma stratejisi kanıtı bulunamadı — `TBD`. Zincir append-only olduğu için geri alma yeni bir migration gerektirir.
- **Logging/dashboards/alerts/runbooks**: Repository içinde kanıt bulunamadı — `TBD`.

## 10. Design Decisions, Risks and Open Questions

### Design Decisions

| Decision | Rationale | Evidence / ADR | Consequence |
| --- | --- | --- | --- |
| Yetkilendirme RLS'e devredildi | Anon key tarayıcıya açık olabilsin, izolasyon veritabanında zorlansın | `supabase/migrations/20250924130740_remote_schema.sql` | Uygulama kodu kiracılar arası sorgu yapamaz; tekillik kontrolleri kısıta taşınmalı |
| Genel menü sayfası kendi API'sini HTTP ile çağırır | "Genel menü nedir" tanımı sayfa, metadata ve OG görseli için tek yerde kalsın | `app/(menu)/[slug]/page.tsx` | Ek round-trip; `NEXT_PUBLIC_APP_URL` doğru olmak zorunda |
| Locale cookie'de, URL'de değil | Basılı QR kodları `/<slug>`'a kalıcı işaret etmeli | `middleware.ts`, `i18n.ts` | URL'den locale seçilemez; cookie `httpOnly: false` |
| `lib/env.ts` eksik yapılandırmada throw eder | Yanlış veritabanına sessizce bağlanmaktansa hiç başlamamak | `lib/env.ts` | İlk kurulumda dev server hata ile çıkar; `.env.local` zorunlu |
| Redis ve rate limiter hataları yutulur/fail-open | Önbellek ve sınırlama kaybı kullanıcıya hata olarak yansımasın | `lib/redis.ts`, `lib/rate-limiter-redis.ts` | Redis çökerse sınırlama etkisiz kalır |
| Tek zod dosyası, iki tarafta kullanım | İstemci ve sunucu doğrulaması ayrışmasın | `lib/schema.ts` | Dosya büyür, ama tek gerçek kaynak |
| Bağımlılıklar çoğunlukla exact pinlenir | Yeniden üretilebilir kurulum | `package.json` | Güvenlik yamaları elle yükseltme ister |

### Known Risks and Technical Debt

| Risk / Debt | Evidence | Impact |
| --- | --- | --- |
| Otomatik test yok | Test taraması boş | Regresyon yalnızca elle yakalanır |
| CI kalite kapısı yok, ama migration deploy eder | `.github/workflows/` | Derlenmeyen kod merge edilebilir; hatalı migration doğrudan production'a gider |
| `main`'e merge = production DDL | `production.yaml` | Veri yazan bir migration geri alınamaz şekilde uygulanır |
| `types/db.ts` üretilen ama commit'li | `types/db.ts` | Elle yazılan migration'da sessiz şema sürüklenmesi |
| i18n katalogları ayrışmış | `messages/en.json` (307 anahtar) vs `messages/tr.json` (344) | ~40 anahtar yalnızca Türkçede; eksik anahtarlar çalışma zamanında görünür |
| Kalan güvenlik açıkları Next 16 gerektiriyor | `npm audit` (2 moderate, 1 high) | Major yükseltme planı gerekli |
| `middleware.ts` ölü kod | `middleware.ts:7-11` — `createIntlMiddleware(...)` sonucu kullanılmıyor | Yanıltıcı; next-intl middleware'inin aktif olduğu sanılabilir |
| Rate limiter fail-open | `lib/rate-limiter-redis.ts` | Redis kesintisinde brute-force koruması kalkar |
| `updated_at` tip sürüklenmesi | Migration'da nullable, `types/db.ts`'te non-null | Düşük etkili; `DEFAULT now()` nedeniyle pratikte null olmuyor |

### Knowledge Coverage and Gaps

| Question Family | Coverage | Canonical Source | Main Gap |
| --- | --- | --- | --- |
| Kimlik doğrulama nasıl çalışır | Full | `middleware.ts`, `lib/supabase/` | None |
| Kiracı izolasyonu nasıl sağlanır | Full | `supabase/migrations/` | None |
| Yeni bir API ucu nasıl eklenir | Full | `app/api/`, `lib/schema.ts` | None |
| Veri modeli ve migration akışı | Full | `supabase/migrations/`, `types/db.ts` | None |
| Hata ve kurtarma davranışı | Partial | `lib/http.ts`, route handler'lar | Merkezi hata raporlama yok |
| Uygulama nereye/nasıl deploy edilir | TBD | — | Repository içinde deployment manifesti yok |
| Production'da gözlemlenebilirlik | TBD | — | Log/metric/alert/runbook kanıtı yok |
| Rollback nasıl yapılır | TBD | — | Migration geri alma stratejisi belgelenmemiş |
| Sahiplik ve on-call | TBD | — | `CODEOWNERS` veya service catalog yok |
| Analytics neyi ölçüyor | Partial | `@next/third-parties` bağımlılığı | Kullanım kapsamı doğrulanmadı |

### Open Questions

| ID | Question | Status | Why It Matters | Suggested Owner | Required Evidence |
| --- | --- | --- | --- | --- | --- |
| OQ-01 | Uygulama hangi platforma nasıl deploy ediliyor? | Open | Release ve rollback bilgisi eksik | TBD | Deployment manifesti veya CI tanımı |
| OQ-02 | Jira/proje key ve resmi ürün adı nedir? | Open | `project_keys` doğrulanamadı | TBD | Product Context veya service catalog |
| OQ-03 | Migration rollback stratejisi nedir? | Open | `main`'e merge doğrudan production DDL uyguluyor | TBD | Runbook veya ADR |
| OQ-04 | Production log/metric/alert nerede toplanıyor? | Open | Olay müdahalesi için gerekli | TBD | Dashboard/alert tanımı |
| OQ-05 | `CODEOWNERS` / teknik sahip kim? | Owner confirmation required | Gözden geçirme ve sahiplik sınırı belirsiz | TBD | `CODEOWNERS` veya catalog kaydı |
| OQ-06 | `messages/en.json` eksik ~40 anahtar kasıtlı mı? | Open | İngilizce arayüzde eksik metin riski | TBD | Ürün kararı |
| OQ-07 | Next 16 yükseltmesi planlandı mı? | Open | Kalan 3 güvenlik açığı yalnızca orada kapanıyor | TBD | Yükseltme planı |
| OQ-08 | Rate limiter fail-open davranışı kabul edilmiş bir karar mı? | Open | Redis kesintisinde koruma kalkıyor | TBD | Güvenlik kararı veya ADR |

### Unread or Unavailable Sources

- Deployment platformu yapılandırması — repository içinde bulunamadı.
- `CODEOWNERS`, service catalog, runbook, ADR — repository içinde bulunamadı.
- Supabase proje ayarları (Auth sağlayıcıları, e-posta şablonları, storage politikaları) — Supabase dashboard'da yaşar, repository'de değil.
- Upstash Redis ve Cloudflare Turnstile hesap yapılandırmaları — dış servis, incelenmedi.
- `components/` altındaki 104 dosyanın tamamı okunmadı; dizin başına temsilci dosyalar incelendi.
- `public/` statik varlıkları incelenmedi.

### Recommended Documentation Split

Not required. Tek deployable, tek sahiplik sınırı ve tek release yolu var; ayrı domain SDD'leri için gerekçe oluşmuyor. Daha kısa gezinme için `architecture.md` (runtime akışı ve güvenlik modeli) ve `structure.md` (dosya yerleşimi) bu belgeyi tamamlar; agent'lar için `AGENTS.md` dosyaları kök ve `app/api/`, `components/`, `lib/`, `supabase/` altında bulunur.
