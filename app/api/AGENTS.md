# AGENTS.md — `app/api/`

Next.js route handlers. These are the only place Supabase is queried on the
server. See [`/AGENTS.md`](../../AGENTS.md) for repo-wide rules.

## The pipeline, in order

Copy the shape from `app/api/auth/login/route.ts` or
`app/api/cafe/create/route.ts` rather than writing a new one. Cheap rejections
come first on purpose.

```ts
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. size, before reading the body
    const payloadValidation = validatePayloadSize(request);
    if (!payloadValidation.isValid) { /* 413 */ }

    // 2. origin — cheaper than a Redis round trip
    if (!verifyCsrfToken(request)) { /* 403 */ }

    // 3. rate limit
    const rateLimitResult = await checkApiRateLimit(request);
    if (!rateLimitResult.allowed) { /* 429 */ }

    // 4. parse — malformed JSON is a 400, not a 500
    let body: unknown;
    try { body = await request.json(); } catch { /* 400 */ }

    // 5. validate with the schema from lib/schema.ts
    const validationResult = cafeSchema.safeParse(body);
    if (!validationResult.success) { /* 400 + issues */ }

    // 6. identity
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { /* 401 */ }

    // 7. query — RLS applies on top
    // 8. respond
  } catch (error) {
    const safeError = createSafeErrorResponse(error);
    return NextResponse.json({ error: safeError.message }, { status: http.INTERNAL_SERVER_ERROR.status });
  }
}
```

Skipping a step is a security decision, not a shortcut. If a handler genuinely
does not need one, say why in a comment.

## Status codes and messages

From `lib/http.ts`. Never hardcode a number or an English string:

```ts
return NextResponse.json({ error: http.CONFLICT.message }, { status: http.CONFLICT.status });
```

Error bodies go through `createSafeErrorResponse`, which returns the real
message in development and a generic one in production. Do not bypass it to
"help debugging" — that leaks database internals to end users.

The `isDevelopment && { details: ... }` pattern used by the public menu route is
the sanctioned way to expose a cause locally.

## Rate limiters

Pick the one that matches the endpoint's blast radius. They have separate
budgets and separate Redis prefixes.

| Helper | Budget | Use for |
| --- | --- | --- |
| `checkAuthRateLimit` | 5 / 15 min | login, anything credential-adjacent |
| `checkUploadRateLimit` | 10 / min | storage upload |
| `checkApiRateLimit` | 20 / min | authenticated CRUD |
| `checkPublicRateLimit` | 50 / min | anything under `public/` |

Keys are IP + truncated user-agent. A failed Redis call fails **open** (see
`lib/rate-limiter-redis.ts`) — the limiter is a mitigation, not the auth
boundary.

## `public/` is unauthenticated

Everything under `app/api/public/` answers without a session, protected only by
RLS public-read policies and the public rate limiter. Treat every input as
hostile, and never widen a `select` there to columns a diner should not see —
the current lists are deliberate.

## Supabase result handling

`.single()` raises `PGRST116` for **zero** rows and for two. Using it where a
miss is legitimate turns "not found" into a 500 and makes the `if (!row)` branch
below unreachable.

```ts
// a slug that may not exist
.eq("slug", slug).maybeSingle();   // → data: null, error: null

// a row we just inserted and must get back
.insert([data]).select().single();  // → absence really is a server error
```

Handle `error.code === "23505"` (unique violation) as a **409**, not a 500. The
application-level duplicate check that precedes it runs under RLS and cannot see
another tenant's row — the database constraint is what actually catches it.

## Cache invalidation

Writes must invalidate explicitly. `lib/redis.ts` has the helpers:

- `invalidateUserCafesCache(userId)` after any cafe write
- `invalidatePublicCafeCache(slug)` after anything that changes a published menu

When a slug changes, invalidate the **old** slug as well — `api/cafe/update`
shows the pattern.

## Adding an endpoint

One directory per action: `api/<resource>/<action>/route.ts`, with `[id]` for
single-record reads. Unmatched paths already return a rate-limited 404 through
`api/[...slug]/route.ts` — no need to handle that yourself.

Then add a method to the matching repository in `lib/repositories/` so the
client never calls `fetch` directly.
