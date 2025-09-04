-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'category-images',
  'category-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated users to upload product images
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to update their own product images
CREATE POLICY "Allow authenticated users to update their own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to delete their own product images
CREATE POLICY "Allow authenticated users to delete their own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for public to view product images
CREATE POLICY "Allow public to view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Create storage policy for authenticated users to upload category images
CREATE POLICY "Allow authenticated users to upload category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'category-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to update their own category images
CREATE POLICY "Allow authenticated users to update their own category images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'category-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to delete their own category images
CREATE POLICY "Allow authenticated users to delete their own category images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'category-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for public to view category images
CREATE POLICY "Allow public to view category images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'category-images');