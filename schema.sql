-- UB. Studio Platform — Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  division text not null check (division in ('pictures','animation')),
  year integer,
  color text not null default '#18bdf2',
  description text default '',
  image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Public site: only published projects are readable.
create policy "Public can read published projects"
on public.projects for select
using (published = true);

-- Admins use Supabase Auth. For a simple single-owner deployment, grant writes
-- to authenticated users. For a multi-admin deployment, replace these policies
-- with a role table / custom claim.
create policy "Authenticated users can insert projects"
on public.projects for insert to authenticated with check (true);
create policy "Authenticated users can update projects"
on public.projects for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete projects"
on public.projects for delete to authenticated using (true);

insert into storage.buckets (id,name,public) values ('project-art','project-art',true) on conflict (id) do nothing;

create policy "Public can view project art"
on storage.objects for select
using (bucket_id = 'project-art');
create policy "Authenticated can upload project art"
on storage.objects for insert to authenticated
with check (bucket_id = 'project-art');
create policy "Authenticated can update project art"
on storage.objects for update to authenticated
using (bucket_id = 'project-art') with check (bucket_id = 'project-art');
create policy "Authenticated can delete project art"
on storage.objects for delete to authenticated
using (bucket_id = 'project-art');
