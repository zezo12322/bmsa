import { requireAdminPage } from '@/app/admin/auth';

export const revalidate = 0;

export default async function ApplicationsPage() {
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
  const { data: applications, error } = await supabase
    .from('bmsa_membership_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="admin-card">
        <h1>Membership Applications</h1>
        <p className="admin-error">{error.message}</p>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <h1>Membership Applications</h1>
          <p>View-only. All applications submitted through the public site.</p>
        </div>
        <span className="admin-button secondary" style={{ cursor: 'default' }}>
          {applications?.length ?? 0} total
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Year</th>
              <th>Committee</th>
              <th>Motivation</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {applications?.length ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              applications.map((app: any) => (
                <tr key={app.id}>
                  <td><strong>{app.name}</strong></td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.faculty_year}</td>
                  <td>
                    <span className="status-pill live">
                      {app.committee_preference?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                    {app.motivation}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(app.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="empty-cell">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
