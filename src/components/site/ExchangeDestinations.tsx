'use client';

import { useState } from 'react';
import { Building2, Languages, MapPin, Stethoscope } from 'lucide-react';
import type { ExchangeDestination, ExchangeProgram, ExchangeRegion, Locale } from '@/lib/types';
import { text } from '@/lib/types';
import Flag from '@/components/site/Flag';

const programInfo: Record<ExchangeProgram, { label: string; color: string; en: string; ar: string }> = {
  scope: { label: 'SCOPE', color: '#0a84c6', en: 'Clinical', ar: 'إكلينيكي' },
  score: { label: 'SCORE', color: '#2a4a9c', en: 'Research', ar: 'بحثي' },
};

const regionLabels: Record<ExchangeRegion, { en: string; ar: string }> = {
  europe: { en: 'Europe', ar: 'أوروبا' },
  americas: { en: 'Americas', ar: 'الأمريكتين' },
  asia: { en: 'Asia', ar: 'آسيا' },
  africa: { en: 'Africa', ar: 'أفريقيا' },
  'middle-east': { en: 'Middle East', ar: 'الشرق الأوسط' },
  oceania: { en: 'Oceania', ar: 'أوقيانوسيا' },
};

export function ProgramBadge({ program, locale }: { program: ExchangeProgram; locale: Locale }) {
  const info = programInfo[program];
  return (
    <span className="program-badge" style={{ '--accent': info.color } as React.CSSProperties}>
      {info.label} · {info[locale]}
    </span>
  );
}

export default function ExchangeDestinations({
  locale,
  destinations,
}: {
  locale: Locale;
  destinations: ExchangeDestination[];
}) {
  const [program, setProgram] = useState<'all' | ExchangeProgram>('all');
  const [region, setRegion] = useState<'all' | ExchangeRegion>('all');

  const regions = (Object.keys(regionLabels) as ExchangeRegion[]).filter((key) =>
    destinations.some((destination) => destination.region === key),
  );
  const visible = destinations.filter(
    (destination) =>
      (program === 'all' || destination.programs.includes(program)) &&
      (region === 'all' || destination.region === region),
  );

  const t = (en: string, ar: string) => (locale === 'ar' ? ar : en);

  return (
    <div className="destinations">
      <div className="destination-filters">
        <div className="filter-chips" role="group" aria-label={t('Exchange type', 'نوع التبادل')}>
          <button type="button" aria-pressed={program === 'all'} onClick={() => setProgram('all')}>
            {t('All types', 'كل الأنواع')}
          </button>
          {(Object.keys(programInfo) as ExchangeProgram[]).map((key) => (
            <button
              type="button"
              key={key}
              aria-pressed={program === key}
              onClick={() => setProgram(key)}
              style={{ '--accent': programInfo[key].color } as React.CSSProperties}
            >
              {programInfo[key].label} · {programInfo[key][locale]}
            </button>
          ))}
        </div>
        {regions.length > 1 ? (
          <div className="filter-chips" role="group" aria-label={t('Region', 'المنطقة')}>
            <button type="button" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>
              {t('All regions', 'كل المناطق')}
            </button>
            {regions.map((key) => (
              <button type="button" key={key} aria-pressed={region === key} onClick={() => setRegion(key)}>
                {regionLabels[key][locale]}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {destinations.length && destinations.every((destination) => destination.soldOut) ? (
        <p className="sold-out-notice" role="status">
          {t(
            'All seats in the current contracts are taken. New contracts come with the next season.',
            'كل أماكن العقود الحالية اتحجزت. العقود الجديدة هتنزل السيزون الجاي.',
          )}
        </p>
      ) : null}

      <p className="destination-count" aria-live="polite">
        {locale === 'ar' ? `${visible.length} وجهة` : `${visible.length} destination${visible.length === 1 ? '' : 's'}`}
      </p>

      {visible.length ? (
        <div className="destination-grid">
          {visible.map((destination) => (
            <article className={destination.soldOut ? 'destination-card sold-out' : 'destination-card'} key={destination.slug}>
              <header>
                <span className="destination-flag" aria-hidden="true">
                  <Flag emoji={destination.flag} />
                </span>
                <div>
                  <h3>{text(destination.country, locale)}</h3>
                  <span className="destination-region">{regionLabels[destination.region][locale]}</span>
                </div>
                {destination.soldOut ? (
                  <span className="sold-out-badge">{t('Sold out until next season', 'كامل العدد لحد السيزون الجاي')}</span>
                ) : null}
              </header>
              <div className="destination-badges">
                {destination.programs.map((key) => (
                  <ProgramBadge key={key} program={key} locale={locale} />
                ))}
              </div>
              <ul className="destination-facts">
                {text(destination.cities, locale) ? (
                  <li>
                    <MapPin size={16} aria-hidden="true" />
                    <span>{text(destination.cities, locale)}</span>
                  </li>
                ) : null}
                {text(destination.fields, locale) ? (
                  <li>
                    {destination.programs.includes('scope') ? <Stethoscope size={16} aria-hidden="true" /> : <Building2 size={16} aria-hidden="true" />}
                    <span>{text(destination.fields, locale)}</span>
                  </li>
                ) : null}
                {text(destination.language, locale) ? (
                  <li>
                    <Languages size={16} aria-hidden="true" />
                    <span>{text(destination.language, locale)}</span>
                  </li>
                ) : null}
              </ul>
              {text(destination.notes, locale) ? <p className="destination-notes">{text(destination.notes, locale)}</p> : null}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">{t('No destinations match these filters.', 'لا توجد وجهات تطابق هذا الاختيار.')}</p>
      )}
    </div>
  );
}
