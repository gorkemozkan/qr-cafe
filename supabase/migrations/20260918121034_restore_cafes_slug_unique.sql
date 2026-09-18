-- Restore the UNIQUE constraint on cafes.slug.
--
-- It was added in 20250905131646_make_slug_unique_nullable.sql and dropped
-- three days later in 20250908152055_migration.sql, never to return.
--
-- The application-level collision checks (app/api/cafe/create/route.ts and
-- app/api/cafe/update/route.ts) run under RLS. The "Select own cafes" policy
-- restricts SELECT to auth.uid() = user_id, so those checks cannot see a slug
-- owned by a different user and happily insert a duplicate.
--
-- Once duplicates exist, app/api/public/cafe/[slug] fails: its .single() call
-- returns PGRST116 ("The result contains 2 rows"), which the route reports as
-- "Unable to fetch cafe information" with HTTP 500 - the public menu of BOTH
-- cafes sharing that slug becomes unreachable.

-- 1) Resolve existing duplicates. The lowest id keeps the slug; every other
--    row gets the first non-colliding "-N" suffix.
DO $$
DECLARE
  dup RECORD;
  candidate text;
  n int;
BEGIN
  FOR dup IN
    SELECT id, slug
    FROM (
      SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) AS rn
      FROM public.cafes
      WHERE slug IS NOT NULL
    ) t
    WHERE rn > 1
    ORDER BY id
  LOOP
    n := 1;
    LOOP
      candidate := dup.slug || '-' || n;
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.cafes WHERE slug = candidate);
      n := n + 1;
    END LOOP;

    RAISE NOTICE 'cafes.id=% slug "%" -> "%"', dup.id, dup.slug, candidate;
    UPDATE public.cafes SET slug = candidate WHERE id = dup.id;
  END LOOP;
END $$;

-- 2) The actual fix: a constraint is independent of RLS and covers every
--    insert and update path, present and future.
ALTER TABLE "public"."cafes" ADD CONSTRAINT "cafes_slug_unique" UNIQUE ("slug");

-- 3) Public menu lookups filter on slug; the index was dropped alongside the
--    constraint in 20250908152055_migration.sql.
CREATE INDEX IF NOT EXISTS "cafes_slug_idx" ON "public"."cafes" ("slug") WHERE "slug" IS NOT NULL;
