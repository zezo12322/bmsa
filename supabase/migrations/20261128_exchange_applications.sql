-- Exchange countdown + pre-application form.
-- Run once in Supabase SQL Editor AFTER 20261127_exchange.sql. Safe to re-run.
--
--   bmsa_exchange_calls         application windows (admin: Exchange Calls)
--   bmsa_exchange_applications  pre-applications from the Exchange page
--                               (admin: Exchange Applications; public insert only)

create table if not exists public.bmsa_exchange_calls (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  exchange_type text not null default 'both' check (exchange_type in ('scope', 'score', 'both')),
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  details_en text,
  details_ar text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bmsa_exchange_calls_window_check check (closes_at > opens_at)
);

create table if not exists public.bmsa_exchange_applications (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references public.bmsa_exchange_calls(id) on delete set null,
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 160),
  phone text not null check (char_length(phone) <= 40),
  faculty_year text,
  membership_status text check (membership_status in ('active', 'new', 'not-yet')),
  program text not null check (program in ('scope', 'score', 'either')),
  preferred_destinations text[] not null default array[]::text[],
  preferred_period text,
  languages text,
  motivation text check (char_length(motivation) <= 3000),
  locale text default 'en',
  status text not null default 'new' check (status in ('new', 'contacted', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bmsa_exchange_calls_window on public.bmsa_exchange_calls(published, opens_at, closes_at);
create index if not exists idx_bmsa_exchange_applications_created_at on public.bmsa_exchange_applications(created_at desc);

drop trigger if exists set_bmsa_exchange_calls_updated_at on public.bmsa_exchange_calls;
create trigger set_bmsa_exchange_calls_updated_at before update on public.bmsa_exchange_calls
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_exchange_applications_updated_at on public.bmsa_exchange_applications;
create trigger set_bmsa_exchange_applications_updated_at before update on public.bmsa_exchange_applications
for each row execute function public.set_updated_at();

alter table public.bmsa_exchange_calls enable row level security;
alter table public.bmsa_exchange_applications enable row level security;

-- bmsa_exchange_calls: public can read published; admins manage all
drop policy if exists "Public read published exchange calls" on public.bmsa_exchange_calls;
drop policy if exists "Admins manage exchange calls" on public.bmsa_exchange_calls;
create policy "Public read published exchange calls" on public.bmsa_exchange_calls
  for select using (published = true);
create policy "Admins manage exchange calls" on public.bmsa_exchange_calls
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_exchange_applications: anyone can insert; admins manage/read all; no public reads
drop policy if exists "Public insert exchange applications" on public.bmsa_exchange_applications;
drop policy if exists "Admins manage exchange applications" on public.bmsa_exchange_applications;
create policy "Public insert exchange applications" on public.bmsa_exchange_applications
  for insert to anon, authenticated with check (true);
create policy "Admins manage exchange applications" on public.bmsa_exchange_applications
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
