-- Add category_image column to categories table
ALTER TABLE "public"."categories"
ADD COLUMN "image_url" TEXT;

-- Add comment to the column
COMMENT ON COLUMN "public"."categories"."image_url" IS 'URL of the category image stored in Supabase Storage';
