'use client';

import { useEffect, useState } from 'react';
import ActivityGrid from '@/components/site/ActivityGrid';
import type { Activity, Committee, Locale } from '@/lib/types';

/** Activities list with committee filter chips. The filter is mirrored in `?committee=` so it can be linked. */
export default function ActivityBrowser({
  locale,
  activities,
  committees,
}: {
  locale: Locale;
  activities: Activity[];
  committees: Committee[];
}) {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('committee');
    if (fromUrl && committees.some((committee) => committee.slug === fromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
      setFilter(fromUrl);
    }
  }, [committees]);

  function choose(slug: string) {
    setFilter(slug);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('committee');
    else url.searchParams.set('committee', slug);
    window.history.replaceState(null, '', url);
  }

  const usedCommittees = committees.filter((committee) => activities.some((activity) => activity.committee === committee.slug));
  const visible = filter === 'all' ? activities : activities.filter((activity) => activity.committee === filter);

  return (
    <>
      {usedCommittees.length > 1 ? (
        <div className="filter-chips" role="group" aria-label={locale === 'ar' ? 'تصفية حسب اللجنة' : 'Filter by committee'}>
          <button type="button" aria-pressed={filter === 'all'} onClick={() => choose('all')}>
            {locale === 'ar' ? 'الكل' : 'All'}
            <span>{activities.length}</span>
          </button>
          {usedCommittees.map((committee) => (
            <button
              type="button"
              key={committee.slug}
              aria-pressed={filter === committee.slug}
              onClick={() => choose(committee.slug)}
              style={{ '--accent': committee.color } as React.CSSProperties}
            >
              {committee.name}
              <span>{activities.filter((activity) => activity.committee === committee.slug).length}</span>
            </button>
          ))}
        </div>
      ) : null}

      {visible.length ? (
        <ActivityGrid locale={locale} activities={visible} committees={committees} />
      ) : (
        <p className="empty-state">{locale === 'ar' ? 'لا توجد أنشطة لهذه اللجنة حالياً.' : 'No activities for this committee yet.'}</p>
      )}
    </>
  );
}
