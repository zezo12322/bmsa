import Link from 'next/link';
import type { AdminField, AdminResource } from '@/lib/admin-resources';
import { saveResource } from '@/app/admin/actions';

type AdminRow = Record<string, string | number | boolean | string[] | null | undefined> & {
  id?: string;
};

function fieldValue(item: AdminRow | undefined, field: AdminField) {
  if (!item) return '';
  const value = item[field.name];
  if (Array.isArray(value)) return value.join('\n');
  if (field.type === 'checkbox') return Boolean(value);
  return value ?? '';
}

export default function ResourceForm({
  resource,
  item,
}: {
  resource: AdminResource;
  item?: AdminRow;
}) {
  return (
    <section className="admin-card">
      <div className="admin-card-header">
        <div>
          <h1>{item ? `Edit ${resource.title}` : `Create ${resource.title}`}</h1>
          <p>{resource.description}</p>
        </div>
        <Link className="admin-button secondary" href={`/admin/${resource.key}`}>
          Back
        </Link>
      </div>

      <form className="admin-form" action={saveResource.bind(null, resource.key)}>
        {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
        <div className="admin-fields">
          {resource.fields.map((field) => {
            const value = fieldValue(item, field);
            return (
              <label key={field.name} className={field.type === 'textarea' ? 'wide' : undefined}>
                <span>
                  {field.label} {field.required ? <strong>*</strong> : null}
                </span>
                {field.type === 'textarea' ? (
                  <textarea name={field.name} defaultValue={String(value)} rows={5} required={field.required} />
                ) : field.type === 'select' ? (
                  <select name={field.name} defaultValue={String(value)} required={field.required}>
                    <option value="">Select...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <span className="admin-checkbox">
                    <input name={field.name} type="checkbox" value="true" defaultChecked={item ? Boolean(value) : true} />
                    Enabled
                  </span>
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    defaultValue={String(value)}
                    required={field.required}
                  />
                )}
                {field.helper ? <small>{field.helper}</small> : null}
              </label>
            );
          })}
        </div>

        <div className="admin-form-actions">
          <Link className="admin-button secondary" href={`/admin/${resource.key}`}>
            Cancel
          </Link>
          <button className="admin-button" type="submit">
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
