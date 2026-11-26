/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { IconFor } from '@/components/site/icons';
import { localizePath } from '@/lib/routes';
import type { Activity, Committee, Locale } from '@/lib/types';
import { text } from '@/lib/types';

export function activityHref(locale: Locale, slug: string) {
  return localizePath(locale, `/activities/${slug}`);
}

export default function ActivityGrid({
  locale,
  activities,
  committees,
}: {
  locale: Locale;
  activities: Activity[];
  committees: Committee[];
}) {
  const colorFor = (slug: string) => committees.find((committee) => committee.slug === slug)?.color;
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="activity-grid">
      {activities.map((activity, i) => (
        <article
          className="activity-card"
          key={activity.slug}
          style={{ '--accent': colorFor(activity.committee), animationDelay: `${i * 90}ms` } as CSSProperties}
        >
          <Link className="activity-thumb" href={activityHref(locale, activity.slug)} tabIndex={-1} aria-hidden="true">
            {activity.imageUrl ? <img src={activity.imageUrl} alt="" loading="lazy" /> : <IconFor name={activity.icon} size={42} />}
          </Link>
          <div className="activity-body">
            <span className="activity-tag">{text(activity.tag, locale)}</span>
            <h3>
              <Link href={activityHref(locale, activity.slug)}>{text(activity.title, locale)}</Link>
            </h3>
            <p>{text(activity.excerpt, locale)}</p>
            <Link className="card-cta" href={activityHref(locale, activity.slug)}>
              {locale === 'ar' ? 'اقرأ المزيد' : 'Read more'}
              <Arrow size={17} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
