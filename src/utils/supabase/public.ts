import { createClient } from '@supabase/supabase-js';

export function hasSupabasePublicEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_PROJECT') &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('YOUR_PUBLIC')
  );
}

export function createPublicSupabaseClient() {
  if (!hasSupabasePublicEnv()) return null;

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
