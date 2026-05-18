import Link from 'next/link';
import { logout } from '@/app/api/auth/actions';
import { requireAdminPage } from '@/app/admin/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          BMSA Admin
        </Link>
        <AdminNav />
        <form action={logout}>
          <button type="submit">Log out</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
