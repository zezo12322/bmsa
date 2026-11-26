/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Globe2,
  Handshake,
  Mail,
  MessageSquareQuote,
  Plane,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import ExchangeDestinations, { ProgramBadge } from '@/components/site/ExchangeDestinations';
import { CtaBand, DirectionIcon, PageHero, SectionHeader } from '@/components/site/Pages';
import { siteCopy } from '@/lib/bmsa-data';
import { localizePath } from '@/lib/routes';
import type { BmsaContent, ExchangeStory, Locale } from '@/lib/types';
import { text } from '@/lib/types';

type Bi = { en: string; ar: string };

const programs: {
  slug: 'scope' | 'score';
  title: Bi;
  summary: Bi;
  points: Bi[];
}[] = [
  {
    slug: 'scope',
    title: { en: 'Clinical exchange', ar: 'التبادل الإكلينيكي' },
    summary: {
      en: 'Spend a clerkship, usually four weeks, in a hospital department abroad and see how medicine is practised in another healthcare system.',
      ar: 'اقضِ فترة تدريب، غالباً أربعة أسابيع، في قسم بمستشفى بالخارج، وشوف ممارسة الطب في نظام صحي مختلف.',
    },
    points: [
      { en: 'Hands-on time in a clinical department', ar: 'تدريب عملي داخل قسم إكلينيكي' },
      { en: 'A tutor supervises you at the host hospital', ar: 'مشرف يتابعك في المستشفى المستضيف' },
      { en: 'A social program with students from many countries', ar: 'برنامج اجتماعي مع طلاب من دول كثيرة' },
    ],
  },
  {
    slug: 'score',
    title: { en: 'Research exchange', ar: 'التبادل البحثي' },
    summary: {
      en: 'Join a research project, usually for four weeks, in a lab or research group abroad and learn real research methods from a supervisor.',
      ar: 'شارك في مشروع بحثي، غالباً لمدة أربعة أسابيع، في معمل أو مجموعة بحثية بالخارج، واتعلم منهجية البحث من مشرف حقيقي.',
    },
    points: [
      { en: 'Basic science or clinical research projects', ar: 'مشاريع بحث أساسي أو إكلينيكي' },
      { en: 'Work alongside a research supervisor', ar: 'شغل جنب مشرف بحثي' },
      { en: 'Build skills for your own publications', ar: 'مهارات تساعدك في أبحاثك ونشرها' },
    ],
  },
];

const steps: { icon: LucideIcon; title: Bi; body: Bi }[] = [
  {
    icon: UsersRound,
    title: { en: 'Join SCOPE or SCORE', ar: 'انضم لـ SCOPE أو SCORE' },
    body: {
      en: 'Become a member and attend the info session to understand the program and its requirements.',
      ar: 'اشترك كعضو واحضر جلسة التعريف عشان تفهم البرنامج وشروطه.',
    },
  },
  {
    icon: FileText,
    title: { en: 'Apply when the call opens', ar: 'قدّم لما التقديم يفتح' },
    body: {
      en: 'Applications open once per exchange cycle. Dates and eligibility are announced on our social media and here on the website.',
      ar: 'التقديم بيفتح مرة كل دورة تبادل، والمواعيد والشروط بتتعلن على صفحاتنا وعلى الموقع ده.',
    },
  },
  {
    icon: Globe2,
    title: { en: 'Get matched to a destination', ar: 'تتوزّع على وجهة' },
    body: {
      en: 'Places are allocated according to the selection criteria, then the host confirms your acceptance.',
      ar: 'الأماكن بتتوزع حسب معايير الاختيار، وبعدها الجهة المستضيفة بتأكد قبولك.',
    },
  },
  {
    icon: ClipboardCheck,
    title: { en: 'Prepare to travel', ar: 'جهّز للسفر' },
    body: {
      en: 'Visa, insurance, documents, and a pre-departure session — the officers guide you through each step.',
      ar: 'التأشيرة، التأمين، الأوراق، وجلسة ما قبل السفر — والمسؤولين معاك في كل خطوة.',
    },
  },
  {
    icon: Plane,
    title: { en: 'Go, learn, and share', ar: 'سافر، اتعلم، وشارك' },
    body: {
      en: 'Complete your exchange, then come back and share your story to inspire the next group.',
      ar: 'خلّص فترة التبادل، وارجع شارك تجربتك عشان تلهم الدفعة اللي بعدك.',
    },
  },
];

