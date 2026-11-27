'use client';

import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { BMSA_TIME_ZONE } from '@/lib/cairo-time';
import type { Locale, Opportunity } from '@/lib/types';
import { text } from '@/lib/types';

type Status = 'open' | 'upcoming' | 'closed';

function statusAt(item: Opportunity, now: number): Status {
  if (Date.parse(item.closesAt) <= now) return 'closed';
  if (item.opensAt && Date.parse(item.opensAt) > now) return 'upcoming';
  return 'open';
}

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    timeZone: BMSA_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function timeLeft(ms: number, locale: Locale) {
  const days = Math.floor(ms / 86_400_000);
  if (days >= 1) return locale === 'ar' ? `باقي ${days} يوم` : `${days} day${days === 1 ? '' : 's'} left`;
  const hours = Math.max(1, Math.floor(ms / 3_600_000));
  return locale === 'ar' ? `باقي ${hours} ساعة` : `${hours} hour${hours === 1 ? '' : 's'} left`;
}

const say = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en);

function Card({ item, status, locale, now }: { item: Opportunity; status?: Status; locale: Locale; now: number | null }) {
  const tag = text(item.tag, locale);
  const body = text(item.body, locale);
  return (
    <article className={`opportunity-card${status ? ` is-${status}` : ''}`}>
      <header>
        {tag ? <span className="opportunity-tag">{tag}</span> : null}
        {status === 'open' && now !== null ? (
          <span className="opportunity-status">{timeLeft(Date.parse(item.closesAt) - now, locale)}</span>
        ) : status === 'closed' ? (
          <span className="opportunity-status">{say(locale, 'Closed', 'اتقفلت')}</span>
        ) : null}
      </header>
      <h3>{text(item.title, locale)}</h3>
      {body ? body.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : null}
      <p className="opportunity-date">
        <CalendarClock size={16} aria-hidden="true" />
        {status === 'upcoming' && item.opensAt
          ? `${say(locale, 'Opens', 'يفتح')}: ${formatDate(item.opensAt, locale)}`
          : `${say(locale, 'Deadline', 'آخر موعد')}: ${formatDate(item.closesAt, locale)}`}{' '}
        {say(locale, '(Egypt time)', '(بتوقيت مصر)')}
      </p>
      {status === 'open' && item.applyUrl ? (
        <a className="button primary" href={item.applyUrl} target="_blank" rel="noreferrer">
          {say(locale, 'Apply', 'قدّم')}
        </a>
      ) : null}
    </article>
  );
}

/**
 * Open / upcoming / closed is worked out in the browser, so a call closes on time
 * even though the page itself is static.
 */
export default function OpportunityList({ locale, items }: { locale: Locale; items: Opportunity[] }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const byDeadline = [...items].sort((a, b) => Date.parse(a.closesAt) - Date.parse(b.closesAt));

  if (now === null) {
    return (
      <div className="opportunity-list">
        {byDeadline.map((item) => (
          <Card key={item.id} item={item} locale={locale} now={null} />
        ))}
      </div>
    );
  }

  const open = byDeadline.filter((item) => statusAt(item, now) === 'open');
  const upcoming = byDeadline.filter((item) => statusAt(item, now) === 'upcoming');
  const closed = byDeadline.filter((item) => statusAt(item, now) === 'closed').reverse().slice(0, 6);

  const list = (group: Opportunity[], status: Status) => (
    <div className="opportunity-list">
      {group.map((item) => (
        <Card key={item.id} item={item} status={status} locale={locale} now={now} />
      ))}
    </div>
  );

  return (
    <div className="opportunity-sections">
      <section>
        <h2>{say(locale, 'Open now', 'مفتوح دلوقتي')}</h2>
        {open.length ? (
          list(open, 'open')
        ) : (
          <p className="empty-state">
            {say(
              locale,
              'No calls are open right now. Check back soon or follow our Facebook page.',
              'مفيش فرص مفتوحة دلوقتي. ارجع تاني قريب أو تابع صفحتنا على فيسبوك.',
            )}
          </p>
        )}
      </section>
      {upcoming.length ? (
        <section>
          <h2>{say(locale, 'Coming soon', 'قريباً')}</h2>
          {list(upcoming, 'upcoming')}
        </section>
      ) : null}
      {closed.length ? (
        <section>
          <h2>{say(locale, 'Closed', 'اتقفلت')}</h2>
          {list(closed, 'closed')}
        </section>
      ) : null}
    </div>
  );
}
