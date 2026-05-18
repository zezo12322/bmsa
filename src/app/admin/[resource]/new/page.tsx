import { notFound } from 'next/navigation';
import ResourceForm from '@/components/admin/ResourceForm';
import { requireAdminPage } from '../../auth';
import { getAdminResource } from '@/lib/admin-resources';

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource: resourceKey } = await params;
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

  return <ResourceForm resource={resource} />;
}
