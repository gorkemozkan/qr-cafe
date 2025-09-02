-- Create storage bucket for cafe logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cafe-logos',
  'cafe-logos',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

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
