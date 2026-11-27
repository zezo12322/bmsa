-- Exchange page: destinations and stories, managed from the admin panel.
-- Run once in Supabase SQL Editor on an existing database. Safe to re-run.
-- Requires public.set_updated_at() and public.is_admin() from bmsa_vibe_cms.sql.
--
-- No rows are inserted: while the destinations table is empty the site shows
-- example destinations; stories appear only once you add them.

create table if not exists public.bmsa_exchange_destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  country_en text not null,
  country_ar text,
  flag text,
  region text not null default 'europe'
    check (region in ('europe', 'americas', 'asia', 'africa', 'middle-east', 'oceania')),
  exchange_type text not null default 'scope' check (exchange_type in ('scope', 'score', 'both')),
  cities_en text,
  cities_ar text,
  fields_en text,
  fields_ar text,
  language_en text,
  language_ar text,
  notes_en text,
  notes_ar text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bmsa_exchange_stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  student_name_en text not null,
  student_name_ar text,
  academic_year_en text,
  academic_year_ar text,
  exchange_type text not null default 'scope' check (exchange_type in ('scope', 'score')),
  country_en text,
  country_ar text,
  flag text,
  host_en text,
  host_ar text,
  period_en text,
  period_ar text,
  quote_en text,
  quote_ar text,
  story_en text,
  story_ar text,
  image_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bmsa_exchange_destinations_published_order
  on public.bmsa_exchange_destinations(published, sort_order);
create index if not exists idx_bmsa_exchange_stories_published_order
  on public.bmsa_exchange_stories(published, sort_order);

drop trigger if exists set_bmsa_exchange_destinations_updated_at on public.bmsa_exchange_destinations;
create trigger set_bmsa_exchange_destinations_updated_at before update on public.bmsa_exchange_destinations
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_exchange_stories_updated_at on public.bmsa_exchange_stories;
create trigger set_bmsa_exchange_stories_updated_at before update on public.bmsa_exchange_stories
for each row execute function public.set_updated_at();

alter table public.bmsa_exchange_destinations enable row level security;
alter table public.bmsa_exchange_stories enable row level security;

-- public can read published; admins manage all
drop policy if exists "Public read published exchange destinations" on public.bmsa_exchange_destinations;
drop policy if exists "Admins manage exchange destinations" on public.bmsa_exchange_destinations;
create policy "Public read published exchange destinations" on public.bmsa_exchange_destinations
  for select using (published = true);
create policy "Admins manage exchange destinations" on public.bmsa_exchange_destinations
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

drop policy if exists "Public read published exchange stories" on public.bmsa_exchange_stories;
drop policy if exists "Admins manage exchange stories" on public.bmsa_exchange_stories;
create policy "Public read published exchange stories" on public.bmsa_exchange_stories
  for select using (published = true);
create policy "Admins manage exchange stories" on public.bmsa_exchange_stories
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
