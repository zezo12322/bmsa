'use client';

import { useEffect, useState } from 'react';
import ActivityGrid from '@/components/site/ActivityGrid';
import type { Activity, Locale, OrgUnit } from '@/lib/types';
import { uniqueActivities } from '@/lib/activity-groups';

/** Activities list with committee/division filter chips. The filter is mirrored in `?committee=` so it can be linked. */
export default function ActivityBrowser({
  locale,
  activities,
  units,
}: {
  locale: Locale;
  activities: Activity[];
  units: OrgUnit[];
}) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('committee');
    if (fromUrl && units.some((unit) => unit.slug === fromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
      setFilter(fromUrl);
    }
  }, [units]);

  function choose(slug: string) {
    setFilter(slug);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('committee');
    else url.searchParams.set('committee', slug);
    window.history.replaceState(null, '', url);
  }

  // "All" shows each shared activity once; a committee filter shows that committee's own row.
  const all = uniqueActivities(activities);
  const usedUnits = units.filter((unit) => activities.some((activity) => activity.committee === unit.slug));
  const visible = filter === 'all' ? all : activities.filter((activity) => activity.committee === filter);

  return (
    <>
      {usedUnits.length > 1 ? (
        <div className="filter-chips" role="group" aria-label={locale === 'ar' ? 'تصفية حسب اللجنة أو القسم' : 'Filter by committee or division'}>
          <button type="button" aria-pressed={filter === 'all'} onClick={() => choose('all')}>
            {locale === 'ar' ? 'الكل' : 'All'}
            <span>{all.length}</span>
          </button>
          {usedUnits.map((unit) => (
            <button
              type="button"
              key={unit.slug}
              aria-pressed={filter === unit.slug}
              onClick={() => choose(unit.slug)}
              style={{ '--accent': unit.color } as React.CSSProperties}
            >
              {unit.name}
              <span>{activities.filter((activity) => activity.committee === unit.slug).length}</span>
            </button>
          ))}
        </div>
      ) : null}

      {visible.length ? (
        <ActivityGrid locale={locale} activities={visible} units={units} />
      ) : (
        <p className="empty-state">{locale === 'ar' ? 'لا توجد أنشطة هنا حالياً.' : 'No activities here yet.'}</p>
      )}
    </>
  );
}
