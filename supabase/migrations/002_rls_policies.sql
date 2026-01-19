-- ============================================
-- La Verdad Oculta - Row Level Security Policies
-- Migration 002: RLS Policies
-- ============================================

-- ============================================
-- Helper Functions
-- ============================================

-- Check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has admin or editor role
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role IN ('admin', 'editor')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Enable RLS on all tables
-- ============================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- User Roles Policies
-- ============================================

-- Admin can view all roles
CREATE POLICY "Admin can view all roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Admin can insert roles
CREATE POLICY "Admin can insert roles"
    ON public.user_roles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Admin can update roles
CREATE POLICY "Admin can update roles"
    ON public.user_roles FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Admin can delete roles
CREATE POLICY "Admin can delete roles"
    ON public.user_roles FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- ============================================
-- Posts Policies
-- ============================================

-- Public can read published posts
CREATE POLICY "Public can read published posts"
    ON public.posts FOR SELECT
    TO anon, authenticated
    USING (status = 'published' AND published_at <= NOW());

-- Admin/Editor can read all posts
CREATE POLICY "Admin/Editor can read all posts"
    ON public.posts FOR SELECT
    TO authenticated
    USING (public.is_admin_or_editor());

-- Admin/Editor can insert posts
CREATE POLICY "Admin/Editor can insert posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can update posts
CREATE POLICY "Admin/Editor can update posts"
    ON public.posts FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can delete posts
CREATE POLICY "Admin/Editor can delete posts"
    ON public.posts FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================
-- Pages Policies
-- ============================================

-- Public can read all pages
CREATE POLICY "Public can read all pages"
    ON public.pages FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin/Editor can insert pages
CREATE POLICY "Admin/Editor can insert pages"
    ON public.pages FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can update pages
CREATE POLICY "Admin/Editor can update pages"
    ON public.pages FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can delete pages
CREATE POLICY "Admin/Editor can delete pages"
    ON public.pages FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================
-- Media Policies
-- ============================================

-- Public can read all media
CREATE POLICY "Public can read all media"
    ON public.media FOR SELECT
    TO anon, authenticated
    USING (true);

-- Admin/Editor can insert media
CREATE POLICY "Admin/Editor can insert media"
    ON public.media FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can update media
CREATE POLICY "Admin/Editor can update media"
    ON public.media FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_editor())
    WITH CHECK (public.is_admin_or_editor());

-- Admin/Editor can delete media
CREATE POLICY "Admin/Editor can delete media"
    ON public.media FOR DELETE
    TO authenticated
    USING (public.is_admin_or_editor());

-- ============================================
-- Contact Submissions Policies
-- ============================================

-- Anyone can insert contact submissions (with rate limiting in app)
CREATE POLICY "Anyone can submit contact form"
    ON public.contact_submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only admin can read contact submissions
CREATE POLICY "Admin can read contact submissions"
    ON public.contact_submissions FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Only admin can update contact submissions (mark as read)
CREATE POLICY "Admin can update contact submissions"
    ON public.contact_submissions FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admin can delete contact submissions
CREATE POLICY "Admin can delete contact submissions"
    ON public.contact_submissions FOR DELETE
    TO authenticated
    USING (public.is_admin());
