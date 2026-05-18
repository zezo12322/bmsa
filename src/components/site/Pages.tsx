/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import MerchOrderForm from '@/components/site/MerchOrderForm';
import {
  ArrowLeft,
  ArrowRight,
  Badge,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Crown,
  FilePenLine,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Plane,
  Scale,
  Shirt,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { siteCopy } from '@/lib/bmsa-data';
import { submitMembershipApplication } from '@/app/actions';
import type { BmsaContent, Locale } from '@/lib/types';
import { text } from '@/lib/types';

type NoticeParams = Record<string, string | string[] | undefined>;

const SAFE_GRADIENT_RE = /^(linear|radial|conic)-gradient\([\w\s,#%(). /-]+\)$/i;
function safeGradient(value: string | null | undefined): CSSProperties['background'] {
  if (!value) return undefined;
  return SAFE_GRADIENT_RE.test(value.trim()) ? value : undefined;
}

const iconMap: Record<string, LucideIcon> = {
  badge: Badge,
  bag: ShoppingBag,
  book: BookOpen,
  'calendar-days': CalendarDays,
  'file-pen': FilePenLine,
  flask: FlaskConical,
  'heart-pulse': HeartPulse,
  mug: Coffee,
  plane: Plane,
  ribbon: Sparkles,
  scale: Scale,
  shirt: Shirt,
  stethoscope: Stethoscope,
  user: UsersRound,
  users: UsersRound,
  sparkles: Sparkles,
};

function IconFor({ name, size = 24 }: { name?: string | null; size?: number }) {
  const Icon = iconMap[name || ''] || CalendarDays;
  return <Icon size={size} />;
}

function href(locale: Locale, path: string) {
  if (locale === 'ar') return path === '/' ? '/ar' : `/ar${path}`;
  return path;
}

function DirectionIcon({ locale }: { locale: Locale }) {
  return locale === 'ar' ? <ArrowLeft size={17} /> : <ArrowRight size={17} />;
}

function SectionHeader({
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

function PageHero({
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

  const copy = {
    en: {
      success: successKey === 'ordered' ? 'Your order request was received.' : 'Your application was submitted.',
      cms: 'CMS is not configured yet. Add Supabase keys to enable submissions.',
      submit: 'Submission failed. Please try again or contact BMSA directly.',
    },
    ar: {
      success: successKey === 'ordered' ? 'تم استلام طلب المنتج.' : 'تم إرسال طلب الانضمام.',
      cms: 'لم يتم إعداد CMS بعد. أضف مفاتيح Supabase لتفعيل الإرسال.',
      submit: 'تعذر إرسال الطلب. حاول مرة أخرى أو تواصل مع بمسا مباشرة.',
    },
  }[locale];

  return (
    <div className={hasSuccess ? 'form-notice success' : 'form-notice error'}>
      {hasSuccess ? copy.success : params.error === 'cms' ? copy.cms : copy.submit}
    </div>
  );
}

export function HomePage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const copy = siteCopy[locale];
  const featuredActivities = content.activities.slice(0, 3);

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
            <img className="hero-logo" src="/images/logos/bmsa-logo-v.png" alt={copy.brand} />
            <div className="orbit-grid" aria-hidden="true">
              {content.committees.map((committee) => (
                <span key={committee.slug} style={{ '--accent': committee.color } as CSSProperties}>
                  <img src={committee.logo} alt="" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stats-band">
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
          <CommitteeGrid locale={locale} content={content} compact />
        </div>
      </section>

      <section className="site-section alt">
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
                ? 'جزء من أكبر اتحاد عالمي لطلاب الطب.'
                : 'Part of the world’s largest federation of medical students.'}
            </p>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'آخر الأنشطة' : 'Recent Activities'}
            title={locale === 'ar' ? 'العمل على الأرض' : 'Work happening on the ground'}
            lead={
              locale === 'ar'
                ? 'أمثلة من أنشطة اللجان، ويمكن تعديلها من لوحة الإدارة.'
                : 'Examples of committee work, editable from the admin dashboard.'
            }
          />
          <ActivityGrid locale={locale} activities={featuredActivities} />
          <div className="section-action">
            <Link className="button secondary" href={href(locale, '/activities')}>
              {locale === 'ar' ? 'كل الأنشطة' : 'All activities'}
              <DirectionIcon locale={locale} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AboutPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
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
          {[
            {
              title: locale === 'ar' ? 'رسالتنا' : 'Mission',
              body:
                locale === 'ar'
                  ? 'تمكين طلاب الطب من المعرفة والمهارات والمسؤولية المجتمعية.'
                  : 'Empower medical students with knowledge, practical skills, and social responsibility.',
            },
            {
              title: locale === 'ar' ? 'رؤيتنا' : 'Vision',
              body:
                locale === 'ar'
                  ? 'جيل من الأطباء القادة القادرين على خدمة مجتمعهم والتواصل عالمياً.'
                  : 'A generation of physician-leaders who serve locally and connect globally.',
            },
            {
              title: locale === 'ar' ? 'قيمنا' : 'Values',
              body:
                locale === 'ar'
                  ? 'النزاهة، الدمج، الابتكار، الخدمة، والتعاون الدولي.'
                  : 'Integrity, inclusion, innovation, service, and international collaboration.',
            },
          ].map((card) => (
            <article className="info-card" key={card.title}>
              <Sparkles size={24} />
              <h2>{card.title}</h2>
              <p>{card.body}</p>
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
            [locale === 'ar' ? 'التأسيس' : 'Foundation', locale === 'ar' ? 'انطلاق اللجنة المحلية داخل كلية طب بني سويف.' : 'The local committee begins inside Beni Suef Faculty of Medicine.'],
            [locale === 'ar' ? 'النمو' : 'Growth', locale === 'ar' ? 'توسع أنشطة اللجان وبرامج بناء القدرات.' : 'Committee activities and capacity-building programs expand.'],
            [locale === 'ar' ? 'اليوم' : 'Today', locale === 'ar' ? 'نموذج أكثر تنظيماً مع CMS ولوحة إدارة للمحتوى.' : 'A more structured model with CMS-backed content and admin workflows.'],
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

      <BoardSection locale={locale} content={content} />
    </main>
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
            ? 'كل لجنة لها لون وشخصية ومجال تأثير واضح داخل تجربة الطالب الطبية.'
            : 'Each committee has its own color, character, and contribution to the medical student experience.'
        }
      />
      <section className="site-section">
        <div className="site-container committee-detail-list">
          {content.committees.map((committee, index) => (
            <article
              className="committee-detail"
              id={committee.slug}
              key={committee.slug}
              style={{ '--accent': committee.color } as CSSProperties}
            >
              <div className="committee-logo-panel">
                <img src={committee.logo} alt={committee.name} />
              </div>
              <div>
                <span className="eyebrow">{committee.name}</span>
                <h2>{text(committee.fullName, locale)}</h2>
                <p>{text(committee.description, locale)}</p>
                <div className="program-grid">
                  {committee.programs.map((program) => (
                    <span key={text(program, locale)}>
                      <CheckCircle2 size={16} />
                      {text(program, locale)}
                    </span>
                  ))}
                </div>
                <Link className="button secondary" href={`${href(locale, '/join')}?committee=${committee.slug}`}>
                  {locale === 'ar' ? `انضم إلى ${committee.name}` : `Join ${committee.name}`}
                  <DirectionIcon locale={locale} />
                </Link>
              </div>
              <strong className="section-index">{String(index + 1).padStart(2, '0')}</strong>
            </article>
          ))}
        </div>
      </section>
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
            ? 'الأقسام التي تجعل العمل الطلابي أكثر تنظيماً واستدامة.'
            : 'The operational backbone that keeps student work organized and sustainable.'
        }
      />
      <section className="site-section">
        <div className="site-container division-grid">
          {content.divisions.map((division, i) => (
            <article className="division-card" key={division.slug} style={{ '--accent': division.color, animationDelay: `${i * 80}ms` } as CSSProperties}>
              <span className="division-bar" />
              <img src={division.logo} alt={division.name} />
              <h2>{division.name}</h2>
              <h3>{text(division.fullName, locale)}</h3>
              <p>{text(division.description, locale)}</p>
            </article>
          ))}
        </div>
      </section>
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
            ? 'يمكن تحديث هذه البطاقات من لوحة الإدارة وربطها بكل لجنة.'
            : 'These cards are CMS-ready and can be updated from the admin dashboard.'
        }
      />
      <section className="site-section">
        <div className="site-container">
          <ActivityGrid locale={locale} activities={content.activities} />
        </div>
      </section>
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
      lead: 'Browse available items and send an order request. The team confirms availability and price.',
      order: 'Order request',
      product: 'Product',
      size: 'Size',
      qty: 'Quantity',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      notes: 'Notes',
      submit: 'Send order',
    },
    ar: {
      badge: 'المتجر',
      title: 'متجر بمسا',
      lead: 'استعرض المنتجات المتاحة وأرسل طلبك، وسيؤكد الفريق التوفر والسعر.',
      order: 'طلب منتج',
      product: 'المنتج',
      size: 'المقاس',
      qty: 'الكمية',
      name: 'الاسم بالكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
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
              <article className="merch-card" key={item.slug}>
                <div className="merch-art" style={{ background: safeGradient(item.gradient) }}>
                  {item.imageUrl ? <img src={item.imageUrl} alt={text(item.name, locale)} /> : <IconFor name={item.icon} size={48} />}
                </div>
                <div>
                  <h2>{text(item.name, locale)}</h2>
                  <p>{text(item.description, locale)}</p>
                  <strong>{text(item.price, locale)}</strong>
                  {!item.inStock ? <span className="stock-pill">{locale === 'ar' ? 'غير متاح' : 'Out of stock'}</span> : null}
                </div>
              </article>
            ))}
          </div>

          <aside className="form-card">
            <h2>{labels.order}</h2>
            <Notice locale={locale} params={params} successKey="ordered" />
            <MerchOrderForm locale={locale} items={content.merchItems} labels={labels} />
          </aside>
        </div>
      </section>
    </main>
  );
}

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
      lead: 'Tell us where you want to contribute. Your application lands in the admin dashboard.',
      name: 'Full name',
      email: 'Email',
      phone: 'Phone',
      year: 'Academic year',
      committee: 'Committee preference',
      motivation: 'Why do you want to join?',
      submit: 'Submit application',
    },
    ar: {
      badge: 'انضم',
      title: 'انضم إلى بمسا',
      lead: 'اخبرنا أين تريد أن تساهم. سيصل طلبك مباشرة إلى لوحة الإدارة.',
      name: 'الاسم بالكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      year: 'الفرقة الدراسية',
      committee: 'اللجنة المفضلة',
      motivation: 'لماذا تريد الانضمام؟',
      submit: 'إرسال الطلب',
    },
  }[locale];

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
              ] as { icon: typeof GraduationCap; title: string; body: string }[]).map(({ icon: Icon, title, body }) => (
                <div className="join-value-card" key={title}>
                  <Icon size={20} />
                  <h4>{title}</h4>
                  <p>{body}</p>
                </div>
              ))}
            </div>
            <SectionHeader
              eyebrow={locale === 'ar' ? 'اختيار المسار' : 'Choose your path'}
              title={locale === 'ar' ? 'ابحث عن اللجنة الأقرب لك' : 'Find the committee that fits you'}
              lead={
                locale === 'ar'
                  ? 'راجع اللجان والأقسام قبل إرسال الطلب، واختر المساحة التي تناسب اهتمامك.'
                  : 'Review committees and divisions before applying, then choose the space that matches your interest.'
              }
            />
            <CommitteeGrid locale={locale} content={content} compact />
          </div>

          <aside className="form-card">
            <h2>{labels.title}</h2>
            <Notice locale={locale} params={params} successKey="submitted" />
            <form action={submitMembershipApplication}>
              <input type="hidden" name="locale" value={locale} />
              <label>
                {labels.name}
                <input name="name" required />
              </label>
              <label>
                {labels.email}
                <input name="email" type="email" required />
              </label>
              <label>
                {labels.phone}
                <input name="phone" required />
              </label>
              <label>
                {labels.year}
                <input name="faculty_year" required />
              </label>
              <label>
                {labels.committee}
                <select name="committee_preference" required>
                  <option value="">{labels.committee}</option>
                  {content.committees.map((committee) => (
                    <option key={committee.slug} value={committee.slug}>
                      {committee.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {labels.motivation}
                <textarea name="motivation" rows={5} required />
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

function CommitteeGrid({ locale, content, compact = false }: { locale: Locale; content: BmsaContent; compact?: boolean }) {
  return (
    <div className={compact ? 'committee-grid compact' : 'committee-grid'}>
      {content.committees.map((committee, i) => (
        <article
          className="committee-card"
          key={committee.slug}
          style={{ '--accent': committee.color, animationDelay: `${i * 80}ms` } as CSSProperties}
        >
          <span className="committee-abbr">{committee.name}</span>
          <img src={committee.logo} alt={committee.name} />
          <h3>{text(committee.fullName, locale)}</h3>
          <p>{text(committee.description, locale)}</p>
          <Link href={`${href(locale, '/committees')}#${committee.slug}`}>
            {locale === 'ar' ? 'استكشف' : 'Explore'}
            <DirectionIcon locale={locale} />
          </Link>
        </article>
      ))}
    </div>
  );
}

function ActivityGrid({ locale, activities }: { locale: Locale; activities: BmsaContent['activities'] }) {
  return (
    <div className="activity-grid">
      {activities.map((activity, i) => (
        <article className="activity-card" key={activity.slug} style={{ animationDelay: `${i * 90}ms` } as CSSProperties}>
          <div className="activity-thumb">
            {activity.imageUrl ? <img src={activity.imageUrl} alt={text(activity.title, locale)} /> : <IconFor name={activity.icon} size={42} />}
          </div>
          <div className="activity-body">
            <span className="activity-tag">{text(activity.tag, locale)}</span>
            <h3>{text(activity.title, locale)}</h3>
            <p>{text(activity.excerpt, locale)}</p>
            <Link className="card-cta" href={href(locale, '/activities')}>
              {locale === 'ar' ? 'استعرض' : 'View Details'}
              <DirectionIcon locale={locale} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function BoardSection({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const eb = content.boardMembers.filter((member) => member.tier === 'eb');
  const to = content.boardMembers.filter((member) => member.tier === 'to');

  return (
    <section className="site-section">
      <div className="site-container">
        <SectionHeader
          eyebrow={locale === 'ar' ? 'الفريق' : 'Team'}
          title={locale === 'ar' ? 'المجلس التنفيذي والمسؤولون التقنيون' : 'Executive Board and Technical Officers'}
          lead={
            locale === 'ar'
              ? 'الأسماء والصور قابلة للتحديث من لوحة الإدارة كل عام.'
              : 'Names and photos can be updated from the admin dashboard each year.'
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
            title={locale === 'ar' ? 'المسؤولون التقنيون' : 'Technical Officers'}
            icon={GraduationCap}
            members={to}
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
  return (
    <div className="board-tier">
      <h3>
        <Icon size={20} />
        {title}
      </h3>
      <div className="board-grid">
        {members.map((member) => (
          <article className="board-card" key={`${member.tier}-${member.sortOrder}`}>
            <div className="avatar" style={{ background: safeGradient(member.gradient) }}>
              {member.imageUrl ? <img src={member.imageUrl} alt={text(member.memberName, locale)} /> : <IconFor name={member.icon} size={30} />}
            </div>
            <h4>{text(member.positionTitle, locale)}</h4>
            <span>{text(member.role, locale)}</span>
            <strong>{text(member.memberName, locale)}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
