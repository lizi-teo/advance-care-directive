-- Storage bucket for signature images
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('signatures', 'signatures', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Allow anon users to upload signature images
CREATE POLICY "anon can upload to signatures bucket"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'signatures');

-- Allow anon users to read signature images (needed for the signed page)
CREATE POLICY "anon can read from signatures bucket"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'signatures');
