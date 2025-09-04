-- Add missing UPDATE policy for products table
CREATE POLICY "Enable update for users based on user_id"
ON "public"."products"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
