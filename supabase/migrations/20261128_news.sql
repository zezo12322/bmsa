-- News: BMSA-wide updates that are not committee activities (recruitment,
-- team announcements, partnerships, tips series, greetings, division intros).
-- Run once in Supabase SQL Editor on an existing database. Safe to re-run.
-- Requires public.set_updated_at() and public.is_admin() from bmsa_vibe_cms.sql.

create table if not exists public.bmsa_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text,
  excerpt_en text,
  excerpt_ar text,
  body_en text,
  body_ar text,
  tag_en text,
  tag_ar text,
  image_url text,
  posted_at timestamptz,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bmsa_news_published_sort_idx
  on public.bmsa_news(published, sort_order);

drop trigger if exists set_bmsa_news_updated_at on public.bmsa_news;
create trigger set_bmsa_news_updated_at before update on public.bmsa_news
for each row execute function public.set_updated_at();

alter table public.bmsa_news enable row level security;

drop policy if exists "Public read published news" on public.bmsa_news;
drop policy if exists "Admins manage news" on public.bmsa_news;
create policy "Public read published news" on public.bmsa_news
  for select using (published = true);
create policy "Admins manage news" on public.bmsa_news
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
