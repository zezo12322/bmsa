import { notFound } from 'next/navigation';
import ResourceForm from '@/components/admin/ResourceForm';
import { requireAdminPage } from '../../auth';
import { getAdminResource } from '@/lib/admin-resources';
export const revalidate = 0;

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: resourceKey, id } = await params;
  const resource = getAdminResource(resourceKey);
  if (!resource) notFound();

  const context = await requireAdminPage();
  if (context.configError || !context.isAdmin) {
    return (
      <section className="admin-card">
        <h1>Admin access required</h1>
        <p>{context.configError || 'Your account is not listed in admin_users.'}</p>
      </section>
    );
  }

  const supabase = context.supabase!;
  const { data } = await supabase.from(resource.table).select('*').eq('id', id).single();

  if (!data) notFound();

  return <ResourceForm resource={resource} item={data} />;
}
