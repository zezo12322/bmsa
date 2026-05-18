import { requireAdminPage } from '@/app/admin/auth';

export const revalidate = 0;

export default async function OrdersPage() {
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
  const { data: orders, error } = await supabase
    .from('bmsa_merch_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="admin-card">
        <h1>Merch Orders</h1>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <h1>Merch Orders</h1>
          <p>View-only. All order requests submitted through the public site.</p>
        </div>
        <span className="admin-button secondary" style={{ cursor: 'default' }}>
          {orders?.length ?? 0} total
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Notes</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              orders.map((order: any) => (
                <tr key={order.id}>
                  <td><strong>{order.name}</strong></td>
                  <td>{order.phone}</td>
                  <td>{order.email}</td>
                  <td>
                    <span className="status-pill live">{order.item_slug}</span>
                  </td>
                  <td>{order.size || <span style={{ color: '#aaa' }}>—</span>}</td>
                  <td>{order.quantity}</td>
                  <td style={{ maxWidth: '240px', wordBreak: 'break-word' }}>
                    {order.notes || <span style={{ color: '#aaa' }}>—</span>}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(order.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="empty-cell">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
