# AGENTS.md — `supabase/`

Schema, migrations and row-level security. See [`/AGENTS.md`](../AGENTS.md) for
repo-wide rules.

## ⚠️ Merging a migration deploys it

`.github/workflows/production.yaml` runs `supabase db push` on every push to
`main`; `staging.yaml` does the same for `staging`. There is no manual approval
step between a merge and production DDL.

Before opening a PR that touches this directory:

- State in the PR description what the migration does to **existing rows**.
- A migration that rewrites `cafes.slug` changes URLs that are **printed on
  physical QR codes**. Those codes cannot be updated. Name the affected rows.
- Check the live data first when the migration adds a constraint that existing
  rows might violate:

  ```sql
  SELECT slug, count(*) FROM cafes WHERE slug IS NOT NULL
  GROUP BY slug HAVING count(*) > 1;
  ```

## Writing a migration

```bash
npx supabase start                        # needs Docker running
npm run supabase:migration:create add_something
```

That script runs `supabase db diff` **and** regenerates `types/db.ts`. If you
write the SQL by hand, regenerate the types in the same commit:

```bash
npx supabase gen types typescript --local > types/db.ts
```

A mismatch between `supabase/migrations/` and `types/db.ts` is a bug. TypeScript
will happily compile against a column that does not exist.

Rules:

- **Append-only.** Never edit a migration that has been pushed. Correct it with
  a new one.
- Filenames are `<YYYYMMDDHHMMSS>_<description>.sql` and apply in that order.
- Make it idempotent where the syntax allows (`IF NOT EXISTS`,
  `CREATE OR REPLACE`). Several existing migrations had to be patched for
  exactly this reason.
- Comment the *why* at the top of the file, in English. The migration chain is
  the only record of a schema decision.

## Row-level security is the security boundary

The anon key is published to the browser by design. RLS is what makes that safe.
Every table is scoped to `auth.uid() = user_id`, plus public-read policies for
active cafes, active categories and available products.

**Application code runs under RLS too.** This is the single most expensive
mistake in this repo's history:

```ts
// In a route handler: only sees the CALLER's rows.
// Another tenant's identical slug is invisible, so this never fires.
const { data: existing } = await supabase.from("cafes").select("id").eq("slug", slug).single();
```

Two cafes owned by different users shared the slug `gastro` in production and
took down both public menus. **Cross-tenant invariants belong in a database
constraint**, never in a query the application writes. Route handlers then map
`23505` to a 409.

When adding a table, add its policies in the same migration. A table with RLS
enabled and no policy is invisible to everyone; a table without RLS is readable
by the whole internet.

## Tables

`cafes` → `categories` → `products`, each carrying `user_id` for RLS. `cafes.slug`
is the public URL segment and is unique. `products.updated_at` is maintained by
the `update_products_updated_at` trigger.

Storage buckets — `cafe-logos`, `product-images`, `category-images` — are
created by migration, and their names are mirrored in `config.ts`. Changing one
means changing both.

## Local stack

`config.toml` pins Postgres 17 and the ports: API `54321`, DB `54322`, Studio
`54323`, Inbucket `54324`.

```bash
npx supabase start          # prints the local anon key for .env.local
npm run supabase:push:local
npx supabase stop
```

Docker must be running. Without it there is no way to execute a migration
locally — say so rather than claiming a migration is verified.
