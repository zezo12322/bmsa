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
