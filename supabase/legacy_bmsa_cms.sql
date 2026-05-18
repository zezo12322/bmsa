-- BMSA Benisuef slim CMS schema.
-- Run this once in Supabase SQL Editor, then seed your first admin user.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists idx_admin_users_user_id on public.admin_users(user_id);

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
  );
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.bmsa_images (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text,
  category text,
  url text not null,
  alt_en text,
  alt_ar text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bmsa_merch_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text,
  description_en text,
  description_ar text,
  price_en text default 'Contact for price',
  price_ar text,
  image_url text,
  icon text default 'shirt',
  gradient text default 'linear-gradient(135deg,#C0392B,#922B21)',
  sizes text[] not null default array[]::text[],
  has_sizes boolean not null default false,
  in_stock boolean not null default true,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bmsa_activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  committee text not null,
  title_en text not null,
  title_ar text,
  excerpt_en text,
  excerpt_ar text,
  description_en text,
  description_ar text,
  tag_en text,
  tag_ar text,
  image_url text,
  icon text default 'calendar-days',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bmsa_board_members (
  id uuid primary key default gen_random_uuid(),
  tier text not null check (tier in ('eb', 'to')),
  position_title_en text not null,
  position_title_ar text,
  role_en text,
  role_ar text,
  member_name_en text default 'TBD',
  member_name_ar text,
  image_url text,
  icon text default 'user',
  gradient text default 'linear-gradient(135deg,#C0392B,#E15A4A)',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bmsa_images_key on public.bmsa_images(key);
create index if not exists idx_bmsa_merch_published_order on public.bmsa_merch_items(published, sort_order);
create index if not exists idx_bmsa_activities_published_order on public.bmsa_activities(published, sort_order);
create index if not exists idx_bmsa_board_published_order on public.bmsa_board_members(published, tier, sort_order);

drop trigger if exists set_bmsa_images_updated_at on public.bmsa_images;
create trigger set_bmsa_images_updated_at
before update on public.bmsa_images
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_merch_items_updated_at on public.bmsa_merch_items;
create trigger set_bmsa_merch_items_updated_at
before update on public.bmsa_merch_items
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_activities_updated_at on public.bmsa_activities;
create trigger set_bmsa_activities_updated_at
before update on public.bmsa_activities
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_board_members_updated_at on public.bmsa_board_members;
create trigger set_bmsa_board_members_updated_at
before update on public.bmsa_board_members
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.bmsa_images enable row level security;
alter table public.bmsa_merch_items enable row level security;
alter table public.bmsa_activities enable row level security;
alter table public.bmsa_board_members enable row level security;

drop policy if exists "Admins can read admin_users" on public.admin_users;
drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can read admin_users"
on public.admin_users for select
using (public.is_admin(auth.uid()));
create policy "Admins can manage admin_users"
on public.admin_users for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public read published images" on public.bmsa_images;
drop policy if exists "Admins manage images" on public.bmsa_images;
create policy "Public read published images"
on public.bmsa_images for select
using (published = true);
create policy "Admins manage images"
on public.bmsa_images for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public read published merch" on public.bmsa_merch_items;
drop policy if exists "Admins manage merch" on public.bmsa_merch_items;
create policy "Public read published merch"
on public.bmsa_merch_items for select
using (published = true);
create policy "Admins manage merch"
on public.bmsa_merch_items for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public read published activities" on public.bmsa_activities;
drop policy if exists "Admins manage activities" on public.bmsa_activities;
create policy "Public read published activities"
on public.bmsa_activities for select
using (published = true);
create policy "Admins manage activities"
on public.bmsa_activities for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Public read published board" on public.bmsa_board_members;
drop policy if exists "Admins manage board" on public.bmsa_board_members;
create policy "Public read published board"
on public.bmsa_board_members for select
using (published = true);
create policy "Admins manage board"
on public.bmsa_board_members for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bmsa-images',
  'bmsa-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read bmsa images bucket" on storage.objects;
drop policy if exists "Admins upload bmsa images bucket" on storage.objects;
drop policy if exists "Admins update bmsa images bucket" on storage.objects;
drop policy if exists "Admins delete bmsa images bucket" on storage.objects;

create policy "Public read bmsa images bucket"
on storage.objects for select
using (bucket_id = 'bmsa-images');

create policy "Admins upload bmsa images bucket"
on storage.objects for insert
to authenticated
with check (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

create policy "Admins update bmsa images bucket"
on storage.objects for update
to authenticated
using (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

create policy "Admins delete bmsa images bucket"
on storage.objects for delete
to authenticated
using (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

-- First admin seed example:
-- 1. Create a user in Supabase Authentication.
-- 2. Copy the user UUID.
-- 3. Run:
-- insert into public.admin_users (user_id, email, role)
-- values ('YOUR_AUTH_USER_UUID', 'admin@example.com', 'admin');
