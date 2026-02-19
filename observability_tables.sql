-- PHASE 6: OBSERVABILITY TABLES

-- 1. ERROR & EVENT LOGS (Lightweight)
-- Only for critical system events, not every render.
CREATE TABLE IF NOT EXISTS public.homepage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'DYNAMIC_RENDER', 'STATIC_FALLBACK', 'CRITICAL_FAILURE'
    message TEXT,
    meta JSONB, -- Context data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Public can INSERT logs (e.g. from client failures), but only Admin can READ.
ALTER TABLE public.homepage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Insert Logs" ON public.homepage_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin View Logs" ON public.homepage_logs
    FOR SELECT USING (auth.role() = 'service_role'); -- Simplified for V1

-- 2. AUDIT LOGS (Admin Activity)
-- Tracks who changed what configuration.
CREATE TABLE IF NOT EXISTS public.homepage_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'ROLLBACK'
    changed_by UUID DEFAULT auth.uid(),
    payload_snapshot JSONB, -- Store the props at time of change
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Only authenticated admins.
ALTER TABLE public.homepage_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Audit Access" ON public.homepage_audit_logs
    FOR ALL USING (auth.role() = 'authenticated');
