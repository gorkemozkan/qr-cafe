-- Add public read policies for menu data
-- This allows anonymous users to view active cafe menus while maintaining security for admin operations

-- Add public read policy for cafes (only active cafes)
CREATE POLICY "Enable public read access for active cafes"
ON "public"."cafes"
AS PERMISSIVE
FOR SELECT
TO anon
USING (is_active = true);

-- Add public read policy for categories (only active categories of active cafes)
CREATE POLICY "Enable public read access for active categories"
ON "public"."categories"
AS PERMISSIVE
FOR SELECT
TO anon
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM cafes 
    WHERE cafes.id = categories.cafe_id 
    AND cafes.is_active = true
  )
);

-- Add public read policy for products (only available products of active cafes)
CREATE POLICY "Enable public read access for available products"
ON "public"."products"
AS PERMISSIVE
FOR SELECT
TO anon
USING (
  is_available = true 
  AND EXISTS (
    SELECT 1 FROM cafes 
    WHERE cafes.id = products.cafe_id 
    AND cafes.is_active = true
  )
);