const faqs: { q: Bi; a: Bi }[] = [
  {
    q: { en: 'Who can apply?', ar: 'مين يقدر يقدّم؟' },
    a: {
      en: 'BMSA Benisuef members. Eligibility (academic year, membership activity, and language level) is announced with each application call, so check the call before applying.',
      ar: 'أعضاء بمسا بني سويف. الشروط (الفرقة الدراسية، نشاط العضوية، ومستوى اللغة) بتتعلن مع كل دعوة تقديم، فراجعها قبل ما تقدّم.',
    },
  },
  {
    q: { en: 'What is the difference between SCOPE and SCORE?', ar: 'إيه الفرق بين SCOPE وSCORE؟' },
    a: {
      en: 'SCOPE exchanges are clinical: you join a hospital department. SCORE exchanges are research-based: you join a research project or lab.',
      ar: 'تبادل SCOPE إكلينيكي: بتنضم لقسم في مستشفى. تبادل SCORE بحثي: بتنضم لمشروع بحثي أو معمل.',
    },
  },
  {
    q: { en: 'How long does an exchange last?', ar: 'مدة التبادل قد إيه؟' },
    a: {
      en: 'Usually four weeks, often during the summer. The exact period depends on the destination and is confirmed after matching.',
      ar: 'غالباً أربعة أسابيع، وكتير بتكون في الصيف. المدة والموعد بالظبط بيعتمدوا على الوجهة وبيتأكدوا بعد التوزيع.',
    },
  },
  {
    q: { en: 'How much does it cost?', ar: 'التكلفة كام؟' },
    a: {
      en: 'You cover your travel, visa, insurance, and the program fee. Hosts usually arrange accommodation and some meals. The current fee and what is included are shared with each call.',
      ar: 'إنت بتتحمل الطيران، التأشيرة، التأمين، ورسوم البرنامج. الجهة المستضيفة غالباً بتوفر السكن وبعض الوجبات. الرسوم الحالية واللي بتشمله بتتعلن مع كل دعوة تقديم.',
    },
  },
  {
    q: { en: 'Do I need to speak the local language?', ar: 'لازم أتكلم لغة البلد؟' },
    a: {
      en: 'English is enough for many destinations. Some countries or departments ask for a level in the local language; this is listed per destination.',
      ar: 'الإنجليزية كفاية في وجهات كتير. بعض الدول أو الأقسام بتطلب مستوى في لغة البلد، وده بيكون مكتوب مع كل وجهة.',
    },
  },
  {
    q: { en: 'Who handles the visa?', ar: 'مين بيطلع التأشيرة؟' },
    a: {
      en: 'You apply for the visa yourself. We provide the acceptance documents and guidance on what embassies usually ask for. Start early.',
      ar: 'إنت اللي بتقدّم على التأشيرة. إحنا بنوفر أوراق القبول ونساعدك تعرف السفارات بتطلب إيه عادة. ابدأ بدري.',
    },
  },
  {
    q: { en: 'Will my faculty recognize the exchange?', ar: 'الكلية هتعترف بالتبادل؟' },
    a: {
      en: 'You receive a certificate from the host. Whether it counts toward your training depends on faculty regulations, so ask the faculty before you travel.',
      ar: 'بتاخد شهادة من الجهة المستضيفة. احتسابها في تدريبك بيعتمد على لوائح الكلية، فاسأل الكلية قبل السفر.',
    },
  },
  {
    q: { en: 'Can I host incoming students?', ar: 'أقدر أستضيف الطلاب الأجانب؟' },
    a: {
      en: 'Yes. Members can volunteer as contact persons who welcome incoming students, help them settle in Beni Suef, and join the social program.',
      ar: 'أكيد. الأعضاء يقدروا يتطوعوا كـ Contact Person يستقبلوا الطلاب الجايين، ويساعدوهم يستقروا في بني سويف، ويشاركوا في البرنامج الاجتماعي.',
    },
  },
];

