'use client';

import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { BMSA_TIME_ZONE } from '@/lib/cairo-time';
import { currentCallState } from '@/lib/exchange-calls';
import type { ExchangeCall, Locale } from '@/lib/types';
import { text } from '@/lib/types';

const programLabel = {
  scope: { en: 'SCOPE · Clinical', ar: 'SCOPE · إكلينيكي' },
  score: { en: 'SCORE · Research', ar: 'SCORE · بحثي' },
  both: { en: 'SCOPE & SCORE', ar: 'SCOPE و SCORE' },
};

function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/**
 * Counts down to the next exchange call opening, or to the open call closing.
 * Time is read in the browser so the static page never shows a stale state.
 * Renders nothing when there is no current or upcoming call.
 */
export default function ExchangeCountdown({
  locale,
  calls,
  variant = 'full',
  ctaHref,
}: {
  locale: Locale;
  calls: ExchangeCall[];
  variant?: 'full' | 'compact';
  ctaHref?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null || !calls.length) return null;
  const state = currentCallState(calls, now);
  if (state.status === 'none') return null;

  const isOpen = state.status === 'open';
  const parts = splitDuration(state.target - now);
  const dateLabel = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    timeZone: BMSA_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(state.target));

  const units: [number, string, string][] = [
    [parts.days, 'Days', 'يوم'],
    [parts.hours, 'Hours', 'ساعة'],
    [parts.minutes, 'Minutes', 'دقيقة'],
    [parts.seconds, 'Seconds', 'ثانية'],
  ];

  const heading = isOpen
    ? locale === 'ar'
      ? 'التقديم مفتوح — باقي على القفل'
      : 'Applications are open — closing in'
    : locale === 'ar'
      ? 'التقديم يفتح بعد'
      : 'Applications open in';

  const details = text(state.call.details, locale);

  return (
    <div className={`countdown ${variant} ${isOpen ? 'is-open' : 'is-upcoming'}`} role="timer" aria-live="off">
      <div className="countdown-info">
        <span className="countdown-status">
          <span className="countdown-dot" aria-hidden="true" />
          {isOpen ? (locale === 'ar' ? 'مفتوح الآن' : 'Open now') : locale === 'ar' ? 'قريباً' : 'Coming soon'}
          <span className="countdown-program">{programLabel[state.call.program][locale]}</span>
        </span>
        <strong className="countdown-title">{text(state.call.title, locale)}</strong>
        <span className="countdown-heading">{heading}</span>
      </div>

      <div className="countdown-units">
        {units.map(([value, en, ar]) => (
          <span key={en}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <small>{locale === 'ar' ? ar : en}</small>
          </span>
        ))}
      </div>

      <div className="countdown-meta">
        <span>
          <CalendarClock size={16} aria-hidden="true" />
          {isOpen ? (locale === 'ar' ? 'آخر موعد: ' : 'Deadline: ') : locale === 'ar' ? 'يفتح: ' : 'Opens: '}
          {dateLabel} {locale === 'ar' ? '(بتوقيت مصر)' : '(Egypt time)'}
        </span>
        {variant === 'full' && details ? <p>{details}</p> : null}
        {ctaHref ? (
          <a className="button primary" href={ctaHref}>
            {isOpen
              ? locale === 'ar'
                ? 'قدّم مبدئياً الآن'
                : 'Pre-apply now'
              : locale === 'ar'
                ? 'سجّل اهتمامك'
                : 'Register your interest'}
          </a>
        ) : null}
      </div>
    </div>
  );
}
