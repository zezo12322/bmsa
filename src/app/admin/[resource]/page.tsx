import { notFound } from 'next/navigation';
import ResourceTable from '@/components/admin/ResourceTable';
import { requireAdminPage } from '../auth';
import { getAdminResource } from '@/lib/admin-resources';
export const revalidate = 0;

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: resourceKey } = await params;
  const resource = getAdminResource(resourceKey);
  if (!resource) notFound();

  const context = await requireAdminPage();
  if (context.configError) {
    return (
      <section className="admin-card">
        <h1>Supabase setup required</h1>
        <p>{context.configError}</p>
      </section>
    );
  }

  if (!context.isAdmin) {
    return (
      <section className="admin-card">
        <h1>Admin access required</h1>
        <p>Your account is not listed in admin_users.</p>
      </section>
    );
  }

  const supabase = context.supabase!;
  const { data, error } = await supabase
    .from(resource.table)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="admin-card">
        <h1>{resource.title}</h1>
        <p>{error.message}</p>
      </section>
    );
  }

  return <ResourceTable resource={resource} items={data || []} />;
}
