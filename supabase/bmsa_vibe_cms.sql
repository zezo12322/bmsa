-- BMSA Benisuef Vibe CMS schema.
-- Run in Supabase SQL Editor, then create an Auth user and insert it into admin_users.

create extension if not exists pgcrypto;

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  unique (user_id)
);

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

create table if not exists public.bmsa_activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  committee text not null check (committee in ('scome', 'scope', 'scoph', 'scora', 'score', 'scorp')),
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

create table if not exists public.bmsa_merch_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_ar text,
  description_en text,
  description_ar text,
  price_en text default 'Contact for price',
  price_ar text default 'تواصل لمعرفة السعر',
  image_url text,
  icon text default 'shirt',
  gradient text default 'linear-gradient(135deg,#c0392b,#922b21)',
  sizes text[] not null default array[]::text[],
  has_sizes boolean not null default false,
  in_stock boolean not null default true,
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
  member_name_ar text default 'يُعلن لاحقاً',
  image_url text,
  icon text default 'user',
  gradient text default 'linear-gradient(135deg,#c0392b,#e15a4a)',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tier, position_title_en)
);

create table if not exists public.bmsa_membership_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  faculty_year text,
  committee_preference text,
  motivation text,
  locale text default 'en',
  status text not null default 'new' check (status in ('new', 'contacted', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bmsa_merch_orders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  item_slug text not null,
  size text,
  quantity integer not null default 1,
  notes text,
  locale text default 'en',
  status text not null default 'new' check (status in ('new', 'contacted', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Functions ────────────────────────────────────────────────────────────────

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

-- Allow anon and authenticated roles to call is_admin via supabase.rpc()
grant execute on function public.is_admin(uuid) to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Indexes ──────────────────────────────────────────────────────────────────

create index if not exists idx_bmsa_activities_published_order on public.bmsa_activities(published, sort_order);
create index if not exists idx_bmsa_merch_published_order on public.bmsa_merch_items(published, sort_order);
create index if not exists idx_bmsa_board_published_order on public.bmsa_board_members(published, tier, sort_order);
create index if not exists idx_bmsa_applications_created_at on public.bmsa_membership_applications(created_at desc);
create index if not exists idx_bmsa_orders_created_at on public.bmsa_merch_orders(created_at desc);

-- ── Triggers ─────────────────────────────────────────────────────────────────

drop trigger if exists set_bmsa_images_updated_at on public.bmsa_images;
create trigger set_bmsa_images_updated_at before update on public.bmsa_images
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_activities_updated_at on public.bmsa_activities;
create trigger set_bmsa_activities_updated_at before update on public.bmsa_activities
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_merch_items_updated_at on public.bmsa_merch_items;
create trigger set_bmsa_merch_items_updated_at before update on public.bmsa_merch_items
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_board_members_updated_at on public.bmsa_board_members;
create trigger set_bmsa_board_members_updated_at before update on public.bmsa_board_members
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_membership_applications_updated_at on public.bmsa_membership_applications;
create trigger set_bmsa_membership_applications_updated_at before update on public.bmsa_membership_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_bmsa_merch_orders_updated_at on public.bmsa_merch_orders;
create trigger set_bmsa_merch_orders_updated_at before update on public.bmsa_merch_orders
for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.admin_users enable row level security;
alter table public.bmsa_images enable row level security;
alter table public.bmsa_activities enable row level security;
alter table public.bmsa_merch_items enable row level security;
alter table public.bmsa_board_members enable row level security;
alter table public.bmsa_membership_applications enable row level security;
alter table public.bmsa_merch_orders enable row level security;

-- admin_users: only admins can read/write
drop policy if exists "Admins can read admin_users" on public.admin_users;
drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can read admin_users" on public.admin_users
  for select using (public.is_admin(auth.uid()));
create policy "Admins can manage admin_users" on public.admin_users
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_images: public can read published; admins manage all
drop policy if exists "Public read published images" on public.bmsa_images;
drop policy if exists "Admins manage images" on public.bmsa_images;
create policy "Public read published images" on public.bmsa_images
  for select using (published = true);
create policy "Admins manage images" on public.bmsa_images
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_activities: public can read published; admins manage all
drop policy if exists "Public read published activities" on public.bmsa_activities;
drop policy if exists "Admins manage activities" on public.bmsa_activities;
create policy "Public read published activities" on public.bmsa_activities
  for select using (published = true);
create policy "Admins manage activities" on public.bmsa_activities
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_merch_items: public can read published; admins manage all
drop policy if exists "Public read published merch" on public.bmsa_merch_items;
drop policy if exists "Admins manage merch" on public.bmsa_merch_items;
create policy "Public read published merch" on public.bmsa_merch_items
  for select using (published = true);
create policy "Admins manage merch" on public.bmsa_merch_items
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_board_members: public can read published; admins manage all
drop policy if exists "Public read published board" on public.bmsa_board_members;
drop policy if exists "Admins manage board" on public.bmsa_board_members;
create policy "Public read published board" on public.bmsa_board_members
  for select using (published = true);
create policy "Admins manage board" on public.bmsa_board_members
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_membership_applications: anyone can insert; admins manage/read all; no public reads
drop policy if exists "Public insert applications" on public.bmsa_membership_applications;
drop policy if exists "Admins manage applications" on public.bmsa_membership_applications;
create policy "Public insert applications" on public.bmsa_membership_applications
  for insert to anon, authenticated with check (true);
create policy "Admins manage applications" on public.bmsa_membership_applications
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- bmsa_merch_orders: anyone can insert; admins manage/read all; no public reads
drop policy if exists "Public insert merch orders" on public.bmsa_merch_orders;
drop policy if exists "Admins manage merch orders" on public.bmsa_merch_orders;
create policy "Public insert merch orders" on public.bmsa_merch_orders
  for insert to anon, authenticated with check (true);
create policy "Admins manage merch orders" on public.bmsa_merch_orders
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ── Storage bucket ────────────────────────────────────────────────────────────

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

create policy "Public read bmsa images bucket" on storage.objects
  for select using (bucket_id = 'bmsa-images');

create policy "Admins upload bmsa images bucket" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

create policy "Admins update bmsa images bucket" on storage.objects
  for update to authenticated
  using (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()))
  with check (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

create policy "Admins delete bmsa images bucket" on storage.objects
  for delete to authenticated
  using (bucket_id = 'bmsa-images' and public.is_admin(auth.uid()));

-- ── Seed: image overrides ─────────────────────────────────────────────────────

insert into public.bmsa_images (key, label, category, url, alt_en, alt_ar, sort_order)
values
  ('images/logos/bmsa-logo-h.png',       'BMSA horizontal logo',       'Logos',  '/images/logos/bmsa-logo-h.png',       'BMSA Benisuef',             'بمسا بني سويف',             1),
  ('images/logos/bmsa-logo-h-white.png', 'BMSA white horizontal logo', 'Logos',  '/images/logos/bmsa-logo-h-white.png', 'BMSA Benisuef',             'بمسا بني سويف',             2),
  ('images/logos/bmsa-logo-v.png',       'BMSA vertical logo',         'Logos',  '/images/logos/bmsa-logo-v.png',       'BMSA Benisuef',             'بمسا بني سويف',             3),
  ('images/logos/ifmsa-egypt.png',       'IFMSA Egypt logo',           'Logos',  '/images/logos/ifmsa-egypt.png',       'IFMSA Egypt',               'IFMSA مصر',                 4),
  ('images/hero/hero-main.jpg',          'Home page hero image',       'Heroes', '/images/hero/hero-main.jpg',          'BMSA Benisuef students',    'طلاب بمسا بني سويف',        10),
  ('images/about/about-team.jpg',        'About page team photo',      'About',  '/images/about/about-team.jpg',        'BMSA team',                 'فريق بمسا',                 11),
  ('images/about/about-history.jpg',     'About page history photo',   'About',  '/images/about/about-history.jpg',     'BMSA history',              'تاريخ بمسا',                12)
on conflict (key) do update
set label    = excluded.label,
    category = excluded.category,
    url      = excluded.url,
    alt_en   = excluded.alt_en,
    alt_ar   = excluded.alt_ar,
    sort_order = excluded.sort_order;

-- ── Seed: activities (one per committee) ─────────────────────────────────────

insert into public.bmsa_activities
  (slug, committee, title_en, title_ar, excerpt_en, excerpt_ar, description_en, description_ar, tag_en, tag_ar, icon, sort_order)
values
  (
    'peer-teaching-program',
    'scome',
    'Peer-Teaching Program',
    'برنامج التعليم بين الزملاء',
    'Student-led anatomy and physiology sessions for first-year students.',
    'جلسات تشريح وفسيولوجيا يقودها الطلاب لطلاب الفرقة الأولى.',
    'SCOME organises weekly peer-teaching sessions covering core pre-clinical subjects, helping first and second-year students build confidence and academic skills.',
    'تنظم SCOME جلسات تعليمية أسبوعية بين الزملاء تغطي المواد الأساسية قبل السريرية، مما يساعد طلاب الفرقتين الأولى والثانية.',
    'SCOME - Medical Education',
    'SCOME - التعليم الطبي',
    'book',
    1
  ),
  (
    'world-aids-day',
    'scora',
    'World AIDS Day Campaign',
    'حملة اليوم العالمي للإيدز',
    'Community awareness and stigma-reduction campaign held on 1 December.',
    'حملة توعية مجتمعية لتقليل الوصمة تُقام في الأول من ديسمبر.',
    'SCORA organised a public awareness day covering HIV prevention, testing, and community support services in partnership with Beni Suef University Hospital.',
    'نظمت SCORA يوم توعية عامة حول الوقاية من HIV والفحص وخدمات الدعم المجتمعي بالشراكة مع مستشفى جامعة بني سويف.',
    'SCORA - Public Campaign',
    'SCORA - حملة عامة',
    'ribbon',
    2
  ),
  (
    'clinical-exchange-germany',
    'scope',
    'Clinical Exchange — Germany',
    'تبادل إكلينيكي — ألمانيا',
    'Students joined a four-week clinical clerkship at a partner hospital abroad.',
    'شارك الطلاب في تدريب إكلينيكي مدته أربعة أسابيع في مستشفى شريك بالخارج.',
    'SCOPE supported outgoing students with pre-departure orientation, host family coordination, and a post-exchange debrief to ensure a high-quality experience.',
    'دعمت SCOPE الطلاب المغادرين بتوجيه قبل المغادرة وتنسيق مع الأسر المضيفة وجلسة إحاطة بعد التبادل لضمان تجربة عالية الجودة.',
    'SCOPE - Exchange',
    'SCOPE - تبادل',
    'plane',
    3
  ),
  (
    'cardiovascular-health-week',
    'scoph',
    'Cardiovascular Health Week',
    'أسبوع صحة القلب والأوعية الدموية',
    'Free blood-pressure screening and heart-health awareness across campus.',
    'فحص ضغط الدم المجاني وتوعية بصحة القلب في الحرم الجامعي.',
    'SCOPH set up screening booths across the Faculty of Medicine campus, offering blood-pressure checks, BMI measurements, and health-education sessions delivered by senior students.',
    'أقامت SCOPH أكشاك فحص في أرجاء كلية الطب، وقدمت قياسات ضغط الدم ومؤشر كتلة الجسم وجلسات تثقيف صحي يقدمها طلاب السنوات العليا.',
    'SCOPH - Health Campaign',
    'SCOPH - حملة صحية',
    'heart-pulse',
    4
  ),
  (
    'research-skills-workshop',
    'score',
    'Research Skills Workshop',
    'ورشة مهارات البحث العلمي',
    'Hands-on training in literature review, statistics, and academic writing.',
    'تدريب عملي على مراجعة الأدبيات والإحصاء والكتابة الأكاديمية.',
    'SCORE delivered a two-day workshop covering PubMed search strategies, biostatistics fundamentals, and manuscript structure to help students publish their first research paper.',
    'قدمت SCORE ورشة عمل مدتها يومان تغطي استراتيجيات البحث على PubMed وأساسيات الإحصاء الحيوي وبنية المخطوطات لمساعدة الطلاب على نشر أول ورقة بحثية.',
    'SCORE - Research Training',
    'SCORE - تدريب بحثي',
    'flask',
    5
  ),
  (
    'mental-health-awareness-day',
    'scorp',
    'Mental Health Awareness Day',
    'يوم التوعية بالصحة النفسية',
    'Open discussion forums and professional counselling sign-up for students.',
    'منتديات نقاش مفتوحة وتسجيل للإرشاد المهني للطلاب.',
    'SCORP partnered with the university counselling centre to host a day of open conversations about student stress, anxiety, and mental wellbeing, reducing stigma around seeking help.',
    'تعاونت SCORP مع مركز الإرشاد الجامعي لاستضافة يوم من المحادثات المفتوحة حول ضغوط الطلاب والقلق والرفاهية النفسية، مما يقلل من الوصمة المرتبطة بطلب المساعدة.',
    'SCORP - Mental Health',
    'SCORP - الصحة النفسية',
    'scale',
    6
  )
on conflict (slug) do update
set title_en       = excluded.title_en,
    title_ar       = excluded.title_ar,
    excerpt_en     = excluded.excerpt_en,
    excerpt_ar     = excluded.excerpt_ar,
    description_en = excluded.description_en,
    description_ar = excluded.description_ar,
    tag_en         = excluded.tag_en,
    tag_ar         = excluded.tag_ar,
    icon           = excluded.icon,
    sort_order     = excluded.sort_order;

-- ── Seed: merch items ─────────────────────────────────────────────────────────

insert into public.bmsa_merch_items
  (slug, name_en, name_ar, description_en, description_ar, price_en, price_ar, icon, gradient, sizes, has_sizes, in_stock, sort_order)
values
  (
    'hoodie',
    'BMSA Hoodie',
    'هودي بمسا',
    'Heavyweight cotton-blend hoodie with embroidered BMSA Benisuef logo on the chest.',
    'هودي ثقيل من مزيج القطن مع شعار بمسا بني سويف مطرّز على الصدر.',
    '350 EGP',
    '٣٥٠ جنيه',
    'shirt',
    'linear-gradient(135deg,#c0392b,#922b21)',
    array['S','M','L','XL','XXL'],
    true,
    true,
    1
  ),
  (
    'tshirt',
    'BMSA T-shirt',
    'تيشيرت بمسا',
    '100% cotton T-shirt with BMSA Benisuef screen-printed graphic on the back.',
    'تيشيرت 100% قطن مع رسم طباعي لبمسا بني سويف على الظهر.',
    '180 EGP',
    '١٨٠ جنيه',
    'shirt',
    'linear-gradient(135deg,#1565c0,#42a5f5)',
    array['S','M','L','XL','XXL'],
    true,
    true,
    2
  ),
  (
    'labcoat',
    'Lab Coat',
    'روب المختبر',
    'White professional medical lab coat with embroidered BMSA logo on the left chest pocket.',
    'روب طبي أبيض احترافي مع شعار بمسا مطرّز على جيب الصدر الأيسر.',
    '450 EGP',
    '٤٥٠ جنيه',
    'stethoscope',
    'linear-gradient(135deg,#607d8b,#90a4ae)',
    array['S','M','L','XL','XXL'],
    true,
    true,
    3
  ),
  (
    'tote-bag',
    'BMSA Tote Bag',
    'حقيبة بمسا',
    'Canvas tote bag with BMSA Benisuef logo. Ideal for clinical rotations and campus life.',
    'حقيبة كانفاس بشعار بمسا بني سويف. مثالية للتدريب الإكلينيكي والحياة الجامعية.',
    '120 EGP',
    '١٢٠ جنيه',
    'bag',
    'linear-gradient(135deg,#5c4033,#a1887f)',
    array[]::text[],
    false,
    true,
    4
  )
on conflict (slug) do update
set name_en        = excluded.name_en,
    name_ar        = excluded.name_ar,
    description_en = excluded.description_en,
    description_ar = excluded.description_ar,
    price_en       = excluded.price_en,
    price_ar       = excluded.price_ar,
    icon           = excluded.icon,
    gradient       = excluded.gradient,
    sizes          = excluded.sizes,
    has_sizes      = excluded.has_sizes,
    in_stock       = excluded.in_stock,
    sort_order     = excluded.sort_order;

-- ── Seed: board members ───────────────────────────────────────────────────────

insert into public.bmsa_board_members
  (tier, position_title_en, position_title_ar, role_en, role_ar, member_name_en, member_name_ar, gradient, sort_order)
values
  -- Executive Board
  (
    'eb', 'President', 'الرئيس',
    'BMSA Benisuef', 'بمسا بني سويف',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#c0392b,#e15a4a)', 1
  ),
  (
    'eb', 'Vice President for Internal Affairs', 'نائب الرئيس للشؤون الداخلية',
    'Executive Board', 'المجلس التنفيذي',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#922b21,#c0392b)', 2
  ),
  (
    'eb', 'Vice President for External Affairs', 'نائب الرئيس للشؤون الخارجية',
    'Executive Board', 'المجلس التنفيذي',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#b7950b,#d4ac0d)', 3
  ),
  -- Technical Officers
  (
    'to', 'SCOME Officer', 'مسؤول SCOME',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#2f9e44,#69db7c)', 4
  ),
  (
    'to', 'SCOPE Officer', 'مسؤول SCOPE',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#1864ab,#4dabf7)', 5
  ),
  (
    'to', 'SCOPH Officer', 'مسؤول SCOPH',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#d6336c,#f783ac)', 6
  ),
  (
    'to', 'SCORA Officer', 'مسؤول SCORA',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#862e9c,#cc5de8)', 7
  ),
  (
    'to', 'SCORE Officer', 'مسؤول SCORE',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#e67700,#ffa94d)', 8
  ),
  (
    'to', 'SCORP Officer', 'مسؤول SCORP',
    'Technical Officer', 'مسؤول تقني',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#495057,#adb5bd)', 9
  )
on conflict (tier, position_title_en) do update
set position_title_ar = excluded.position_title_ar,
    role_en           = excluded.role_en,
    role_ar           = excluded.role_ar,
    gradient          = excluded.gradient,
    sort_order        = excluded.sort_order;

-- ── Seed: demo applications and orders (for testing reports) ──────────────────
-- Remove or replace with real data before going live.

insert into public.bmsa_membership_applications
  (name, email, phone, faculty_year, committee_preference, motivation, locale)
values
  (
    'Ahmed Mohamed Ali',
    'ahmed.ali@example.com',
    '01012345678',
    'Third year',
    'scoph',
    'I want to contribute to public health campaigns and help communities in Beni Suef access better healthcare information.',
    'en'
  ),
  (
    'Sara Hassan Ibrahim',
    'sara.hassan@example.com',
    '01098765432',
    'Second year',
    'scome',
    'Medical education is my passion. I want to organise peer-teaching sessions and skills workshops for my colleagues.',
    'en'
  ),
  (
    'يوسف عبدالله',
    'youssef@example.com',
    '01111111111',
    'الفرقة الرابعة',
    'score',
    'أرغب في تطوير مهاراتي البحثية والمشاركة في مشاريع النشر العلمي ضمن لجنة SCORE.',
    'ar'
  ),
  (
    'Mariam Tarek',
    'mariam.t@example.com',
    '01066677788',
    'First year',
    'scora',
    'I am passionate about reproductive health awareness and fighting stigma in the community.',
    'en'
  ),
  (
    'Omar Salah',
    'omar.salah@example.com',
    '01099887766',
    'Third year',
    'scope',
    'I have always dreamed of doing a clinical exchange abroad. SCOPE is the perfect place to start.',
    'en'
  );

insert into public.bmsa_merch_orders
  (name, email, phone, item_slug, size, quantity, notes, locale)
values
  (
    'Nour Ahmed',
    'nour@example.com',
    '01055554444',
    'hoodie',
    'M',
    1,
    'Please use white colour if available.',
    'en'
  ),
  (
    'Mohamed Khaled',
    'mkhaled@example.com',
    '01033332222',
    'labcoat',
    'L',
    2,
    null,
    'en'
  ),
  (
    'Rana Ibrahim',
    'rana.ibrahim@example.com',
    '01022334455',
    'tshirt',
    'S',
    1,
    null,
    'en'
  );

-- ── First admin user ──────────────────────────────────────────────────────────
-- 1. Go to Supabase Dashboard → Authentication → Users → Add user.
-- 2. Create a user with email and password.
-- 3. Copy the new user's UUID from the user list.
-- 4. Run the INSERT below (replace the UUID and email):
--
-- insert into public.admin_users (user_id, email, role)
-- values ('YOUR_AUTH_USER_UUID', 'admin@example.com', 'admin');
