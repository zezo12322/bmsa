-- Allow activities to belong to support divisions as well as standing committees.
-- Safe to run more than once.
alter table public.bmsa_activities
  drop constraint if exists bmsa_activities_committee_check;

alter table public.bmsa_activities
  add constraint bmsa_activities_committee_check
  check (committee in ('scome', 'scope', 'scoph', 'scora', 'score', 'scorp', 'cbsd', 'psd', 'pnsd', 'fsd', 'rsd'));
