-- Make slug column nullable and add unique constraint

-- First, handle any potential duplicate slugs by appending incremental numbers
WITH duplicate_slugs AS (
  SELECT slug, count(*) as cnt
  FROM cafes
  GROUP BY slug
  HAVING count(*) > 1
),
updated_duplicates AS (
  SELECT 
    c.id,
    c.slug || '-' || (ROW_NUMBER() OVER (PARTITION BY c.slug ORDER BY c.id) - 1) as new_slug
  FROM cafes c
  INNER JOIN duplicate_slugs d ON c.slug = d.slug
)
UPDATE cafes 
SET slug = ud.new_slug
FROM updated_duplicates ud
WHERE cafes.id = ud.id AND ud.new_slug != cafes.slug;

-- Make slug column nullable
ALTER TABLE "public"."cafes" ALTER COLUMN "slug" DROP NOT NULL;

-- Add unique constraint on slug column
ALTER TABLE "public"."cafes" ADD CONSTRAINT "cafes_slug_unique" UNIQUE ("slug");

-- Create index for better performance on slug lookups
CREATE INDEX "cafes_slug_idx" ON "public"."cafes" ("slug") WHERE "slug" IS NOT NULL;
