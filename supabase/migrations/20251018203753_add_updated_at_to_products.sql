-- Add updated_at column to products table
ALTER TABLE "public"."products" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();

-- Create a trigger to automatically update the updated_at field when a row is updated
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON "public"."products" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
