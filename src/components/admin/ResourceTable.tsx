'use client';

import Link from 'next/link';
import type { AdminResource } from '@/lib/admin-resources';
import { deleteResource } from '@/app/admin/actions';

type AdminRow = Record<string, string | number | boolean | string[] | null | undefined> & {
  id: string;
};

export default function ResourceTable({
  resource,
  items,
}: {
  resource: AdminResource;
  items: AdminRow[];
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <h1>{resource.title}</h1>
          <p>{resource.description}</p>
        </div>
        <Link className="admin-button" href={`/admin/${resource.key}/new`}>
          Create
        </Link>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Meta</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{String(item[resource.titleField] || item.key || item.slug || '')}</td>
                  <td>{String(resource.subtitleField ? item[resource.subtitleField] || '' : item.slug || '')}</td>
                  <td>
                    <span className={item.published ? 'status-pill live' : 'status-pill'}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/${resource.key}/${item.id}`}>Edit</Link>
                      <form
                        action={deleteResource.bind(null, resource.key, item.id)}
                        onSubmit={(e) => {
                          if (!confirm(`Delete this ${resource.title.replace(/s$/, '')}? This cannot be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <button type="submit" className="danger">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-cell">
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
