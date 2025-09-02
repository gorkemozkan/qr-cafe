-- Add missing columns to cafes table
ALTER TABLE "public"."cafes" ADD COLUMN "currency" text CHECK (currency IN ('TRY', 'USD', 'EUR'));

-- Update existing records to have a default currency
UPDATE "public"."cafes" SET currency = 'TRY' WHERE currency IS NULL;

