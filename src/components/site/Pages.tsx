/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import MerchOrderForm from '@/components/site/MerchOrderForm';
import ActivityGrid, { activityHref } from '@/components/site/ActivityGrid';
import ActivityBrowser from '@/components/site/ActivityBrowser';
import ExchangeCountdown from '@/components/site/ExchangeCountdown';
import { IconFor } from '@/components/site/icons';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Crown,
  Eye,
  GraduationCap,
  Gem,
  HeartPulse,
  Layers,
  Mail,
  MessageCircle,
  Stethoscope,
  Target,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { siteCopy } from '@/lib/bmsa-data';
import { localizePath } from '@/lib/routes';
import { submitMembershipApplication } from '@/app/actions';
import type { Activity, BmsaContent, Locale, NewsItem, OrgUnit } from '@/lib/types';
import { text } from '@/lib/types';
import { activityGroupKey, activityTag, uniqueActivities } from '@/lib/activity-groups';

type NoticeParams = Record<string, string | string[] | undefined>;

const SAFE_GRADIENT_RE = /^(linear|radial|conic)-gradient\([\w\s,#%(). /-]+\)$/i;
function safeGradient(value: string | null | undefined): CSSProperties['background'] {
  if (!value) return undefined;
  return SAFE_GRADIENT_RE.test(value.trim()) ? value : undefined;
}

const href = localizePath;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function DirectionIcon({ locale }: { locale: Locale }) {
  return locale === 'ar' ? <ArrowLeft size={17} /> : <ArrowRight size={17} />;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}

export function PageHero({
  locale,
  title,
  lead,
  badge,
}: {
  locale: Locale;
  title: string;
  lead: string;
  badge: string;
}) {
  return (
    <section className="page-hero">
      <div className="site-container page-hero-inner">
        <div>
          <span className="eyebrow">{badge}</span>
          <h1>{title}</h1>
          <p>{lead}</p>
        </div>
        <div className="page-hero-mark" aria-hidden="true">
          <img src="/images/logos/bmsa-logo-v.png" alt="" />
          <span>{locale === 'ar' ? 'بني سويف' : 'Beni Suef'}</span>
        </div>
      </div>
    </section>
  );
}

function Notice({ locale, params, successKey }: { locale: Locale; params?: NoticeParams; successKey: 'submitted' | 'ordered' }) {
  if (!params) return null;

  const hasSuccess = params[successKey] === '1';
  const hasError = Boolean(params.error);

  if (!hasSuccess && !hasError) return null;

  const email = siteCopy[locale].email;
  const copy = {
    en: {
      success:
        successKey === 'ordered'
          ? 'Thank you! Your order request was received. The team will contact you to confirm price and pickup.'
          : 'Thank you! Your application was received. The team will review it and contact you soon.',
      cms: `Online submissions are temporarily unavailable. Please email us at ${email}.`,
      submit: `Something went wrong. Please check your details and try again, or email us at ${email}.`,
    },
    ar: {
      success:
        successKey === 'ordered'
          ? 'شكراً! تم استلام طلبك، وسيتواصل معك الفريق لتأكيد السعر وموعد الاستلام.'
          : 'شكراً! تم استلام طلب انضمامك، وسيراجعه الفريق ويتواصل معك قريباً.',
      cms: `الإرسال الإلكتروني غير متاح مؤقتاً. راسلنا على ${email}.`,
      submit: `حدث خطأ. راجع بياناتك وحاول مرة أخرى، أو راسلنا على ${email}.`,
    },
  }[locale];

  return (
    <div className={hasSuccess ? 'form-notice success' : 'form-notice error'} role={hasSuccess ? 'status' : 'alert'}>
      {hasSuccess ? copy.success : params.error === 'cms' ? copy.cms : copy.submit}
    </div>
  );
}

export function CtaBand({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <section className="cta-band">
      <div className="site-container cta-band-inner">
        <div>
          <h2>{locale === 'ar' ? 'جاهز تبدأ رحلتك مع بمسا؟' : 'Ready to start your BMSA journey?'}</h2>
          <p>
            {locale === 'ar'
              ? 'انضم لمئات من طلاب طب بني سويف واكتسب خبرة حقيقية في التعليم والبحث والصحة العامة والتبادل الدولي.'
              : 'Join fellow Beni Suef medical students and gain real experience in education, research, public health, and international exchange.'}
          </p>
        </div>
        <div className="cta-band-actions">
          <Link className="button primary" href={href(locale, '/join')}>
            {copy.joinCta}
            <DirectionIcon locale={locale} />
          </Link>
          <a className="button ghost-on-dark" href={`mailto:${copy.email}`}>
            <Mail size={17} />
            {locale === 'ar' ? 'راسلنا' : 'Email us'}
          </a>
        </div>
      </div>
    </section>
  );
}

export function HomePage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const copy = siteCopy[locale];
  const featuredActivities = uniqueActivities(content.activities).slice(0, 3);

  return (
    <main>
      <section className="home-hero">
        <div className="site-container hero-layout">
          <div className="hero-copy">
            <span className="hero-badge">
              <Stethoscope size={18} />
              {copy.tagline}
            </span>
            <h1>{copy.heroTitle}</h1>
            <p>{copy.heroLead}</p>
            <div className="hero-actions">
              <Link className="button primary" href={href(locale, '/join')}>
                {copy.joinCta}
                <DirectionIcon locale={locale} />
              </Link>
              <Link className="button ghost-on-dark" href={href(locale, '/committees')}>
                {copy.committeesCta}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <span className="hero-ring" aria-hidden="true" />
            <div className="hero-logo">
              <img src="/images/logos/bmsa-logo-v.png" alt={copy.brand} />
            </div>
            <ul className="orbit-grid" aria-label={locale === 'ar' ? 'اللجان الدائمة' : 'Standing committees'}>
              {content.committees.map((committee) => (
                <li key={committee.slug} style={{ '--accent': committee.color } as CSSProperties}>
                  <Link href={`${href(locale, '/committees')}/${committee.slug}`} aria-label={committee.name}>
                    <img src={committee.logo} alt="" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-container hero-divisions">
          <span className="hero-divisions-label">
            <Layers size={16} />
            {locale === 'ar' ? 'أقسام الدعم' : 'Support divisions'}
          </span>
          <ul aria-label={locale === 'ar' ? 'أقسام الدعم' : 'Support divisions'}>
            {content.divisions.map((division) => (
              <li key={division.slug} style={{ '--accent': division.color } as CSSProperties}>
                <Link
                  href={`${href(locale, '/divisions')}/${division.slug}`}
                  aria-label={`${division.name} — ${text(division.fullName, locale)}`}
                  title={text(division.fullName, locale)}
                >
                  <img src={division.logo} alt="" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="stats-band" aria-label={locale === 'ar' ? 'أرقام' : 'Key numbers'}>
        <div className="site-container stats-grid">
          {copy.stats.map(([value, label, sublabel]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
              {sublabel ? <small>{sublabel}</small> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'اللجان' : 'Committees'}
            title={locale === 'ar' ? 'ست لجان تغطي مسارات العمل الطبي الطلابي' : 'Six committees covering every student pathway'}
            lead={
              locale === 'ar'
                ? 'كل لجنة تقود مساحة مختلفة من التعليم، التبادل، الصحة العامة، البحث، والمناصرة.'
                : 'Each committee leads a different part of education, exchange, public health, research, and advocacy.'
            }
          />
          <UnitGrid locale={locale} units={content.committees} basePath="/committees" />
        </div>
      </section>

      <section className="site-section alt">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'أقسام الدعم' : 'Support Divisions'}
            title={locale === 'ar' ? 'خمسة أقسام تقف وراء كل مشروع' : 'Five divisions behind every project'}
            lead={
              locale === 'ar'
                ? 'التدريب، تصميم المشاريع، الإعلام، التمويل، والبحث العلمي — أقسام تدعم كل اللجان وتفتح لك مسارات مختلفة للمشاركة.'
                : 'Training, project design, media, fundraising, and research — divisions that support every committee and give you more ways to get involved.'
            }
          />
          <UnitGrid locale={locale} units={content.divisions} basePath="/divisions" />
          <div className="section-action">
            <Link className="button secondary" href={href(locale, '/divisions')}>
              {locale === 'ar' ? 'اكتشف أقسام الدعم' : 'Explore support divisions'}
              <DirectionIcon locale={locale} />
            </Link>
          </div>
        </div>
      </section>

      <section className="exchange-teaser">
        <div className="site-container exchange-teaser-inner">
          <div>
            <span className="eyebrow">{locale === 'ar' ? 'التبادل الدولي' : 'Exchange'}</span>
            <h2>{locale === 'ar' ? 'تدرّب في مستشفى أو معمل بحثي بالخارج' : 'Train in a hospital or research lab abroad'}</h2>
            <p>
              {locale === 'ar'
                ? 'تبادل إكلينيكي مع SCOPE وبحثي مع SCORE عبر شبكة IFMSA. اعرف الخطوات، الوجهات، وتجارب الطلاب.'
                : 'Clinical exchange with SCOPE and research exchange with SCORE through the IFMSA network. See the steps, destinations, and student stories.'}
            </p>
            <ExchangeCountdown
              locale={locale}
              calls={content.exchangeCalls}
              variant="compact"
              ctaHref={`${href(locale, '/exchange')}#pre-apply`}
            />
          </div>
          <div className="exchange-teaser-side">
            <span className="exchange-flags" aria-hidden="true">
              {content.exchangeDestinations.slice(0, 6).map((destination) => destination.flag).join(' ')}
            </span>
            <Link className="button primary" href={href(locale, '/exchange')}>
              {locale === 'ar' ? 'اكتشف التبادل' : 'Explore exchange'}
              <DirectionIcon locale={locale} />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container split-feature">
          <div>
            <SectionHeader
              eyebrow={locale === 'ar' ? 'عن بمسا' : 'About BMSA'}
              title={locale === 'ar' ? 'لجنة محلية بطموح عالمي' : 'A local committee with a global reach'}
              lead={
                locale === 'ar'
                  ? 'بمسا بني سويف تجمع طلاب الطب حول الخبرة العملية، خدمة المجتمع، والتعلم من شبكة IFMSA العالمية.'
                  : 'BMSA Benisuef brings medical students together around practical experience, community service, and IFMSA global learning.'
              }
            />
            <ul className="check-list">
              {(locale === 'ar'
                ? ['لجنة محلية معتمدة ضمن IFMSA-Egypt', 'برامج تبادل دولية وفرص قيادة', 'حملات صحية تخدم مجتمع بني سويف']
                : ['Official IFMSA-Egypt local committee', 'International exchange and leadership opportunities', 'Health campaigns serving the Beni Suef community']
              ).map((item) => (
                <li key={item}>
                  <CheckCircle2 size={19} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className="button primary" href={href(locale, '/about')}>
              {locale === 'ar' ? 'اعرف أكثر' : 'Learn more'}
              <DirectionIcon locale={locale} />
            </Link>
          </div>
          <div className="affiliation-card">
            <img src="/images/logos/ifmsa-egypt.png" alt="IFMSA-Egypt" />
            <h3>IFMSA-Egypt</h3>
            <p>
              {locale === 'ar'
                ? 'جزء من الاتحاد الدولي لجمعيات طلاب الطب (IFMSA)، أكبر شبكة لطلاب الطب في العالم.'
                : 'Part of the International Federation of Medical Students’ Associations (IFMSA), the world’s largest network of medical students.'}
            </p>
          </div>
        </div>
      </section>

      {featuredActivities.length ? (
        <section className="site-section alt">
          <div className="site-container">
            <SectionHeader
              eyebrow={locale === 'ar' ? 'آخر الأنشطة' : 'Recent Activities'}
              title={locale === 'ar' ? 'العمل على الأرض' : 'Work happening on the ground'}
              lead={
                locale === 'ar'
                  ? 'لمحة من الحملات والورش وبرامج التبادل التي تنفذها لجاننا.'
                  : 'A glimpse of the campaigns, workshops, and exchanges our committees run.'
              }
            />
            <ActivityGrid locale={locale} activities={featuredActivities} units={[...content.committees, ...content.divisions]} />
            <div className="section-action">
              <Link className="button secondary" href={href(locale, '/activities')}>
                {locale === 'ar' ? 'كل الأنشطة' : 'All activities'}
                <DirectionIcon locale={locale} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand locale={locale} />
    </main>
  );
}

export function AboutPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const pillars: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: Target,
      title: locale === 'ar' ? 'رسالتنا' : 'Mission',
      body:
        locale === 'ar'
          ? 'تمكين طلاب الطب من المعرفة والمهارات والمسؤولية المجتمعية.'
          : 'Empower medical students with knowledge, practical skills, and social responsibility.',
    },
    {
      icon: Eye,
      title: locale === 'ar' ? 'رؤيتنا' : 'Vision',
      body:
        locale === 'ar'
          ? 'جيل من الأطباء القادة القادرين على خدمة مجتمعهم والتواصل عالمياً.'
          : 'A generation of physician-leaders who serve locally and connect globally.',
    },
    {
      icon: Gem,
      title: locale === 'ar' ? 'قيمنا' : 'Values',
      body:
        locale === 'ar'
          ? 'النزاهة، الدمج، الابتكار، الخدمة، والتعاون الدولي.'
          : 'Integrity, inclusion, innovation, service, and international collaboration.',
    },
  ];

  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'من نحن' : 'Who we are'}
        title={locale === 'ar' ? 'عن بمسا بني سويف' : 'About BMSA Benisuef'}
        lead={
          locale === 'ar'
            ? 'منصة طلابية تجمع التعليم الطبي، التبادل الدولي، خدمة المجتمع، والقيادة داخل كلية طب بني سويف.'
            : 'A student platform joining medical education, international exchange, community service, and leadership at Beni Suef Faculty of Medicine.'
        }
      />

      <section className="site-section">
        <div className="site-container cards-three">
          {pillars.map(({ icon: Icon, title, body }) => (
            <article className="info-card" key={title}>
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section alt">
        <div className="site-container timeline">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'رحلتنا' : 'Journey'}
            title={locale === 'ar' ? 'نمو مستمر داخل الجامعة والمجتمع' : 'Growing inside the university and community'}
          />
          {[
            [
              locale === 'ar' ? 'التأسيس' : 'Foundation',
              locale === 'ar'
                ? 'انطلاق اللجنة المحلية داخل كلية طب بني سويف كجزء من IFMSA-Egypt.'
                : 'The local committee begins inside Beni Suef Faculty of Medicine as part of IFMSA-Egypt.',
            ],
            [
              locale === 'ar' ? 'النمو' : 'Growth',
              locale === 'ar'
                ? 'توسع أنشطة اللجان الست وانطلاق أقسام الدعم وبرامج بناء القدرات.'
                : 'The six committees expand their work, and support divisions and capacity-building programs take shape.',
            ],
            [
              locale === 'ar' ? 'اليوم' : 'Today',
              locale === 'ar'
                ? 'مئات الأعضاء، حملات صحية مستمرة، وفرص تبادل دولي كل عام.'
                : 'Hundreds of members, ongoing health campaigns, and international exchange opportunities every year.',
            ],
          ].map(([title, body]) => (
            <article key={title}>
              <span />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'هيكلنا' : 'Our structure'}
            title={locale === 'ar' ? 'كيف تعمل بمسا' : 'How BMSA is organized'}
            lead={
              locale === 'ar'
                ? 'المجلس التنفيذي يقود، واللجان الدائمة تنفذ البرامج، وأقسام الدعم تمدّ الجميع بالتدريب والتصميم والتمويل والبحث.'
                : 'The Executive Board leads, the standing committees run programs, and the support divisions power everyone with training, design, funding, and research.'
            }
          />
          <div className="org-chart">
            <div className="org-node org-eb">
              <Crown size={20} />
              <strong>{locale === 'ar' ? 'المجلس التنفيذي' : 'Executive Board'}</strong>
              <span>{locale === 'ar' ? 'الرئيس، نائب الرئيس، الأمين العام' : 'President, Vice President, Secretary General'}</span>
            </div>
            <div className="org-branches">
              <div className="org-node">
                <strong>{locale === 'ar' ? '6 لجان دائمة' : '6 Standing Committees'}</strong>
                <ul className="logo-cloud">
                  {content.committees.map((unit) => (
                    <li key={unit.slug} style={{ '--accent': unit.color } as CSSProperties}>
                      <Link href={`${href(locale, '/committees')}/${unit.slug}`} aria-label={unit.name}>
                        <img src={unit.logo} alt="" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="org-node">
                <strong>{locale === 'ar' ? '5 أقسام دعم' : '5 Support Divisions'}</strong>
                <ul className="logo-cloud">
                  {content.divisions.map((unit) => (
                    <li key={unit.slug} style={{ '--accent': unit.color } as CSSProperties}>
                      <Link href={`${href(locale, '/divisions')}/${unit.slug}`} aria-label={unit.name}>
                        <img src={unit.logo} alt="" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BoardSection locale={locale} content={content} />
      <CtaBand locale={locale} />
    </main>
  );
}

function UnitDetailList({
  locale,
  units,
  activities,
  jumpLabel,
  basePath,
}: {
  locale: Locale;
  units: OrgUnit[];
  activities: Activity[];
  jumpLabel: string;
  basePath: '/committees' | '/divisions';
}) {
  return (
    <>
      <nav className="anchor-chips site-container" aria-label={jumpLabel}>
        {units.map((unit) => (
          <a key={unit.slug} href={`#${unit.slug}`} style={{ '--accent': unit.color } as CSSProperties}>
            {unit.name}
          </a>
        ))}
      </nav>
      <section className="site-section tight-top">
        <div className="site-container committee-detail-list">
          {units.map((unit, index) => {
            const count = activities.filter((activity) => activity.committee === unit.slug).length;
            return (
              <article className="committee-detail" id={unit.slug} key={unit.slug} style={{ '--accent': unit.color } as CSSProperties}>
                <div className="committee-logo-panel">
                  <img src={unit.logo} alt={unit.name} />
                </div>
                <div>
                  <span className="eyebrow">{unit.name}</span>
                  <h2>
                    <Link href={`${href(locale, basePath)}/${unit.slug}`}>{text(unit.fullName, locale)}</Link>
                  </h2>
                  <p>{text(unit.description, locale)}</p>
                  <div className="program-grid">
                    {unit.programs.map((program) => (
                      <span key={text(program, locale)}>
                        <CheckCircle2 size={16} />
                        {text(program, locale)}
                      </span>
                    ))}
                  </div>
                  <div className="committee-actions">
                    <Link className="button primary" href={`${href(locale, basePath)}/${unit.slug}`}>
                      {locale === 'ar' ? `اعرف أكثر عن ${unit.name}` : `More about ${unit.name}`}
                      <DirectionIcon locale={locale} />
                    </Link>
                    <Link className="button secondary" href={`${href(locale, '/join')}?committee=${unit.slug}#apply`}>
                      {locale === 'ar' ? `انضم إلى ${unit.name}` : `Join ${unit.name}`}
                    </Link>
                    {count ? (
                      <Link className="text-link" href={`${href(locale, '/activities')}?committee=${unit.slug}`}>
                        {locale === 'ar' ? `أنشطة ${unit.name} (${count})` : `${unit.name} activities (${count})`}
                      </Link>
                    ) : null}
                    {unit.slug === 'scope' || unit.slug === 'score' ? (
                      <Link className="text-link" href={href(locale, '/exchange')}>
                        {locale === 'ar' ? 'برنامج التبادل والوجهات' : 'Exchange program & destinations'}
                      </Link>
                    ) : null}
                  </div>
                </div>
                <strong className="section-index">{String(index + 1).padStart(2, '0')}</strong>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

/** Small band that points visitors from committees to divisions and vice versa. */
function CrossLinkBand({
  locale,
  units,
  title,
  body,
  linkLabel,
  path,
}: {
  locale: Locale;
  units: OrgUnit[];
  title: string;
  body: string;
  linkLabel: string;
  path: string;
}) {
  return (
    <section className="site-section alt">
      <div className="site-container cross-link">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
          <Link className="button secondary" href={href(locale, path)}>
            {linkLabel}
            <DirectionIcon locale={locale} />
          </Link>
        </div>
        <ul className="logo-cloud">
          {units.map((unit) => (
            <li key={unit.slug} style={{ '--accent': unit.color } as CSSProperties}>
              <Link href={`${href(locale, path)}/${unit.slug}`} aria-label={unit.name}>
                <img src={unit.logo} alt="" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CommitteesPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'اللجان' : 'Committees'}
        title={locale === 'ar' ? 'اللجان الدائمة' : 'Standing Committees'}
        lead={
          locale === 'ar'
            ? 'ست لجان دائمة، لكل منها مجال تأثير واضح وبرامج يمكنك المشاركة فيها من أول سنة.'
            : 'Six standing committees, each with a clear focus and programs you can take part in from your first year.'
        }
      />
      <UnitDetailList
        locale={locale}
        units={content.committees}
        activities={content.activities}
        basePath="/committees"
        jumpLabel={locale === 'ar' ? 'انتقل إلى لجنة' : 'Jump to a committee'}
      />
      <CrossLinkBand
        locale={locale}
        units={content.divisions}
        path="/divisions"
        title={locale === 'ar' ? 'وراء كل لجنة، أقسام دعم' : 'Behind every committee: the support divisions'}
        body={
          locale === 'ar'
            ? 'التدريب، تصميم المشاريع، الإعلام، التمويل، والبحث العلمي. أقسام تخدم كل اللجان، وتقدر تنضم لها كمان.'
            : 'Training, project design, media, fundraising, and research. These divisions serve every committee, and you can join them too.'
        }
        linkLabel={locale === 'ar' ? 'اكتشف أقسام الدعم' : 'Explore support divisions'}
      />
    </main>
  );
}

export function DivisionsPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'الأقسام' : 'Divisions'}
        title={locale === 'ar' ? 'أقسام الدعم' : 'Support Divisions'}
        lead={
          locale === 'ar'
            ? 'خمسة أقسام تدعم كل اللجان: تدريب، مشاريع، إعلام، تمويل، وبحث علمي. ولكل قسم فريق تقدر تنضم له.'
            : 'Five divisions that power every committee: training, projects, media, fundraising, and research. Each one has a team you can join.'
        }
      />
      <UnitDetailList
        locale={locale}
        units={content.divisions}
        activities={content.activities}
        basePath="/divisions"
        jumpLabel={locale === 'ar' ? 'انتقل إلى قسم' : 'Jump to a division'}
      />
      <CrossLinkBand
        locale={locale}
        units={content.committees}
        path="/committees"
        title={locale === 'ar' ? 'الأقسام تخدم اللجان الست' : 'Divisions serve all six committees'}
        body={
          locale === 'ar'
            ? 'كل مشروع في SCOME أو SCOPH أو أي لجنة تانية بيعتمد على تدريب وتصميم وتمويل وتغطية من أقسام الدعم.'
            : 'Every SCOME, SCOPH, or other committee project relies on training, design, funding, and coverage from the support divisions.'
        }
        linkLabel={locale === 'ar' ? 'استكشف اللجان' : 'Explore committees'}
      />
      <CtaBand locale={locale} />
    </main>
  );
}

export function ActivitiesPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'الأنشطة' : 'Activities'}
        title={locale === 'ar' ? 'أنشطة ومشاريع بمسا' : 'BMSA activities and projects'}
        lead={
          locale === 'ar'
            ? 'حملات توعية، ورش مهارات، وبرامج تبادل تنفذها لجاننا داخل الكلية وفي مجتمع بني سويف.'
            : 'Awareness campaigns, skills workshops, and exchange programs run by our committees across the faculty and the Beni Suef community.'
        }
      />
      <section className="site-section">
        <div className="site-container">
          <ActivityBrowser locale={locale} activities={content.activities} units={[...content.committees, ...content.divisions]} />
        </div>
      </section>
    </main>
  );
}

export function ActivityDetailPage({
  locale,
  content,
  activity,
}: {
  locale: Locale;
  content: BmsaContent;
  activity: Activity;
}) {
  const isDivision = content.divisions.some((item) => item.slug === activity.committee);
  const committee: OrgUnit | undefined = [...content.committees, ...content.divisions].find((item) => item.slug === activity.committee);
  const related = uniqueActivities(content.activities)
    .filter((item) => activityGroupKey(item) !== activityGroupKey(activity))
    .sort((a, b) => Number(b.committee === activity.committee) - Number(a.committee === activity.committee))
    .slice(0, 3);
  const Back = locale === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <main style={{ '--accent': committee?.color } as CSSProperties}>
      <section className="page-hero activity-hero">
        <div className="site-container">
          <Link className="back-link" href={href(locale, '/activities')}>
            <Back size={16} />
            {locale === 'ar' ? 'كل الأنشطة' : 'All activities'}
          </Link>
          <span className="eyebrow">{activityTag(activity, locale)}</span>
          <h1>{text(activity.title, locale)}</h1>
          <p>{text(activity.excerpt, locale)}</p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container activity-detail">
          <article>
            <div className="activity-detail-media">
              {activity.imageUrl ? (
                <img src={activity.imageUrl} alt={text(activity.title, locale)} />
              ) : (
                <IconFor name={activity.icon} size={64} />
              )}
            </div>
            <div className="activity-detail-body">
              {text(activity.description, locale)
                .split(/\n{2,}/)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </article>

          {committee ? (
            <aside className="form-card activity-committee">
              <span className="eyebrow">
                {locale === 'ar' ? (isDivision ? 'القسم المنظم' : 'اللجنة المنظمة') : 'Organized by'}
              </span>
              <img src={committee.logo} alt={committee.name} />
              <h2>{text(committee.fullName, locale)}</h2>
              <p>{text(committee.description, locale)}</p>
              <Link className="button primary full" href={`${href(locale, '/join')}?committee=${committee.slug}#apply`}>
                {locale === 'ar' ? `انضم إلى ${committee.name}` : `Join ${committee.name}`}
                <DirectionIcon locale={locale} />
              </Link>
              <Link className="text-link" href={`${href(locale, isDivision ? '/divisions' : '/committees')}/${committee.slug}`}>
                {locale === 'ar' ? (isDivision ? 'عن القسم' : 'عن اللجنة') : isDivision ? 'About this division' : 'About this committee'}
              </Link>
            </aside>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <section className="site-section alt">
          <div className="site-container">
            <SectionHeader
              eyebrow={locale === 'ar' ? 'المزيد' : 'More'}
              title={locale === 'ar' ? 'أنشطة أخرى' : 'Other activities'}
            />
            <ActivityGrid locale={locale} activities={related} units={[...content.committees, ...content.divisions]} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

function newsHref(locale: Locale, slug: string) {
  return href(locale, `/news/${slug}`);
}

function formatPostedAt(value: string | null | undefined, locale: Locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Cairo',
  }).format(date);
}

/** News cards reuse the activity card styles. */
function NewsGrid({ locale, items }: { locale: Locale; items: NewsItem[] }) {
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;
  return (
    <div className="activity-grid">
      {items.map((item, i) => {
        const posted = formatPostedAt(item.postedAt, locale);
        return (
          <article className="activity-card" key={item.slug} style={{ animationDelay: `${i * 90}ms` }}>
            <Link className="activity-thumb" href={newsHref(locale, item.slug)} tabIndex={-1} aria-hidden="true">
              {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : <IconFor name="calendar-days" size={42} />}
            </Link>
            <div className="activity-body">
              <span className="activity-tag">
                {text(item.tag, locale)}
                {posted ? ` · ${posted}` : ''}
              </span>
              <h3>
                <Link href={newsHref(locale, item.slug)}>{text(item.title, locale)}</Link>
              </h3>
              <p>{text(item.excerpt, locale)}</p>
              <Link className="card-cta" href={newsHref(locale, item.slug)}>
                {locale === 'ar' ? 'اقرأ المزيد' : 'Read more'}
                <Arrow size={17} />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function NewsPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'الأخبار' : 'News'}
        title={locale === 'ar' ? 'أخبار بمسا' : 'BMSA news'}
        lead={
          locale === 'ar'
            ? 'الريكروتمنت، أخبار الفريق، الشراكات، وكل جديد في بمسا بني سويف.'
            : 'Recruitment, team announcements, partnerships, and everything new at BMSA Benisuef.'
        }
      />
      <section className="site-section">
        <div className="site-container">
          {content.news.length ? (
            <NewsGrid locale={locale} items={content.news} />
          ) : (
            <p>{locale === 'ar' ? 'لا توجد أخبار حاليًا.' : 'No news yet.'}</p>
          )}
        </div>
      </section>
    </main>
  );
}

export function NewsDetailPage({ locale, content, item }: { locale: Locale; content: BmsaContent; item: NewsItem }) {
  const posted = formatPostedAt(item.postedAt, locale);
  const more = content.news.filter((other) => other.slug !== item.slug).slice(0, 3);
  const Back = locale === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <main>
      <section className="page-hero activity-hero">
        <div className="site-container">
          <Link className="back-link" href={href(locale, '/news')}>
            <Back size={16} />
            {locale === 'ar' ? 'كل الأخبار' : 'All news'}
          </Link>
          <span className="eyebrow">
            {text(item.tag, locale)}
            {posted ? ` · ${posted}` : ''}
          </span>
          <h1>{text(item.title, locale)}</h1>
          <p>{text(item.excerpt, locale)}</p>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container activity-detail">
          <article>
            {item.imageUrl ? (
              <div className="activity-detail-media">
                <img src={item.imageUrl} alt={text(item.title, locale)} />
              </div>
            ) : null}
            <div className="activity-detail-body">
              {text(item.body, locale)
                .split(/\n{2,}/)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
          </article>
        </div>
      </section>

      {more.length ? (
        <section className="site-section alt">
          <div className="site-container">
            <SectionHeader eyebrow={locale === 'ar' ? 'المزيد' : 'More'} title={locale === 'ar' ? 'أخبار أخرى' : 'More news'} />
            <NewsGrid locale={locale} items={more} />
          </div>
        </section>
      ) : null}
    </main>
  );
}

export function MerchPage({
  locale,
  content,
  params,
}: {
  locale: Locale;
  content: BmsaContent;
  params?: NoticeParams;
}) {
  const labels = {
    en: {
      badge: 'Merch',
      title: 'BMSA merch store',
      lead: 'Browse the collection and send an order request. The team will contact you to confirm availability, price, and pickup.',
      order: 'Order request',
      orderItem: 'Order this',
      product: 'Product',
      size: 'Size',
      qty: 'Quantity',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone (WhatsApp)',
      notes: 'Notes',
      submit: 'Send order request',
    },
    ar: {
      badge: 'المتجر',
      title: 'متجر بمسا',
      lead: 'استعرض المنتجات وأرسل طلبك، وسيتواصل معك الفريق لتأكيد التوفر والسعر وموعد الاستلام.',
      order: 'طلب منتج',
      orderItem: 'اطلب الآن',
      product: 'المنتج',
      size: 'المقاس',
      qty: 'الكمية',
      name: 'الاسم بالكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف (واتساب)',
      notes: 'ملاحظات',
      submit: 'إرسال الطلب',
    },
  }[locale];

  return (
    <main>
      <PageHero locale={locale} badge={labels.badge} title={labels.title} lead={labels.lead} />
      <section className="site-section">
        <div className="site-container merch-layout">
          <div className="merch-grid">
            {content.merchItems.map((item) => (
              <article className={item.inStock ? 'merch-card' : 'merch-card sold-out'} key={item.slug}>
                <div className="merch-art" style={{ background: safeGradient(item.gradient) }}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={text(item.name, locale)} loading="lazy" /> : <IconFor name={item.icon} size={48} />}
                </div>
                <div>
                  <h2>{text(item.name, locale)}</h2>
                  <p>{text(item.description, locale)}</p>
                  <strong>{text(item.price, locale)}</strong>
                  {item.inStock ? (
                    <Link className="text-link" href={`?item=${item.slug}#order`}>
                      {labels.orderItem}
                    </Link>
                  ) : (
                    <span className="stock-pill">{locale === 'ar' ? 'غير متاح' : 'Out of stock'}</span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <aside className="form-card" id="order">
            <h2>{labels.order}</h2>
            <Notice locale={locale} params={params} successKey="ordered" />
            <MerchOrderForm
              key={firstParam(params?.item) || 'none'}
              locale={locale}
              items={content.merchItems}
              labels={labels}
              initialSlug={firstParam(params?.item)}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}

const academicYears = {
  en: ['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year', 'Intern'],
  ar: ['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة', 'الفرقة الخامسة', 'الفرقة السادسة', 'امتياز'],
};

export function JoinPage({
  locale,
  content,
  params,
}: {
  locale: Locale;
  content: BmsaContent;
  params?: NoticeParams;
}) {
  const labels = {
    en: {
      badge: 'Join',
      title: 'Become a BMSA member',
      formTitle: 'Membership application',
      lead: 'Tell us where you want to contribute. Our team reviews every application and will contact you about next steps.',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone (WhatsApp)',
      year: 'Academic year',
      chooseYear: 'Choose your year',
      committee: 'Committee or division',
      chooseCommittee: 'Choose a committee or division',
      motivation: 'Why do you want to join?',
      motivationHint: 'A few sentences about your interests and what you hope to do.',
      submit: 'Submit application',
    },
    ar: {
      badge: 'انضم',
      title: 'انضم إلى بمسا',
      formTitle: 'طلب العضوية',
      lead: 'اخبرنا أين تريد أن تساهم. يراجع فريقنا كل طلب وسيتواصل معك بخصوص الخطوات التالية.',
      name: 'الاسم بالكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف (واتساب)',
      year: 'الفرقة الدراسية',
      chooseYear: 'اختر الفرقة',
      committee: 'اللجنة أو القسم',
      chooseCommittee: 'اختر لجنة أو قسماً',
      motivation: 'لماذا تريد الانضمام؟',
      motivationHint: 'بضع جمل عن اهتماماتك وما تتمنى أن تقدمه.',
      submit: 'إرسال الطلب',
    },
  }[locale];

  const requested = firstParam(params?.committee);
  const preselected = [...content.committees, ...content.divisions].some((unit) => unit.slug === requested) ? requested : '';

  const steps: { icon: LucideIcon; title: string; body: string }[] = [
    {
      icon: ClipboardList,
      title: locale === 'ar' ? 'قدّم الطلب' : 'Apply',
      body: locale === 'ar' ? 'املأ النموذج واختر اللجنة أو القسم الأقرب لاهتمامك.' : 'Fill in the form and pick the committee or division closest to your interests.',
    },
    {
      icon: MessageCircle,
      title: locale === 'ar' ? 'نتواصل معك' : 'We get in touch',
      body: locale === 'ar' ? 'يراجع الفريق طلبك ويتواصل معك عبر الهاتف أو البريد.' : 'The team reviews your application and contacts you by phone or email.',
    },
    {
      icon: UsersRound,
      title: locale === 'ar' ? 'ابدأ المشاركة' : 'Get involved',
      body: locale === 'ar' ? 'احضر التعريف بالأعضاء الجدد وشارك في أول نشاط.' : 'Attend the new-member orientation and join your first activity.',
    },
  ];

  return (
    <main>
      <PageHero locale={locale} badge={labels.badge} title={labels.title} lead={labels.lead} />
      <section className="site-section">
        <div className="site-container join-layout">
          <div>
            <div className="join-value-cards">
              {([
                {
                  icon: GraduationCap,
                  title: locale === 'ar' ? 'تعلّم وتطور' : 'Learn & grow',
                  body: locale === 'ar'
                    ? 'ورش مهارات، تدريب إكلينيكي، وتعليم بين الزملاء.'
                    : 'Skills workshops, clinical training, and peer education.',
                },
                {
                  icon: HeartPulse,
                  title: locale === 'ar' ? 'اخدم مجتمعك' : 'Serve your community',
                  body: locale === 'ar'
                    ? 'حملات صحة عامة وأنشطة ميدانية تؤثر فعلاً.'
                    : 'Public health campaigns and field activities that create real impact.',
                },
                {
                  icon: UsersRound,
                  title: locale === 'ar' ? 'قُد وتميّز' : 'Lead & stand out',
                  body: locale === 'ar'
                    ? 'فرص قيادة وتبادل دولي ضمن شبكة IFMSA.'
                    : 'Leadership roles and international exchange through the IFMSA network.',
                },
              ] as { icon: LucideIcon; title: string; body: string }[]).map(({ icon: Icon, title, body }) => (
                <div className="join-value-card" key={title}>
                  <Icon size={20} />
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>

            <SectionHeader
              eyebrow={locale === 'ar' ? 'كيف تنضم' : 'How it works'}
              title={locale === 'ar' ? 'ثلاث خطوات بسيطة' : 'Three simple steps'}
            />
            <ol className="steps-list">
              {steps.map(({ icon: Icon, title, body }, i) => (
                <li key={title}>
                  <span className="step-num">{i + 1}</span>
                  <div>
                    <h3>
                      <Icon size={18} />
                      {title}
                    </h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <SectionHeader
              eyebrow={locale === 'ar' ? 'اختيار المسار' : 'Choose your path'}
              title={locale === 'ar' ? 'ابحث عن المكان الأقرب لك' : 'Find the team that fits you'}
              lead={
                locale === 'ar'
                  ? 'تقدر تنضم لإحدى اللجان الست، أو لأحد أقسام الدعم لو بتحب التدريب أو الإعلام أو التمويل أو البحث.'
                  : 'Join one of the six committees, or a support division if you are into training, media, fundraising, or research.'
              }
            />
            <h3 className="grid-label">{locale === 'ar' ? 'اللجان الدائمة' : 'Standing Committees'}</h3>
            <UnitGrid locale={locale} units={content.committees} basePath="/committees" compact />
            <h3 className="grid-label">{locale === 'ar' ? 'أقسام الدعم' : 'Support Divisions'}</h3>
            <UnitGrid locale={locale} units={content.divisions} basePath="/divisions" compact />
          </div>

          <aside className="form-card" id="apply">
            <h2>{labels.formTitle}</h2>
            <Notice locale={locale} params={params} successKey="submitted" />
            <form action={submitMembershipApplication}>
              <input type="hidden" name="locale" value={locale} />
              <label>
                {labels.name}
                <input name="name" autoComplete="name" required />
              </label>
              <label>
                {labels.email}
                <input name="email" type="email" autoComplete="email" dir="ltr" required />
              </label>
              <label>
                {labels.phone}
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required />
              </label>
              <label>
                {labels.year}
                <select name="faculty_year" required defaultValue="">
                  <option value="" disabled>
                    {labels.chooseYear}
                  </option>
                  {academicYears[locale].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {labels.committee}
                <select name="committee_preference" required defaultValue={preselected}>
                  <option value="" disabled>
                    {labels.chooseCommittee}
                  </option>
                  <optgroup label={locale === 'ar' ? 'اللجان الدائمة' : 'Standing Committees'}>
                    {content.committees.map((committee) => (
                      <option key={committee.slug} value={committee.slug}>
                        {committee.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={locale === 'ar' ? 'أقسام الدعم' : 'Support Divisions'}>
                    {content.divisions.map((division) => (
                      <option key={division.slug} value={division.slug}>
                        {division.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <label>
                {labels.motivation}
                <textarea name="motivation" rows={5} required placeholder={labels.motivationHint} />
              </label>
              <button className="button primary full" type="submit">
                {labels.submit}
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}

function UnitGrid({
  locale,
  units,
  basePath,
  compact = false,
}: {
  locale: Locale;
  units: OrgUnit[];
  basePath: '/committees' | '/divisions';
  compact?: boolean;
}) {
  return (
    <div className={['committee-grid', compact ? 'compact' : '', basePath === '/divisions' ? 'divisions' : ''].filter(Boolean).join(' ')}>
      {units.map((unit, i) => (
        <article
          className="committee-card"
          key={unit.slug}
          style={{ '--accent': unit.color, animationDelay: `${i * 80}ms` } as CSSProperties}
        >
          <img src={unit.logo} alt={unit.name} />
          <h3>{text(unit.fullName, locale)}</h3>
          <p>{text(unit.description, locale)}</p>
          <Link href={`${href(locale, basePath)}/${unit.slug}`} aria-label={`${locale === 'ar' ? 'استكشف' : 'Explore'} ${unit.name}`}>
            {locale === 'ar' ? 'استكشف' : 'Explore'}
            <DirectionIcon locale={locale} />
          </Link>
        </article>
      ))}
    </div>
  );
}

const TBD_NAMES = new Set(['tbd', 'يُعلن لاحقاً', 'يعلن لاحقا', '']);

function BoardSection({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const eb = content.boardMembers.filter((member) => member.tier === 'eb');
  const officers = content.boardMembers.filter((member) => member.tier === 'to');
  const directors = content.boardMembers.filter((member) => member.tier === 'sdd');

  return (
    <section className="site-section">
      <div className="site-container">
        <SectionHeader
          eyebrow={locale === 'ar' ? 'الفريق' : 'Team'}
          title={locale === 'ar' ? 'المجلس التنفيذي وفريق المسؤولين (TO)' : 'Executive Board and Team of Officials (TO)'}
          lead={
            locale === 'ar'
              ? 'الفريق الذي يقود بمسا بني سويف هذا العام.'
              : 'The team leading BMSA Benisuef this term.'
          }
        />
        <div className="board-stack">
          <BoardTier
            title={locale === 'ar' ? 'المجلس التنفيذي' : 'Executive Board'}
            icon={Crown}
            members={eb}
            locale={locale}
          />
          <BoardTier
            title={locale === 'ar' ? 'فريق المسؤولين (TO): مسؤولو اللجان الدائمة' : 'Team of Officials (TO): Standing Committee Officers'}
            icon={GraduationCap}
            members={officers}
            locale={locale}
          />
          <BoardTier
            title={locale === 'ar' ? 'فريق المسؤولين (TO): مديرو أقسام الدعم' : 'Team of Officials (TO): Support Division Directors'}
            icon={Layers}
            members={directors}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}

function BoardTier({
  title,
  icon: Icon,
  members,
  locale,
}: {
  title: string;
  icon: LucideIcon;
  members: BmsaContent['boardMembers'];
  locale: Locale;
}) {
  if (!members.length) return null;

  return (
    <div className="board-tier">
      <h3>
        <Icon size={20} />
        {title}
      </h3>
      <div className="board-grid">
        {members.map((member) => {
          const name = text(member.memberName, locale);
          const pending = TBD_NAMES.has(name.trim().toLowerCase());
          return (
            <article className="board-card" key={`${member.tier}-${member.sortOrder}`}>
              <div className="avatar" style={{ background: safeGradient(member.gradient) }}>
                {member.imageUrl ? <img src={member.imageUrl} alt={name} loading="lazy" /> : <IconFor name={member.icon} size={30} />}
              </div>
              <h4>{text(member.positionTitle, locale)}</h4>
              <span>{text(member.role, locale)}</span>
              <strong className={pending ? 'pending' : undefined}>
                {pending ? (locale === 'ar' ? 'يُعلن قريباً' : 'To be announced') : name}
              </strong>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export { activityHref };
