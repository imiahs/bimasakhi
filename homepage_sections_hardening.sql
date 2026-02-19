-- SAFE MIGRATION: Hardening homepage_sections
-- Run this in Supabase SQL Editor

-- 1. Add Versioning Columns
ALTER TABLE public.homepage_sections 
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create Trigger Function for updated_at and version bump
CREATE OR REPLACE FUNCTION update_homepage_section_meta()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Apply Trigger
DROP TRIGGER IF EXISTS update_homepage_section_meta_trigger ON public.homepage_sections;
CREATE TRIGGER update_homepage_section_meta_trigger
BEFORE UPDATE ON public.homepage_sections
FOR EACH ROW
EXECUTE FUNCTION update_homepage_section_meta();

-- 4. Rollback Readiness Note
-- Using 'version' allows us to track how many times a section changed.
-- Full rollback (snapshotting) would require a separate history table.
-- For V1, simple version increment is sufficient to detect stale clients.
