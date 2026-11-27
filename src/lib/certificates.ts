import type { CertificateResult } from '@/components/site/ResourcePages';
import { createPublicSupabaseClient } from '@/utils/supabase/public';

/** Looks up one exact certificate code via the verify_certificate function (the table itself is not public). */
export async function lookupCertificate(code: string): Promise<{ result: CertificateResult | null; unavailable: boolean }> {
  if (!code) return { result: null, unavailable: false };
  const supabase = createPublicSupabaseClient();
  if (!supabase) return { result: null, unavailable: true };
  const { data, error } = await supabase.rpc('verify_certificate', { p_code: code });
  if (error) {
    console.warn('Certificate lookup failed:', error.message);
    return { result: null, unavailable: true };
  }
  return { result: (data as CertificateResult[] | null)?.[0] ?? null, unavailable: false };
}
