'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminResources } from '@/lib/admin-resources';

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <nav>
      <Link href="/admin" className={isActive('/admin') ? 'active' : ''}>
        Dashboard
      </Link>
      {Object.values(adminResources).map((resource) => (
        <Link
          key={resource.key}
          href={`/admin/${resource.key}`}
          className={isActive(`/admin/${resource.key}`) ? 'active' : ''}
        >
          {resource.title}
        </Link>
      ))}
      <Link href="/admin/applications" className={isActive('/admin/applications') ? 'active' : ''}>
        Applications
      </Link>
      <Link href="/admin/orders" className={isActive('/admin/orders') ? 'active' : ''}>
        Orders
      </Link>
      <Link href="/" className="">
        View Site
      </Link>
    </nav>
  );
}
