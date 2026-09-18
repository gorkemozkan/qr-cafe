# AGENTS.md

Next.js 15 multi-tenant QR menu SaaS on Supabase. Cafe owners manage a menu in
`/admin`; diners read it at `/<slug>`.

## Commands

```bash
npm run dev            # next dev --turbopack
npm run build          # next build --turbopack
npx tsc --noEmit       # typecheck — NOT part of build output, run it separately
npm run lint           # biome check
npm run format         # biome format --write

npx supabase start                 # local stack (needs Docker running)
npm run supabase:push:local        # apply migrations locally
npm run supabase:migration:create <name>   # db diff + regenerate types/db.ts
```

Before handing work back run **all three**: `npx tsc --noEmit`, `npm run lint`,
`npm run build`. The build does not typecheck on its own.

Baseline to compare against: `biome check` reports **1 pre-existing warning**
(unused type parameter in `components/common/DataTable/utils.ts`). One warning
means you added nothing; more means you did.

## Setup

`.env.local` is required — the app cannot boot without it. `lib/env.ts` throws
at module load when `NEXT_PUBLIC_ENV` is missing, `next.config.ts` then fails to
parse, and `next dev` exits before printing a URL. If the dev server dies with
a stack trace mentioning `lib/env.ts`, the fix is environment variables, not
code.

```bash
cp env.example .env.local   # then fill in the Supabase values
```

Minimum to start: `NEXT_PUBLIC_ENV=development`, `NEXT_PUBLIC_APP_URL`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Turnstile and
Upstash may be blank — the CAPTCHA renders nothing without a site key, and every
Redis call is wrapped in try/catch.

`NEXT_PUBLIC_APP_URL` must be correct even locally: the public menu page fetches
its own API over HTTP, so a wrong value breaks server-side rendering.

## Architecture rules

Dependency direction is one-way: `app/` → `components/` → `hooks/` → `lib/`.
`lib/` never imports from `components/`.

- **Data access goes through `lib/repositories/`.** Components do not call
  `fetch` and do not import the Supabase client. Add a method to the matching
  repository instead.
- **Validation lives in `lib/schema.ts`.** One file for every zod schema. The
  same schema validates the form in the browser and the body in the route
  handler — do not write a second shape for the server.
- **Import with `@/`.** `tsconfig.json` maps it to the repository root. There
  are no relative imports across directories in this codebase.
- **React Query keys come from `lib/query.ts`.** Never write a key inline; that
  is how invalidation drifts.

## The Supabase trap that has already caused an outage

Row-level security applies to the queries **your own route handlers** run. The
`Select own cafes` policy limits `SELECT` on `cafes` to `auth.uid() = user_id`.

So a check like this is not a uniqueness check:

```ts
// Only sees the CALLER's cafes. Another tenant's identical slug is invisible.
const { data: existing } = await supabase.from("cafes").select("id").eq("slug", slug).single();
```

Two cafes owned by different users once shared the slug `gastro` in production
and took down both public menus. **Cross-tenant uniqueness belongs in a database
constraint**, and the route handler maps `23505` to a 409.

## `.single()` vs `.maybeSingle()`

`.single()` raises `PGRST116` for **zero** rows just as it does for two. Using
it for a lookup that can legitimately miss turns every "not found" into a 500
and makes the `if (!row) → 404` branch below it dead code.

Use `.maybeSingle()` when absence is a normal outcome. Keep `.single()` only
where a missing row really is a server error.

## Route handler pipeline

Mutating endpoints run this in order. Copy an existing route rather than
inventing a new shape:

```
validatePayloadSize → verifyCsrfToken → checkRateLimit → request.json()
  → schema.safeParse → supabase.auth.getUser() → query → NextResponse.json
```

Errors go through `createSafeErrorResponse` (`lib/http.ts`), which hides the
real message in production. Status codes and messages come from the `http`
object — do not hardcode numbers.

Anything under `app/api/public/` is reachable with no session. Treat every
input there as hostile.

## Database changes

Migrations are append-only and applied in filename order. Never edit a migration
that has been pushed.

```bash
npm run supabase:migration:create add_something
```

That script runs `supabase db diff` **and** regenerates `types/db.ts`. If you
write SQL by hand, regenerate the types too — a mismatch between
`supabase/migrations/` and `types/db.ts` is a bug, not a style issue.

⚠️ `.github/workflows/production.yaml` runs `supabase db push` on every push to
`main`. **Merging a migration applies it to production.** A migration that
rewrites existing rows (slugs especially — they are printed on physical QR
codes) needs the change spelled out in the PR description.

## i18n

Locale lives in a cookie, never in the URL. A printed QR code points at
`/<slug>` forever, so URL-prefixed locales are not an option.

The locale list in `i18n.ts` must match the files in `messages/` exactly. A
locale with no file throws inside `getRequestConfig` and returns a 500 — and the
cookie is `httpOnly: false`, so any client can set it. When you add a string,
add it to **both** `en.json` and `tr.json`.

Note: the catalogues have already diverged (~40 keys exist only in Turkish). Do
not make it worse.

## Conventions

- Comments, commit messages and documentation are **English**. UI strings are
  translated, not hardcoded.
- Commit subjects are imperative sentence case, no `feat:`/`fix:` prefix:
  `Restore the unique constraint on cafes.slug`.
- Components: PascalCase files matching the export. `components/ui/` is the
  exception — lowercase kebab-case, generated by the shadcn CLI, regenerable.
- `main` is the default branch and is protected in practice. Branch first, open
  a PR; the flow is feature → `staging` → `main`.

## Do not

- Do not commit `.env.local` or any real key. `.gitignore` covers `.env*`.
- Do not run `npm audit fix --force` — it pulls in Next 16, a major upgrade.
- Do not add a dependency for something a few lines solve. The current list has
  no unused entries; keep it that way.
- Do not add a test framework on a whim. The repo has none; if a change needs a
  check, say so and agree on the approach first.

## Further reading

- [architecture.md](./architecture.md) — runtime flow, security model, caching
- [structure.md](./structure.md) — where files live and why
- [docs/SDD.md](./docs/SDD.md) — full design description (Turkish)
- [docs/environment-variables.md](./docs/environment-variables.md)

Area-specific guidance: [`app/api/AGENTS.md`](./app/api/AGENTS.md),
[`components/AGENTS.md`](./components/AGENTS.md),
[`lib/AGENTS.md`](./lib/AGENTS.md),
[`supabase/AGENTS.md`](./supabase/AGENTS.md).
