-- Home stats, opportunities (open calls), documents library, certificate verification.
-- Run once in Supabase SQL Editor on an existing database. Safe to re-run.
-- Requires public.set_updated_at() and public.is_admin() from bmsa_vibe_cms.sql.

-- Home page numbers ---------------------------------------------------------
create table if not exists public.bmsa_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label_en text not null,
  label_ar text,
  sublabel_en text,
  sublabel_ar text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Open calls (OC calls, team recruitment, delegations...) --------------------
create table if not exists public.bmsa_opportunities (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  body_en text,
  body_ar text,
  tag_en text,
  tag_ar text,
  apply_url text,
  opens_at timestamptz,
  closes_at timestamptz not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Public documents (bylaws, reports, manuals, forms) -------------------------
create table if not exists public.bmsa_documents (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text,
  description_en text,
  description_ar text,
  category text not null default 'other',
  year integer,
  file_url text not null,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Certificates: never readable by the public; looked up one code at a time ---
create table if not exists public.bmsa_certificates (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  holder_name_en text not null,
  holder_name_ar text,
  title_en text not null,
  title_ar text,
  role_en text,
  role_ar text,
  issued_on date,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists bmsa_certificates_code_idx
  on public.bmsa_certificates (upper(btrim(code)));

do $$
declare t text;
begin
  foreach t in array array['bmsa_stats', 'bmsa_opportunities', 'bmsa_documents', 'bmsa_certificates'] loop
    execute format('drop trigger if exists set_%1$s_updated_at on public.%1$I', t);
    execute format('create trigger set_%1$s_updated_at before update on public.%1$I for each row execute function public.set_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "Admins manage" on public.%I', t);
    execute format('create policy "Admins manage" on public.%I for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()))', t);
  end loop;
  foreach t in array array['bmsa_stats', 'bmsa_opportunities', 'bmsa_documents'] loop
    execute format('drop policy if exists "Public read published" on public.%I', t);
    execute format('create policy "Public read published" on public.%I for select using (published = true)', t);
  end loop;
end $$;

-- Exact-code lookup. Returns at most one row and only the fields shown publicly.
create or replace function public.verify_certificate(p_code text)
returns table (
  holder_name_en text,
  holder_name_ar text,
  title_en text,
  title_ar text,
  role_en text,
  role_ar text,
  issued_on date
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.holder_name_en, c.holder_name_ar, c.title_en, c.title_ar, c.role_en, c.role_ar, c.issued_on
  from public.bmsa_certificates c
  where c.published and upper(btrim(c.code)) = upper(btrim(p_code))
  limit 1;
$$;

revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon, authenticated;

-- Seed the numbers already shown on the home page so admins can edit them.
insert into public.bmsa_stats (value, label_en, label_ar, sublabel_en, sublabel_ar, sort_order)
select * from (values
  ('500+', 'Active Members', 'عضو نشط', 'Building tomorrow''s physicians', 'نبني أطباء الغد', 10),
  ('6 + 5', 'Committees & Divisions', 'لجان وأقسام', '6 standing committees, 5 support divisions', '6 لجان دائمة و5 أقسام دعم', 30),
  ('10+', 'Years of Impact', 'عام من التأثير', 'IFMSA-Egypt local committee', 'لجنة محلية في IFMSA-Egypt', 40)
) as seed(value, label_en, label_ar, sublabel_en, sublabel_ar, sort_order)
where not exists (select 1 from public.bmsa_stats);
