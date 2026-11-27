-- Scope every "Admins ..." RLS policy to signed-in users and stop anonymous
-- visitors from calling is_admin(). Run once in Supabase SQL Editor, AFTER
-- the other migrations. Safe to re-run.
--
-- Why: Postgres evaluates every permissive policy on a table, so an anonymous
-- read also evaluated the admin policy's is_admin() call. Anonymous visitors
-- therefore needed EXECUTE on a SECURITY DEFINER function (flagged by the
-- Supabase security advisor). With the admin policies limited to
-- `authenticated`, anonymous reads only evaluate the public policies.

do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'admin_users', 'bmsa_images', 'bmsa_activities', 'bmsa_merch_items', 'bmsa_board_members',
        'bmsa_membership_applications', 'bmsa_merch_orders', 'bmsa_exchange_destinations',
        'bmsa_exchange_stories', 'bmsa_exchange_calls', 'bmsa_exchange_applications'
      )
      and policyname like 'Admins %'
  loop
    execute format('alter policy %I on %I.%I to authenticated', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

revoke execute on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated;

alter function public.set_updated_at() set search_path = public;
