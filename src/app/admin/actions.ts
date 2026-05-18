'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getAdminResource } from '@/lib/admin-resources';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: isAdmin, error } = await supabase.rpc('is_admin', {
    check_user_id: user.id,
  });

  if (error) throw new Error(`Admin check failed: ${error.message}`);
  if (!isAdmin) redirect('/login');

  return supabase;
}

function parseArray(value: FormDataEntryValue | null) {
  return String(value || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanString(value: FormDataEntryValue | null) {
  const cleaned = String(value || '').trim();
  return cleaned || null;
}

export async function saveResource(resourceKey: string, formData: FormData) {
  const resource = getAdminResource(resourceKey);
  if (!resource) throw new Error('Unknown resource.');

  const supabase = await requireAdmin();
  const id = String(formData.get('id') || '');

  const payload: Record<string, unknown> = {};
  for (const field of resource.fields) {
    if (field.type === 'checkbox') {
      payload[field.name] = formData.get(field.name) === 'true';
    } else if (field.type === 'number') {
      payload[field.name] = Number(formData.get(field.name) || 0);
    } else if (field.parseAs === 'array') {
      payload[field.name] = parseArray(formData.get(field.name));
    } else {
      payload[field.name] = cleanString(formData.get(field.name));
    }
  }

  const { error } = id
    ? await supabase.from(resource.table).update(payload).eq('id', id)
    : await supabase.from(resource.table).insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteResource(resourceKey: string, id: string) {
  const resource = getAdminResource(resourceKey);
  if (!resource) throw new Error('Unknown resource.');

  const supabase = await requireAdmin();
  const { error } = await supabase.from(resource.table).delete().eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}
