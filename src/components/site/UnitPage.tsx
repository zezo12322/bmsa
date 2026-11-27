/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Plane, Sparkles, UserRound, UsersRound } from 'lucide-react';
import ActivityGrid from '@/components/site/ActivityGrid';
import { CtaBand, DirectionIcon, SectionHeader } from '@/components/site/Pages';
import { localizePath, unitHref, type UnitKind } from '@/lib/routes';
import type { BmsaContent, Locale, OrgUnit } from '@/lib/types';
import { text } from '@/lib/types';
import { unitContent } from '@/lib/unit-content';

const TBD_NAMES = new Set(['tbd', 'يُعلن لاحقاً', 'يعلن لاحقا', '']);

export default function UnitPage({
  locale,
  content,
  kind,
  unit,
}: {
  locale: Locale;
  content: BmsaContent;
  kind: UnitKind;
  unit: OrgUnit;
}) {
  const ar = locale === 'ar';
  const isCommittee = kind === 'committees';
  const siblings = (isCommittee ? content.committees : content.divisions).filter((item) => item.slug !== unit.slug);
  const activities = content.activities.filter((activity) => activity.committee === unit.slug);
  const extra = unitContent[unit.slug];
  // The board table has no unit column: officers are matched by tier + position title ("SCOME Officer", "CBSD Director").
  const lead = content.boardMembers.find(
    (member) => member.tier === (isCommittee ? 'to' : 'sdd') && member.positionTitle.en.toUpperCase().startsWith(`${unit.name} `),
  );
  const leadName = lead ? text(lead.memberName, locale) : '';
  const leadPending = TBD_NAMES.has(leadName.trim().toLowerCase());
  const isExchange = unit.slug === 'scope' || unit.slug === 'score';
  const Back = ar ? ArrowRight : ArrowLeft;
  const joinHref = `${localizePath(locale, '/join')}?committee=${unit.slug}#apply`;

  return (
    <main className="unit-page" style={{ '--accent': unit.color } as CSSProperties}>
      <section className="unit-hero">
        <div className="site-container unit-hero-inner">
          <div>
            <Link className="back-link" href={localizePath(locale, `/${kind}`)}>
              <Back size={16} />
              {isCommittee ? (ar ? 'كل اللجان' : 'All committees') : ar ? 'كل الأقسام' : 'All divisions'}
            </Link>
            <span className="unit-kind">
              {isCommittee ? (ar ? 'لجنة دائمة' : 'Standing Committee') : ar ? 'قسم دعم' : 'Support Division'} · {unit.name}
            </span>
            <h1>{text(unit.fullName, locale)}</h1>
            <p>{text(unit.description, locale)}</p>
            <div className="hero-actions">
              <Link className="button unit-cta" href={joinHref}>
                {ar ? `انضم إلى ${unit.name}` : `Join ${unit.name}`}
                <DirectionIcon locale={locale} />
              </Link>
              {activities.length ? (
                <a className="button ghost-on-dark" href="#activities">
                  {ar ? `الأنشطة (${activities.length})` : `Activities (${activities.length})`}
                </a>
              ) : null}
            </div>
          </div>
          <div className="unit-logo-card">
            <img src={unit.logo} alt={unit.name} />
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container unit-about">
          <div>
            <SectionHeader
              eyebrow={ar ? 'نبذة' : 'About'}
              title={ar ? `ماذا تفعل ${unit.name}؟` : `What ${unit.name} does`}
            />
            {extra ? <p className="unit-about-text">{text(extra.about, locale)}</p> : null}
            {extra ? (
              <p className="unit-audience">
                <Sparkles size={18} aria-hidden="true" />
                {text(extra.audience, locale)}
              </p>
            ) : null}
          </div>

          <aside className="unit-side">
            {lead ? (
              <div className="unit-lead">
                <div className="unit-lead-avatar">
                  {lead.imageUrl ? <img src={lead.imageUrl} alt={leadName} /> : <UserRound size={30} aria-hidden="true" />}
                </div>
                <div>
                  <span>{text(lead.positionTitle, locale)}</span>
                  <strong className={leadPending ? 'pending' : undefined}>
                    {leadPending ? (ar ? 'يُعلن قريباً' : 'To be announced') : leadName}
                  </strong>
                </div>
              </div>
            ) : null}
            <div className="unit-side-facts">
              <span>
                <CheckCircle2 size={16} aria-hidden="true" />
                {ar ? `${unit.programs.length} مجالات عمل` : `${unit.programs.length} focus areas`}
              </span>
              <span>
                <UsersRound size={16} aria-hidden="true" />
                {ar ? 'مفتوحة لكل طلاب طب بني سويف' : 'Open to all Beni Suef medical students'}
              </span>
            </div>
            <Link className="button primary full" href={joinHref}>
              {ar ? 'قدّم الآن' : 'Apply now'}
              <DirectionIcon locale={locale} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="site-section alt">
        <div className="site-container">
          <SectionHeader
            eyebrow={ar ? 'البرامج' : 'Programs'}
            title={ar ? 'هتشتغل على إيه' : 'What you can work on'}
          />
          <div className="unit-programs">
            {unit.programs.map((program, i) => (
              <article key={program.en}>
                <span className="unit-program-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{text(program, locale)}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isExchange ? (
        <section className="site-section tight-bottom">
          <div className="site-container">
            <Link className="unit-exchange" href={localizePath(locale, '/exchange')}>
              <Plane size={28} aria-hidden="true" />
              <div>
                <strong>{ar ? 'برنامج التبادل الدولي' : 'International exchange program'}</strong>
                <span>
                  {ar
                    ? 'الوجهات، خطوات التقديم، العداد، والتقديم المبدئي في صفحة التبادل.'
                    : 'Destinations, how to apply, the countdown, and the pre-application are on the Exchange page.'}
                </span>
              </div>
              <DirectionIcon locale={locale} />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="site-section" id="activities">
        <div className="site-container">
          <SectionHeader
            eyebrow={ar ? 'الأنشطة' : 'Activities'}
            title={ar ? `أنشطة ${unit.name}` : `${unit.name} activities`}
          />
          {activities.length ? (
            <ActivityGrid locale={locale} activities={activities} units={[...content.committees, ...content.divisions]} />
          ) : (
            <p className="empty-state">
              {ar
                ? `لسه مفيش أنشطة منشورة لـ ${unit.name}. تابعنا، أو انضم وساعد في تنظيم أول نشاط.`
                : `No ${unit.name} activities published yet. Stay tuned, or join and help run the first one.`}
            </p>
          )}
        </div>
      </section>

      <section className="site-section alt">
        <div className="site-container">
          <SectionHeader
            eyebrow={isCommittee ? (ar ? 'اللجان' : 'Committees') : ar ? 'الأقسام' : 'Divisions'}
            title={isCommittee ? (ar ? 'لجان أخرى' : 'Other committees') : ar ? 'أقسام أخرى' : 'Other divisions'}
          />
          <ul className="logo-cloud unit-siblings">
            {siblings.map((item) => (
              <li key={item.slug} style={{ '--accent': item.color } as CSSProperties}>
                <Link href={unitHref(locale, kind, item.slug)} aria-label={text(item.fullName, locale)}>
                  <img src={item.logo} alt="" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="section-action">
            <Link className="text-link" href={localizePath(locale, isCommittee ? '/divisions' : '/committees')}>
              {isCommittee
                ? ar
                  ? 'شوف كمان أقسام الدعم'
                  : 'See the support divisions too'
                : ar
                  ? 'شوف كمان اللجان الدائمة'
                  : 'See the standing committees too'}
            </Link>
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </main>
  );
}
