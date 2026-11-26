'use server';

import { redirect } from 'next/navigation';
import { createPublicSupabaseClient } from '@/utils/supabase/public';

function clean(value: FormDataEntryValue | null) {
  return String(value || '').trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitMembershipApplication(formData: FormData) {
  const supabase = createPublicSupabaseClient();
  const locale = clean(formData.get('locale')) || 'en';
  const base = locale === 'ar' ? '/ar/join' : '/join';

  if (!supabase) redirect(`${base}?error=cms`);

  const payload = {
    name: clean(formData.get('name')),
    email: clean(formData.get('email')),
    phone: clean(formData.get('phone')),
    faculty_year: clean(formData.get('faculty_year')),
    committee_preference: clean(formData.get('committee_preference')),
    motivation: clean(formData.get('motivation')),
    locale,
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.faculty_year || !payload.committee_preference || !payload.motivation) {
    redirect(`${base}?error=submit`);
  }
  if (!isValidEmail(payload.email)) {
    redirect(`${base}?error=submit`);
  }

  const { error } = await supabase.from('bmsa_membership_applications').insert(payload);
  if (error) {
    console.warn('Membership application failed:', error.message);
    redirect(`${base}?error=submit`);
  }

  redirect(`${base}?submitted=1`);
}

export async function submitMerchOrder(formData: FormData) {
  const supabase = createPublicSupabaseClient();
  const locale = clean(formData.get('locale')) || 'en';
  const base = locale === 'ar' ? '/ar/merch' : '/merch';

  if (!supabase) redirect(`${base}?error=cms`);

  const payload = {
    name: clean(formData.get('name')),
    email: clean(formData.get('email')),
    phone: clean(formData.get('phone')),
    item_slug: clean(formData.get('item_slug')),
    size: clean(formData.get('size')) || null,
    quantity: Number(clean(formData.get('quantity')) || '1'),
    notes: clean(formData.get('notes')),
    locale,
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.item_slug) {
    redirect(`${base}?error=submit`);
  }
  if (!isValidEmail(payload.email)) {
    redirect(`${base}?error=submit`);
  }
  if (payload.quantity < 1 || payload.quantity > 100) {
    redirect(`${base}?error=submit`);
  }

  const { error } = await supabase.from('bmsa_merch_orders').insert(payload);
  if (error) {
    console.warn('Merch order failed:', error.message);
    redirect(`${base}?error=submit`);
  }

  redirect(`${base}?ordered=1`);
}

export type ExchangeApplicationState = {
  status: 'idle' | 'success' | 'error';
  /** `cms` = submissions unavailable, `invalid` = missing/invalid fields, `submit` = database error. */
  error?: 'cms' | 'invalid' | 'submit';
  /** Set on success when the application was linked to an open call. */
  callTitle?: { en: string; ar: string };
};

const EXCHANGE_PROGRAMS = ['scope', 'score', 'either'];
const MEMBERSHIP_STATUSES = ['active', 'new', 'not-yet'];

function limit(value: string, max: number) {
  return value.length > max ? value.slice(0, max) : value;
}

export async function submitExchangeApplication(
  _prev: ExchangeApplicationState,
  formData: FormData,
): Promise<ExchangeApplicationState> {
  // Honeypot: real visitors never see or fill this field.
  if (clean(formData.get('website'))) return { status: 'success' };

  const supabase = createPublicSupabaseClient();
  if (!supabase) return { status: 'error', error: 'cms' };

  const destinations = formData
    .getAll('preferred_destinations')
    .map((value) => limit(String(value).trim(), 80))
    .filter(Boolean)
    .slice(0, 3);

  const payload = {
    name: limit(clean(formData.get('name')), 120),
    email: limit(clean(formData.get('email')), 160),
    phone: limit(clean(formData.get('phone')), 40),
    faculty_year: limit(clean(formData.get('faculty_year')), 40),
    membership_status: clean(formData.get('membership_status')),
    program: clean(formData.get('program')),
    preferred_destinations: destinations,
    preferred_period: limit(clean(formData.get('preferred_period')), 120),
    languages: limit(clean(formData.get('languages')), 200),
    motivation: limit(clean(formData.get('motivation')), 3000),
    locale: clean(formData.get('locale')) === 'ar' ? 'ar' : 'en',
  };

  if (
    !payload.name ||
    !payload.phone ||
    !payload.faculty_year ||
    !payload.motivation ||
    !isValidEmail(payload.email) ||
    !EXCHANGE_PROGRAMS.includes(payload.program) ||
    !MEMBERSHIP_STATUSES.includes(payload.membership_status) ||
    formData.get('consent') !== 'yes'
  ) {
    return { status: 'error', error: 'invalid' };
  }

  // Link the application to the call that is open right now (decided on the server, not the browser).
  const now = new Date().toISOString();
  const { data: openCalls } = await supabase
    .from('bmsa_exchange_calls')
    .select('id, title_en, title_ar')
    .eq('published', true)
    .lte('opens_at', now)
    .gt('closes_at', now)
    .order('closes_at', { ascending: true })
    .limit(1);
  const call = (openCalls as { id: string; title_en: string; title_ar: string | null }[] | null)?.[0];

  const { error } = await supabase.from('bmsa_exchange_applications').insert({ ...payload, call_id: call?.id ?? null });
  if (error) {
    console.warn('Exchange application failed:', error.message);
    return { status: 'error', error: 'submit' };
  }

  return {
    status: 'success',
    callTitle: call ? { en: call.title_en, ar: call.title_ar || call.title_en } : undefined,
  };
}
