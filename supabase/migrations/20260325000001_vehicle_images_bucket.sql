-- Migration: Vehicle Images Storage Bucket
-- Creates the Supabase Storage bucket for AI-generated vehicle images
-- and adds blur_data_url column for instant placeholder display.

-- Add blur_data_url column to vehicles table
-- (stores a tiny base64-encoded blurred placeholder generated alongside the image)
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS blur_data_url TEXT;

-- Create the vehicle-images storage bucket (public read, service-role write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-images',
  'vehicle-images',
  true,
  10485760,  -- 10 MB per image
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read vehicle images (they are public press photos)
CREATE POLICY "Public read access for vehicle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle-images');

-- Only the service role (Edge Functions) may insert/update/delete
CREATE POLICY "Service role write access for vehicle images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role update access for vehicle images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicle-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete access for vehicle images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle-images' AND auth.role() = 'service_role');
