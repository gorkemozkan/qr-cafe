-- Add allergens column to products table
-- This will be an array of strings to store product allergens like "nuts", "dairy", "gluten", "eggs", "soy", "fish", "shellfish", "sesame"
ALTER TABLE "public"."products" ADD COLUMN allergens TEXT[];

-- Add a comment to the column for documentation
COMMENT ON COLUMN "public"."products"."allergens" IS 'Array of allergen identifiers that the product contains (e.g., nuts, dairy, gluten)';

