import { requireAdminPage } from '@/app/admin/auth';

export const revalidate = 0;

type ExchangeApplicationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  faculty_year: string | null;
  membership_status: string | null;
  program: string | null;
  preferred_destinations: string[] | null;
  preferred_period: string | null;
  languages: string | null;
  motivation: string | null;
  locale: string | null;
  created_at: string;
  call: { title_en: string } | null;
};

const membershipLabels: Record<string, string> = {
  active: 'Active member',
  new: 'New member',
  'not-yet': 'Not a member yet',
};

export default async function ExchangeApplicationsPage() {
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
    .from('bmsa_exchange_applications')
    .select('*, call:bmsa_exchange_calls(title_en)')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <section className="admin-card">
        <h1>Exchange Pre-applications</h1>
        <p className="admin-error">
          {error.message} — if the table is missing, run <code>supabase/migrations/20261128_exchange_applications.sql</code>.
        </p>
      </section>
    );
  }

  const rows = (data || []) as ExchangeApplicationRow[];
  const counts = {
    scope: rows.filter((row) => row.program === 'scope').length,
    score: rows.filter((row) => row.program === 'score').length,
    either: rows.filter((row) => row.program === 'either').length,
  };

  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <h1>Exchange Pre-applications</h1>
          <p>
            View-only. Sent from the Exchange page. SCOPE {counts.scope} · SCORE {counts.score} · Either {counts.either}
          </p>
        </div>
        <span className="admin-button secondary" style={{ cursor: 'default' }}>
          {rows.length} total
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Year / membership</th>
              <th>Program</th>
              <th>Destinations / period</th>
              <th>Languages</th>
              <th>Motivation</th>
              <th>Call</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td>
                    {row.email}
                    <br />
                    {row.phone}
                  </td>
                  <td>
                    {row.faculty_year}
                    <br />
                    <small>{membershipLabels[row.membership_status || ''] || row.membership_status}</small>
                  </td>
                  <td>
                    <span className="status-pill live">{row.program?.toUpperCase()}</span>
                  </td>
                  <td style={{ maxWidth: '220px' }}>
                    {row.preferred_destinations?.length ? row.preferred_destinations.join(', ') : '—'}
                    {row.preferred_period ? (
                      <>
                        <br />
                        <small>{row.preferred_period}</small>
                      </>
                    ) : null}
                  </td>
                  <td style={{ maxWidth: '180px', wordBreak: 'break-word' }}>{row.languages || '—'}</td>
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{row.motivation}</td>
                  <td>{row.call?.title_en || <small>Interest (no open call)</small>}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(row.created_at).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      timeZone: 'Africa/Cairo',
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="empty-cell">
                  No pre-applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
