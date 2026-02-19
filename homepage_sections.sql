-- SAFE MIGRATION: Create homepage_sections table
-- Run this in Supabase SQL Editor

create table if not exists public.homepage_sections (
  id uuid not null default gen_random_uuid(),
  type text not null,
  props jsonb default '{}'::jsonb,
  order_index integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  constraint homepage_sections_pkey primary key (id)
);

-- Indexes for performance
create index if not exists idx_homepage_sections_active_order on public.homepage_sections (is_active, order_index);

-- RLS Policies
alter table public.homepage_sections enable row level security;

-- Allow public read access (Anonymous users need to see the homepage)
create policy "Allow public read access"
on public.homepage_sections
for select
to anom, authenticated
using (true);

-- Allow authenticated users (Admin) to modify
create policy "Allow authenticated insert"
on public.homepage_sections
for insert
to authenticated
with check (true);

create policy "Allow authenticated update"
on public.homepage_sections
for update
to authenticated
using (true);

create policy "Allow authenticated delete"
on public.homepage_sections
for delete
to authenticated
using (true);
