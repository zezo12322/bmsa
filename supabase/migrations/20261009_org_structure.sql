-- Org structure update for an existing BMSA database.
-- Run once in Supabase SQL Editor. Safe to re-run.
--
--   Executive Board (eb): President, Vice President, Secretary General
--   Team of Officials (TO):
--     to  = Standing Committee Officers (one per committee, 6)
--     sdd = Support Division Directors (one per division, 5)
--
-- Existing member names and photos are kept for every position that still
-- exists. Rows for removed positions (VP Internal / VP External) are deleted.

begin;

-- Tiers: eb = Executive Board, to = Team of Officials (TO) Standing Committee
-- Officers, sdd = Team of Officials (TO) Support Division Directors.
-- Re-create the check so databases created before 'sdd' existed accept it.
alter table public.bmsa_board_members drop constraint if exists bmsa_board_members_tier_check;
alter table public.bmsa_board_members
  add constraint bmsa_board_members_tier_check check (tier in ('eb', 'to', 'sdd'));

-- Databases created from legacy_bmsa_cms.sql lack the (tier, position) unique
-- key the upsert below relies on. No-op when it already exists.
create unique index if not exists bmsa_board_members_tier_position_title_en_key
  on public.bmsa_board_members (tier, position_title_en);

-- The Executive Board has exactly three positions. Remove positions that no
-- longer exist so re-running this script corrects older databases.
delete from public.bmsa_board_members
where tier = 'eb'
  and position_title_en not in ('President', 'Vice President', 'Secretary General');

-- SCOPE and SCORE each have their own officer.
delete from public.bmsa_board_members
where tier = 'to' and position_title_en = 'SCOPE and SCORE Officer';

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
    'eb', 'Vice President', 'نائب الرئيس',
    'Executive Board', 'المجلس التنفيذي',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#922b21,#c0392b)', 2
  ),
  (
    'eb', 'Secretary General', 'الأمين العام',
    'Executive Board', 'المجلس التنفيذي',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#b7950b,#d4ac0d)', 3
  ),
  -- Team of Officials (TO): Standing Committee Officers
  (
    'to', 'SCOME Officer', 'مسؤول SCOME',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#2f9e44,#69db7c)', 4
  ),
  (
    'to', 'SCOPE Officer', 'مسؤول SCOPE',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#1864ab,#4dabf7)', 5
  ),
  (
    'to', 'SCOPH Officer', 'مسؤول SCOPH',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#d6336c,#f783ac)', 6
  ),
  (
    'to', 'SCORA Officer', 'مسؤول SCORA',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#862e9c,#cc5de8)', 7
  ),
  (
    'to', 'SCORE Officer', 'مسؤول SCORE',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#e67700,#ffa94d)', 8
  ),
  (
    'to', 'SCORP Officer', 'مسؤول SCORP',
    'Standing Committee Officer', 'مسؤول لجنة دائمة',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#495057,#adb5bd)', 9
  ),
  -- Team of Officials (TO): Support Division Directors
  (
    'sdd', 'CBSD Director', 'مدير CBSD',
    'Support Division Director', 'مدير قسم دعم',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#1e1e17,#5c5c4f)', 10
  ),
  (
    'sdd', 'PSD Director', 'مدير PSD',
    'Support Division Director', 'مدير قسم دعم',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#107a72,#3fb8ae)', 11
  ),
  (
    'sdd', 'PNSD Director', 'مدير PNSD',
    'Support Division Director', 'مدير قسم دعم',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#9f1547,#d9487d)', 12
  ),
  (
    'sdd', 'FSD Director', 'مدير FSD',
    'Support Division Director', 'مدير قسم دعم',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#8b4514,#c7783f)', 13
  ),
  (
    'sdd', 'RSD Director', 'مدير RSD',
    'Support Division Director', 'مدير قسم دعم',
    'TBD', 'يُعلن لاحقاً',
    'linear-gradient(135deg,#c9920e,#f7b826)', 14
  )
on conflict (tier, position_title_en) do update
set position_title_ar = excluded.position_title_ar,
    role_en           = excluded.role_en,
    role_ar           = excluded.role_ar,
    gradient          = excluded.gradient,
    sort_order        = excluded.sort_order;

commit;
