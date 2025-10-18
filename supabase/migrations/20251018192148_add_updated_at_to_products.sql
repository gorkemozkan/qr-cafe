-- Add updated_at column to products table
-- This will track when a product was last modified
ALTER TABLE "public"."products" ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to set updated_at to created_at for products that don't have it
UPDATE "public"."products" 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Add a comment to the column for documentation
COMMENT ON COLUMN "public"."products"."updated_at" IS 'Timestamp when the product was last updated';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column on product updates
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON "public"."products" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