function StoryCard({ story, locale }: { story: ExchangeStory; locale: Locale }) {
  const paragraphs = text(story.story, locale).split(/\n{2,}/).filter(Boolean);
  return (
    <article className="story-card">
      <div className="story-head">
        <div className="story-avatar" aria-hidden="true">
          {story.imageUrl ? <img src={story.imageUrl} alt="" loading="lazy" /> : <span>{story.flag}</span>}
        </div>
        <div>
          <strong>{text(story.studentName, locale)}</strong>
          <span>
            {[text(story.academicYear, locale), text(story.period, locale)].filter(Boolean).join(' · ')}
          </span>
        </div>
      </div>
      <blockquote>
        <MessageSquareQuote size={20} aria-hidden="true" />
        {text(story.quote, locale)}
      </blockquote>
      <div className="story-meta">
        <ProgramBadge program={story.program} locale={locale} />
        <span>
          {story.flag} {[text(story.host, locale), text(story.country, locale)].filter(Boolean).join(', ')}
        </span>
      </div>
      {paragraphs.length ? (
        <details>
          <summary>{locale === 'ar' ? 'اقرأ التجربة كاملة' : 'Read the full story'}</summary>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </details>
      ) : null}
    </article>
  );
}

export default function ExchangePage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const t = (value: Bi) => value[locale];
  const href = (path: string) => localizePath(locale, path);
  const email = siteCopy[locale].email;
  const committee = (slug: string) => content.committees.find((item) => item.slug === slug);

  return (
    <main>
      <PageHero
        locale={locale}
        badge={locale === 'ar' ? 'التبادل الدولي' : 'Exchange'}
        title={locale === 'ar' ? 'شوف العالم من خلال الطب' : 'See the world through medicine'}
        lead={
          locale === 'ar'
            ? 'من خلال SCOPE وSCORE وشبكة IFMSA، تقدر تتدرب في مستشفى أو معمل بحثي بالخارج، وتستضيف طلاب من كل العالم هنا في بني سويف.'
            : 'Through SCOPE, SCORE, and the IFMSA network, you can train in a hospital or research lab abroad — and host students from around the world here in Beni Suef.'
        }
      />

      <nav className="anchor-chips site-container" aria-label={locale === 'ar' ? 'أقسام الصفحة' : 'On this page'}>
        <a href="#programs">{locale === 'ar' ? 'البرامج' : 'Programs'}</a>
        <a href="#how">{locale === 'ar' ? 'خطوات التقديم' : 'How it works'}</a>
        <a href="#destinations">{locale === 'ar' ? 'الوجهات' : 'Destinations'}</a>
        <a href="#stories">{locale === 'ar' ? 'تجارب الطلاب' : 'Stories'}</a>
        <a href="#faq">{locale === 'ar' ? 'أسئلة شائعة' : 'FAQ'}</a>
      </nav>

      <section className="site-section tight-top" id="programs">
        <div className="site-container program-cards">
          {programs.map((program) => {
            const info = committee(program.slug);
            return (
              <article className="program-card" key={program.slug} style={{ '--accent': info?.color } as CSSProperties}>
                {info ? <img src={info.logo} alt={info.name} /> : null}
                <h2>{t(program.title)}</h2>
                <p>{t(program.summary)}</p>
                <ul className="check-list">
                  {program.points.map((point) => (
                    <li key={point.en}>
                      <CheckCircle2 size={19} />
                      <span>{t(point)}</span>
                    </li>
                  ))}
                </ul>
                <div className="committee-actions">
                  <Link className="button primary" href={`${href('/join')}?committee=${program.slug}#apply`}>
                    {locale === 'ar' ? `انضم إلى ${info?.name}` : `Join ${info?.name}`}
                    <DirectionIcon locale={locale} />
                  </Link>
                  <Link className="text-link" href={`${href('/committees')}#${program.slug}`}>
                    {locale === 'ar' ? 'عن اللجنة' : 'About the committee'}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="site-section alt" id="how">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'خطوات التقديم' : 'How it works'}
            title={locale === 'ar' ? 'من الفكرة لحد السفر' : 'From idea to departure'}
          />
          <ol className="exchange-steps">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title.en}>
                <span className="step-num">{i + 1}</span>
                <Icon size={22} aria-hidden="true" />
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-section" id="destinations">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'الوجهات' : 'Destinations'}
            title={locale === 'ar' ? 'رايح فين؟' : 'Where could you go?'}
            lead={
              locale === 'ar'
                ? 'أمثلة من الوجهات المتاحة. الأماكن والأعداد بتتغير كل دورة تبادل، والقائمة النهائية بتعلنها SCOPE وSCORE مع فتح التقديم.'
                : 'A sample of destinations. Places and numbers change every exchange cycle; SCOPE and SCORE announce the final list when applications open.'
            }
          />
          <ExchangeDestinations locale={locale} destinations={content.exchangeDestinations} />
        </div>
      </section>

      <section className="site-section alt" id="stories">
        <div className="site-container">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'تجارب الطلاب' : 'Exchange stories'}
            title={locale === 'ar' ? 'اسمع من اللي سافروا' : 'Hear from students who went'}
          />
          {content.exchangeStories.length ? (
            <div className="story-grid">
              {content.exchangeStories.map((story) => (
                <StoryCard key={story.slug} story={story} locale={locale} />
              ))}
            </div>
          ) : null}
          <div className="story-invite">
            <MessageSquareQuote size={28} aria-hidden="true" />
            <div>
              <h3>
                {content.exchangeStories.length
                  ? locale === 'ar'
                    ? 'سافرت مع بمسا؟ احكيلنا'
                    : 'Went on exchange with BMSA? Tell us'
                  : locale === 'ar'
                    ? 'التجارب الأولى جاية قريب'
                    : 'The first stories are on their way'}
              </h3>
              <p>
                {locale === 'ar'
                  ? 'لو سافرت تبادل من خلال بمسا، ابعتلنا تجربتك وصورة، وهننشرها هنا عشان تساعد اللي بعدك.'
                  : 'If you went on exchange through BMSA, send us your story and a photo, and we will publish it here to help the next group.'}
              </p>
            </div>
            <a
              className="button secondary"
              href={`mailto:${email}?subject=${encodeURIComponent(locale === 'ar' ? 'تجربة تبادل' : 'My exchange story')}`}
            >
              <Mail size={17} />
              {locale === 'ar' ? 'ابعت تجربتك' : 'Share your story'}
            </a>
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container incoming">
          <Handshake size={34} aria-hidden="true" />
          <div>
            <span className="eyebrow">{locale === 'ar' ? 'التبادل الوارد' : 'Incoming exchange'}</span>
            <h2>{locale === 'ar' ? 'استضيف العالم في بني سويف' : 'Host the world in Beni Suef'}</h2>
            <p>
              {locale === 'ar'
                ? 'كل سنة بييجي طلاب من دول مختلفة يتدربوا في بني سويف. اتطوع كـ Contact Person: استقبلهم، ساعدهم يستقروا، وشارك في البرنامج الاجتماعي — واعمل صحاب من كل العالم من غير ما تسافر.'
                : 'Students from different countries come to train in Beni Suef. Volunteer as a contact person: welcome them, help them settle in, and join the social program — and make friends worldwide without leaving home.'}
            </p>
          </div>
          <Link className="button secondary" href={`${href('/join')}?committee=scope#apply`}>
            {locale === 'ar' ? 'عايز أستضيف' : 'I want to host'}
            <DirectionIcon locale={locale} />
          </Link>
        </div>
      </section>

      <section className="site-section alt" id="faq">
        <div className="site-container faq-layout">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'أسئلة شائعة' : 'FAQ'}
            title={locale === 'ar' ? 'أسئلة بتتسأل كتير' : 'Questions we hear a lot'}
            lead={
              locale === 'ar'
                ? `سؤالك مش موجود؟ راسلنا على ${email}`
                : `Question not here? Email us at ${email}`
            }
          />
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.q.en}>
                <summary>{t(faq.q)}</summary>
                <p>{t(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </main>
  );
}
