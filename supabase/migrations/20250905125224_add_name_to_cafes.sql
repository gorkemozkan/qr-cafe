-- Add name column to cafes table
ALTER TABLE "public"."cafes" ADD COLUMN "name" text NOT NULL DEFAULT '';

-- Update existing records to have a default name based on slug
UPDATE "public"."cafes" SET name = slug WHERE name = '';
