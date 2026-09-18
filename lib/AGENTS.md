# AGENTS.md — `lib/`

Framework-free logic: data access, validation, security, environment. See
[`/AGENTS.md`](../AGENTS.md) for repo-wide rules.

**`lib/` never imports from `components/` or `hooks/`.** If something here needs
React, it belongs in `hooks/` instead.

## Repositories

Every network call the client makes goes through `lib/repositories/`. Components
do not call `fetch` and do not import a Supabase client.

```ts
export class CafeRepository extends BaseRepository {
  protected readonly baseUrl = `${nextPublicBaseUrl}/api/cafe`;

  async getById(id: number) {
    return await this.get<Cafe>(`/${id}`);
  }
}

export const cafeRepository = new CafeRepository();
```

`BaseRepository` wraps `apiClient` and prefixes `baseUrl`. Export a singleton
instance at the bottom of the file — that is how every call site imports it.

The base URL is absolute (`nextPublicBaseUrl`), not relative, because server
components call these too and a server has no origin to resolve against.

### Errors are typed by status

`ApiClient` throws `Error` with a `status` property attached. That is what lets
a repository turn a specific status into a value:

```ts
async getMenuBySlug(slug: string): Promise<PublicMenuData | null> {
  try {
    return await this.get<PublicMenuData>(`/${slug}`);
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return null;   // a missing cafe is a normal outcome
    }
    throw error;     // anything else must keep bubbling up
  }
}
```

Never swallow a whole `catch` into `null`. A broken database rendered as an
empty menu is worse than an error page.

## `schema.ts`

One file, every zod schema, plus the inferred types at the bottom. Do not split
it per resource and do not write a second shape for the server — the same schema
validates the React Hook Form in the browser and the request body in the route
handler.

```ts
export const cafeSchema = z.object({ /* ... */ });
export type CafeSchema = z.infer<typeof cafeSchema>;
```

## `env.ts`

Resolves configuration from `NEXT_PUBLIC_ENV` and **throws at module load** when
it is missing. That is intentional: `next.config.ts` imports this file, so a
misconfigured deployment fails to boot instead of silently pointing at the wrong
database.

Adding a required variable means adding it to `env.example` and to
`docs/environment-variables.md` in the same change. A variable that only
`env.example` knows about is how a fresh checkout ends up unable to start.

## `security.ts`

- `verifyCsrfToken` — compares `Origin`/`Referer` against `ALLOWED_ORIGINS` plus
  the configured base URL. **Fails closed** when nothing is configured; keep it
  that way.
- `createCSP` — consumed by `next.config.ts`. Development skips headers
  entirely, so a CSP change only shows up in a production build.
- `validateFileType`, `sanitizeFilename`, `validateBucketName` — upload
  validation. Bucket names come from `config.ts`, not from the request.

## `redis.ts` and caching

Every Redis call is wrapped in try/catch and swallows the failure, by design:
losing Redis degrades to slower responses, not errors. Keep that contract —
never let a cache miss become a user-facing 500.

Cache keys come from `getCacheKeys`. Writers call the matching
`invalidate*Cache` helper; there is no TTL-only invalidation for user data.

## `rate-limiter-redis.ts`

Four sliding-window limiters with separate prefixes and budgets. `checkRateLimit`
fails **open** when Redis is unreachable — this is a mitigation layer, not the
auth boundary. Do not restructure it into a hard dependency without saying so.

## `query.ts`

The React Query key factory. Every key in the app comes from here; an inline
`["cafes", id]` somewhere is how invalidation silently stops matching.

## `http.ts`

Status/message constants and `createSafeErrorResponse`, which returns the real
message in development and a generic one in production. Route handlers use it
for every error path.

## Supabase clients

Three entry points, not interchangeable:

| File | Use in |
| --- | --- |
| `supabase/client.ts` | browser / client components |
| `supabase/server.ts` | route handlers and server components (reads the cookie store) |
| `supabase/middleware.ts` | `middleware.ts` only — refreshes the session and redirects |

All of them use the **anon** key. That is safe because row-level security is the
actual boundary; there is no service-role key in this codebase, and adding one
would bypass RLS entirely.
