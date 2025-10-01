-- Use storage.create_bucket to be compatible with latest schema
DO $$
BEGIN
  PERFORM storage.create_bucket(
    bucket_id => 'cafe-logos',
    name => 'cafe-logos',
    public => true,
    file_size_limit => 5242880,
    allowed_mime_types => ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  );
EXCEPTION WHEN OTHERS THEN
  -- Ignore if bucket already exists
  NULL;
END $$;

-- Create storage policy for authenticated users to upload
CREATE POLICY "Allow authenticated users to upload cafe logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cafe-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to update their own logos
CREATE POLICY "Allow authenticated users to update their own cafe logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cafe-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for authenticated users to delete their own logos
CREATE POLICY "Allow authenticated users to delete their own cafe logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cafe-logos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy for public to view cafe logos
CREATE POLICY "Allow public to view cafe logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cafe-logos');
