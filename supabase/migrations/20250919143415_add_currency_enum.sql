-- Create currency enum type
CREATE TYPE currency_type AS ENUM ('TRY', 'USD', 'EUR');

-- Drop the existing CHECK constraint on currency column
ALTER TABLE "public"."cafes" DROP CONSTRAINT IF EXISTS cafes_currency_check;

-- Change currency column type to use the enum
ALTER TABLE "public"."cafes" ALTER COLUMN currency TYPE currency_type USING currency::currency_type;

-- Set default currency for existing NULL values
UPDATE "public"."cafes" SET currency = 'TRY' WHERE currency IS NULL;

-- Make currency column NOT NULL (optional, but recommended)
ALTER TABLE "public"."cafes" ALTER COLUMN currency SET NOT NULL;
