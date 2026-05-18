/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { requireAdminPage } from './auth';
import { adminResources } from '@/lib/admin-resources';

export const revalidate = 0;

export default async function AdminDashboard() {
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
        <p>Your user is signed in, but it is not listed in admin_users.</p>
      </section>
    );
  }

  const supabase = context.supabase!;
  async function countRows(table: string) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
    return count || 0;
  }
  const [activityCount, merchCount, boardCount, imageCount] = await Promise.all([
    countRows('bmsa_activities'),
    countRows('bmsa_merch_items'),
    countRows('bmsa_board_members'),
    countRows('bmsa_images'),
  ]);

  const { data: applications } = await supabase
    .from('bmsa_membership_applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  const { data: orders } = await supabase
    .from('bmsa_merch_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="admin-stack">
      <section className="admin-hero-card">
        <div>
          <h1>Dashboard</h1>
          <p>Manage BMSA content, merch, board members, membership applications, and order requests.</p>
        </div>
        <img src="/images/logos/bmsa-logo-v.png" alt="BMSA Benisuef" />
      </section>

      <section className="admin-metrics">
        {[
          ['Activities', activityCount, '/admin/activities'],
          ['Merch', merchCount, '/admin/merch'],
          ['Board', boardCount, '/admin/board'],
          ['Images', imageCount, '/admin/images'],
        ].map(([label, value, url]) => (
          <Link href={String(url)} className="admin-metric" key={String(label)}>
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </section>

      <div className="admin-two-col">
        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Latest Membership Applications</h2>
            <Link className="admin-button secondary" href="/admin/applications">View all</Link>
          </div>
          <div className="admin-mini-list">
            {applications?.length ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              applications.map((item: any) => (
                <article key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.committee_preference?.toUpperCase()} · {item.email}</span>
                  <p>{item.motivation}</p>
                </article>
              ))
            ) : (
              <p>No applications yet.</p>
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card-header">
            <h2>Latest Merch Orders</h2>
            <Link className="admin-button secondary" href="/admin/orders">View all</Link>
          </div>
          <div className="admin-mini-list">
            {orders?.length ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              orders.map((item: any) => (
                <article key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.item_slug} · Qty {item.quantity} · {item.phone}</span>
                  <p>{item.notes}</p>
                </article>
              ))
            ) : (
              <p>No orders yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="admin-card">
        <h2>Content Areas</h2>
        <div className="admin-resource-links">
          {Object.values(adminResources).map((resource) => (
            <Link href={`/admin/${resource.key}`} key={resource.key}>
              <strong>{resource.title}</strong>
              <span>{resource.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
