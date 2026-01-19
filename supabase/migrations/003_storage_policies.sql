-- ============================================
-- La Verdad Oculta - Storage Policies
-- Migration 003: Storage Bucket & Policies
-- ============================================

-- Note: Run this in Supabase SQL Editor
-- Storage bucket creation must be done via Supabase Dashboard or API

-- ============================================
-- Storage Policies for 'media' bucket
-- ============================================

-- Allow public read access to all files in the media bucket
CREATE POLICY "Public can view media files"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'media');

-- Allow admin/editor to upload files
CREATE POLICY "Admin/Editor can upload media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'media' 
        AND public.is_admin_or_editor()
    );

-- Allow admin/editor to update files
CREATE POLICY "Admin/Editor can update media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'media' 
        AND public.is_admin_or_editor()
    )
    WITH CHECK (
        bucket_id = 'media' 
        AND public.is_admin_or_editor()
    );

-- Allow admin/editor to delete files
CREATE POLICY "Admin/Editor can delete media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'media' 
        AND public.is_admin_or_editor()
    );

-- ============================================
-- Instructions for bucket creation:
-- ============================================
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'media'
-- 3. Set it as a PUBLIC bucket
-- 4. Run the policies above in the SQL Editor
-- ============================================
