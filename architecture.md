# Architecture

`only-menu` is a multi-tenant QR menu SaaS. Cafe owners sign in, build a menu,
and get a QR code; diners scan it and land on a public page at `/<slug>`.

One Next.js 15 application serves both audiences. There is no separate backend
— Supabase is the database, the auth provider and the file store, and Next.js
route handlers sit in front of it.

## The stack and why

| Concern | Choice | Why it is here |
| --- | --- | --- |
| Framework | Next.js 15, App Router, Turbopack | Server components render the public menu; route handlers replace a separate API service |
| Database, auth, storage | Supabase (Postgres 17) | Row-level security enforces tenant isolation in the database, not in application code |
| Server state | React Query | Admin UI only; the public menu is server-rendered |
| Forms | React Hook Form + zod | The same zod schema validates in the browser and again in the route handler |
| Cache and rate limiting | Upstash Redis | Serverless-friendly; no connection pooling to manage |
| Styling | Tailwind 4 + shadcn/ui (Radix) | Primitives are copied into `components/ui/`, so they are editable |
| i18n | next-intl, cookie-driven | No locale prefix in URLs — a QR code must keep pointing at `/<slug>` |
| Lint and format | Biome | One tool instead of ESLint plus Prettier |

## The two request paths

### Public menu — server-rendered

```
Diner scans QR
  → GET /<slug>
  → middleware.ts          sets the x-locale header, no auth needed
  → app/(menu)/[slug]/page.tsx   (React Server Component)
  → publicMenuRepository.getMenuBySlug(slug)
  → GET /api/public/cafe/[slug]  (HTTP, same deployment)
      → rate limit (50/min per IP+UA)
      → Redis cache hit?  → return cached JSON
      → Supabase: cafes → categories + products (parallel)
      → cache for 900s
  → SimpleMenu renders
```

The page calls its own API over HTTP rather than querying Supabase directly.
That costs a round trip, but keeps one definition of "what a public menu is",
shared by the page, `generateMetadata` and `opengraph-image`.

Two consequences worth knowing:

- `NEXT_PUBLIC_APP_URL` (or the staging/production equivalent) must be correct,
  or server-side rendering fails — the server is fetching itself by URL.
- `ApiClient` throws on a non-2xx response with the HTTP status attached to the
  error. `getMenuBySlug` maps 404 to `null` so callers can render a real 404;
  every other failure keeps bubbling up, because a broken database must not be
  rendered as an empty menu.

### Admin — client-rendered

```
Owner opens /admin/app/...
  → middleware.ts → updateSession()
      no session  → redirect /admin/auth/login
      session on the login page → redirect /admin/app/dashboard
  → page.tsx (client component)
  → hooks/useRequest → lib/repositories/*  → fetch /api/...
  → route handler → Supabase (RLS scopes rows to auth.uid())
  → React Query caches, invalidates on mutation, toasts via sonner
```

## The route handler pipeline

Every mutating endpoint runs the same sequence before it touches data. Order
matters: the cheap rejections come first.

```
1. validatePayloadSize()   per content-type limit (JSON 1MB, multipart 5MB …)
2. verifyCsrfToken()       Origin/Referer against ALLOWED_ORIGINS + base URL
3. checkRateLimit()        Upstash sliding window, keyed on IP + user-agent
4. request.json()          malformed body → 400
5. schema.safeParse()      zod, from lib/schema.ts
6. supabase.auth.getUser() identity
7. the actual query        RLS applies on top
8. NextResponse.json()     errors through createSafeErrorResponse()
```

Four rate limiters with separate budgets:

| Limiter | Budget | Applies to |
| --- | --- | --- |
| `auth` | 5 / 15 min | login |
| `upload` | 10 / min | storage upload |
| `api` | 20 / min | authenticated endpoints and the catch-all |
| `public` | 50 / min | the menu API |

`createSafeErrorResponse` returns the real message in development and a generic
one in production, so database errors never reach a diner's browser.

## Security model

Three layers, and they are not interchangeable.

**Row-level security is the real boundary.** Policies scope every table to
`auth.uid() = user_id`, plus public read policies for active cafes, active
categories and available products. The anon key is published to the browser by
design; RLS is what makes that safe.

The trap: **application-level checks run under RLS too.** The slug collision
check in `api/cafe/create` cannot see a slug owned by a different user, because
`Select own cafes` hides it. Uniqueness that must hold across tenants belongs in
a database constraint (`cafes_slug_unique`), never in a query the application
writes.

**CSRF** is origin-based, not token-based. `verifyCsrfToken` compares the
`Origin` and `Referer` headers against `ALLOWED_ORIGINS` plus the configured base
URL, and fails closed when neither is configured.

**CSP and headers** are built in `next.config.ts` from `lib/security.ts`.
Development skips them entirely; production adds HSTS and friends. Uploads are
validated for type and filename (`validateFileType`, `sanitizeFilename`) and the
bucket name is checked against the allowlist in `config.ts`.

Login is protected by Cloudflare Turnstile when `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
is set; the CAPTCHA component renders nothing when it is absent, so local
development works without an account.

## Caching

Two layers, independent:

- **Redis** holds rendered public menu payloads for 900 seconds under
  `public:cafe:<slug>`, and the per-user cafe list under `cafes:user:<id>`.
  Writes invalidate explicitly — `invalidatePublicCafeCache`,
  `invalidateUserCafesCache`. Renaming a cafe invalidates the *old* slug too.
- **React Query** holds admin state in the browser: 5-minute stale time,
  10-minute GC, three retries with exponential backoff. Keys come from the
  factory in `lib/query.ts` so invalidation strings never drift.

Every Redis call is wrapped in try/catch and swallows failures. Losing Redis
degrades to slower responses, not errors — `lib/redis.ts` logs and continues.

## Environments

`lib/env.ts` resolves configuration from `NEXT_PUBLIC_ENV`
(`development` | `staging` | `production`) and picks the matching Supabase URL
and anon key. It **throws at module load** when the variable is missing, which
means `next.config.ts` fails to parse and the dev server never starts. That is
deliberate: a misconfigured deployment should not boot and silently point at the
wrong database.

Migrations deploy through GitHub Actions: a push to `staging` or `main` runs
`supabase db push` against the corresponding project. There is no lint or build
gate in CI, and the application itself deploys separately.

## Internationalisation

The locale lives in a cookie, not in the URL. A printed QR code points at
`/<slug>` forever, and adding `/tr/` or `/en/` would break every code already in
circulation. `middleware.ts` reads the cookie, defaults to `en`, and forwards it
as the `x-locale` header; `i18n.ts` loads the matching file from `messages/`.

The locale list in `i18n.ts` and the files in `messages/` must match exactly. A
locale with no file throws inside `getRequestConfig` and returns a 500, and
because the cookie is set with `httpOnly: false` any client can choose the
value.

## Known rough edges

- `types/db.ts` is generated but checked in; a hand-written migration without a
  regeneration silently drifts from the schema.
- `en.json` and `tr.json` have diverged — roughly 40 keys exist only in Turkish.
- CI deploys migrations but never runs `tsc`, `biome` or `next build`.
- `middleware.ts` calls `createIntlMiddleware(...)` and discards the result.
- The repository has no automated tests.

See [structure.md](./structure.md) for where each of these lives, and
`docs/SDD.md` for the full design description.
