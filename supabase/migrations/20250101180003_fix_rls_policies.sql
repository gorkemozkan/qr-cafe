-- Fix RLS policies for cafes table
-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."cafes";
DROP POLICY IF EXISTS "Enable users to view their own data only" ON "public"."cafes";
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON "public"."cafes";

-- Create corrected policies
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."cafes"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to view their own data only"
ON "public"."cafes"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id"
ON "public"."cafes"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
ON "public"."cafes"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
