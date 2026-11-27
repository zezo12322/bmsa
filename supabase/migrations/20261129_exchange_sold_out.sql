-- Exchange destinations: mark a destination as sold out until the next season.
-- Run once in Supabase SQL Editor on an existing database. Safe to re-run.

alter table public.bmsa_exchange_destinations
  add column if not exists sold_out boolean not null default false;
