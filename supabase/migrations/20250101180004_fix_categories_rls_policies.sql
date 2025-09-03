-- Fix RLS policies for categories table
-- Add missing UPDATE policy for categories

CREATE POLICY "Enable update for users based on user_id"
ON "public"."categories"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
