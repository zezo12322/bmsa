-- Exchange reviews: returning students rate their destination. Moderated:
-- anyone can submit, but only as unpublished; admins publish (Admin → Exchange Reviews).
-- Everything in a published row is public, so the table holds no contact details.
-- Run once in Supabase SQL Editor on an existing database. Safe to re-run.

create table if not exists public.bmsa_exchange_reviews (
  id uuid primary key default gen_random_uuid(),
  destination_slug text,
  country text not null check (char_length(country) between 1 and 80),
  program text not null check (program in ('scope', 'score')),
  period text check (char_length(period) <= 60),
  reviewer_name text check (char_length(reviewer_name) <= 80),
  rating_overall smallint not null check (rating_overall between 1 and 5),
  rating_hosting smallint not null check (rating_hosting between 1 and 5),
  rating_accommodation smallint not null check (rating_accommodation between 1 and 5),
  rating_budget smallint not null check (rating_budget between 1 and 5),
  rating_transport smallint not null check (rating_transport between 1 and 5),
  rating_social smallint not null check (rating_social between 1 and 5),
  comment text check (char_length(comment) <= 1500),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bmsa_exchange_reviews_slug_idx
  on public.bmsa_exchange_reviews (destination_slug) where published;

drop trigger if exists set_bmsa_exchange_reviews_updated_at on public.bmsa_exchange_reviews;
create trigger set_bmsa_exchange_reviews_updated_at before update on public.bmsa_exchange_reviews
for each row execute function public.set_updated_at();

alter table public.bmsa_exchange_reviews enable row level security;

drop policy if exists "Public read published" on public.bmsa_exchange_reviews;
drop policy if exists "Public submit unpublished" on public.bmsa_exchange_reviews;
drop policy if exists "Admins manage" on public.bmsa_exchange_reviews;
create policy "Public read published" on public.bmsa_exchange_reviews
  for select using (published = true);
create policy "Public submit unpublished" on public.bmsa_exchange_reviews
  for insert to anon, authenticated with check (published = false);
create policy "Admins manage" on public.bmsa_exchange_reviews
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
