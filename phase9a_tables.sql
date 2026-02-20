-- ============================================================
-- PHASE 9A — FOUNDATION TABLES
-- Run each section in Supabase SQL Editor IN ORDER.
-- Verify after each section before running the next.
-- ============================================================


-- ============================================================
-- SECTION 0: SHARED TRIGGER FUNCTION (Run First)
-- Auto-updates `updated_at` on any UPDATE operation.
-- Reusable across all tables.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- SECTION 1: PAGES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pages (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    seo_title TEXT,
    seo_description TEXT,
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT pages_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON public.pages (slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages (status);

-- Auto-update trigger
DROP TRIGGER IF EXISTS trigger_pages_updated_at ON public.pages;
CREATE TRIGGER trigger_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published pages"
ON public.pages FOR SELECT
USING (status = 'published');

CREATE POLICY "Service role full access pages"
ON public.pages FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ============================================================
-- SECTION 2: PAGE SECTIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    props JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT page_sections_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_order
ON public.page_sections (page_id, order_index);

-- Auto-update trigger
DROP TRIGGER IF EXISTS trigger_page_sections_updated_at ON public.page_sections;
CREATE TRIGGER trigger_page_sections_updated_at
BEFORE UPDATE ON public.page_sections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published page sections"
ON public.page_sections FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.pages
        WHERE pages.id = page_sections.page_id
        AND pages.status = 'published'
    )
);

CREATE POLICY "Service role full access page_sections"
ON public.page_sections FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ============================================================
-- SECTION 3: BLOG POSTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    body TEXT,
    excerpt TEXT,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author TEXT DEFAULT 'Admin',
    tags TEXT[] DEFAULT '{}',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC);

-- Auto-update trigger
DROP TRIGGER IF EXISTS trigger_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trigger_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts"
ON public.blog_posts FOR SELECT
USING (status = 'published');

CREATE POLICY "Service role full access blog_posts"
ON public.blog_posts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- ============================================================
-- SECTION 4: NAVIGATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.navigation (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    menu_group TEXT NOT NULL CHECK (menu_group IN ('header', 'footer')),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    target TEXT DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT navigation_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_navigation_group_order
ON public.navigation (menu_group, order_index);

-- Auto-update trigger
DROP TRIGGER IF EXISTS trigger_navigation_updated_at ON public.navigation;
CREATE TRIGGER trigger_navigation_updated_at
BEFORE UPDATE ON public.navigation
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active navigation"
ON public.navigation FOR SELECT
USING (is_active = true);

CREATE POLICY "Service role full access navigation"
ON public.navigation FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
