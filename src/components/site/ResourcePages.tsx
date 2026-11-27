import { BadgeCheck, FileText, SearchX } from 'lucide-react';
import { PageHero } from '@/components/site/Pages';
import OpportunityList from '@/components/site/OpportunityList';
import ExchangeReviewForm from '@/components/site/ExchangeReviewForm';
import type { BmsaContent, DocumentCategory, Locale, LocalizedText } from '@/lib/types';
import { text } from '@/lib/types';

const say = (locale: Locale, en: string, ar: string) => (locale === 'ar' ? ar : en);

export function OpportunitiesPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={say(locale, 'Opportunities', 'الفرص')}
        title={say(locale, 'Open calls', 'الفرص المفتوحة')}
        lead={say(
          locale,
          'Organizing committees, team recruitment, delegations and more. Each call closes by itself at its deadline.',
          'لجان منظمة، انضمام للتيمات، وفود، وغيرها. كل فرصة بتتقفل لوحدها في آخر موعد ليها.',
        )}
      />
      <section className="site-section">
        <div className="site-container">
          {content.opportunities.length ? (
            <OpportunityList locale={locale} items={content.opportunities} />
          ) : (
            <p className="empty-state">
              {say(
                locale,
                'No calls are open right now. Check back soon or follow our Facebook page.',
                'مفيش فرص مفتوحة دلوقتي. ارجع تاني قريب أو تابع صفحتنا على فيسبوك.',
              )}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

const documentCategories: { key: DocumentCategory; label: LocalizedText }[] = [
  { key: 'bylaws', label: { en: 'Bylaws & regulations', ar: 'اللائحة والقواعد' } },
  { key: 'reports', label: { en: 'Reports', ar: 'التقارير' } },
  { key: 'manuals', label: { en: 'Manuals & guides', ar: 'الأدلة' } },
  { key: 'forms', label: { en: 'Forms', ar: 'النماذج' } },
  { key: 'other', label: { en: 'Other', ar: 'أخرى' } },
];

export function DocumentsPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const groups = documentCategories
    .map((category) => ({
      ...category,
      items: content.documents
        .filter((doc) => doc.category === category.key)
        .sort((a, b) => (b.year || 0) - (a.year || 0)),
    }))
    .filter((group) => group.items.length);

  return (
    <main>
      <PageHero
        locale={locale}
        badge={say(locale, 'Documents', 'الوثائق')}
        title={say(locale, 'Documents library', 'مكتبة الملفات')}
        lead={say(
          locale,
          'Bylaws, reports, manuals, and forms of BMSA Benisuef in one place.',
          'اللائحة والتقارير والأدلة والنماذج الخاصة ببمسا بني سويف في مكان واحد.',
        )}
      />
      <section className="site-section">
        <div className="site-container document-groups">
          {groups.length ? (
            groups.map((group) => (
              <section key={group.key}>
                <h2>{text(group.label, locale)}</h2>
                <ul className="document-list">
                  {group.items.map((doc) => (
                    <li key={doc.id}>
                      <FileText size={22} aria-hidden="true" />
                      <div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                          {text(doc.title, locale)}
                        </a>
                        {doc.year ? <span className="document-year">{doc.year}</span> : null}
                        {text(doc.description, locale) ? <p>{text(doc.description, locale)}</p> : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="empty-state">{say(locale, 'Documents will be added soon.', 'الملفات هتتضاف قريب.')}</p>
          )}
        </div>
      </section>
    </main>
  );
}

export type CertificateResult = {
  holder_name_en: string;
  holder_name_ar: string | null;
  title_en: string;
  title_ar: string | null;
  role_en: string | null;
  role_ar: string | null;
  issued_on: string | null;
};

export function VerifyPage({
  locale,
  code,
  result,
  unavailable,
}: {
  locale: Locale;
  code: string;
  result: CertificateResult | null;
  unavailable?: boolean;
}) {
  const pick = (en: string | null, ar: string | null) => (locale === 'ar' ? ar || en : en || ar) || '';
  const issued = result?.issued_on
    ? new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
        new Date(`${result.issued_on}T00:00:00Z`),
      )
    : '';

  return (
    <main>
      <PageHero
        locale={locale}
        badge={say(locale, 'Verification', 'التحقق')}
        title={say(locale, 'Verify a certificate', 'التحقق من شهادة')}
        lead={say(
          locale,
          'Enter the code printed on a BMSA Benisuef certificate to check that it is genuine.',
          'اكتب الكود المطبوع على شهادة بمسا بني سويف عشان تتأكد إنها حقيقية.',
        )}
      />
      <section className="site-section">
        <div className="site-container verify-layout">
          <form className="form-card verify-form" method="get">
            <label>
              {say(locale, 'Certificate code', 'كود الشهادة')}
              <input name="code" defaultValue={code} required maxLength={64} dir="ltr" autoComplete="off" placeholder="BMSA-26-XXXXXX" />
            </label>
            <button className="button primary" type="submit">
              {say(locale, 'Verify', 'تحقق')}
            </button>
          </form>

          {unavailable ? (
            <p className="form-notice error" role="alert">
              {say(locale, 'Verification is temporarily unavailable. Please try again later.', 'التحقق مش متاح دلوقتي. جرّب تاني بعد شوية.')}
            </p>
          ) : result ? (
            <div className="verify-result found" role="status">
              <BadgeCheck size={36} aria-hidden="true" />
              <div>
                <strong>{say(locale, 'Valid certificate', 'شهادة صحيحة')}</strong>
                <dl>
                  <dt>{say(locale, 'Name', 'الاسم')}</dt>
                  <dd>{pick(result.holder_name_en, result.holder_name_ar)}</dd>
                  <dt>{say(locale, 'Activity', 'النشاط')}</dt>
                  <dd>{pick(result.title_en, result.title_ar)}</dd>
                  {pick(result.role_en, result.role_ar) ? (
                    <>
                      <dt>{say(locale, 'Role', 'الدور')}</dt>
                      <dd>{pick(result.role_en, result.role_ar)}</dd>
                    </>
                  ) : null}
                  {issued ? (
                    <>
                      <dt>{say(locale, 'Issued on', 'تاريخ الإصدار')}</dt>
                      <dd>{issued}</dd>
                    </>
                  ) : null}
                </dl>
              </div>
            </div>
          ) : code ? (
            <div className="verify-result missing" role="status">
              <SearchX size={36} aria-hidden="true" />
              <div>
                <strong>{say(locale, 'No certificate found with this code', 'مفيش شهادة بالكود ده')}</strong>
                <p>
                  {say(
                    locale,
                    'Check the code and try again. If you think this is a mistake, contact us.',
                    'راجع الكود وجرّب تاني. لو شايف إن فيه غلط، كلّمنا.',
                  )}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

/** IFMSA terms, checked against ifmsa.org (FAQ and exchange pages). Committees and divisions come from the site data. */
const glossaryTerms: { term: string; en: string; ar: string }[] = [
  { term: 'IFMSA', en: "International Federation of Medical Students' Associations.", ar: 'الاتحاد الدولي لجمعيات طلاب الطب.' },
  { term: 'NMO', en: 'National Member Organization: a country’s association in IFMSA. Ours is IFMSA-Egypt.', ar: 'المنظمة الوطنية العضو في IFMSA. في مصر هي IFMSA-Egypt.' },
  { term: 'LC', en: 'Local Committee: the association at one faculty. BMSA Benisuef is IFMSA-Egypt’s LC at Beni Suef.', ar: 'اللجنة المحلية في كلية واحدة. بمسا بني سويف هي اللجنة المحلية لـ IFMSA-Egypt في بني سويف.' },
  { term: 'EB', en: 'Executive Board: the elected leadership of the LC.', ar: 'المجلس التنفيذي: القيادة المنتخبة للجنة المحلية.' },
  { term: 'TO', en: 'Team of Officials: the officers who run each committee and division.', ar: 'فريق المسؤولين اللي بيديروا كل لجنة وقسم.' },
  { term: 'OC', en: 'Organizing Committee: the team that runs a specific event or project.', ar: 'اللجنة المنظمة لحدث أو مشروع معين.' },
  { term: 'GA', en: 'General Assembly: IFMSA’s main meetings, held twice a year (March Meeting and August Meeting).', ar: 'الجمعية العامة: اجتماعات IFMSA الرئيسية، مرتين في السنة (March Meeting وAugust Meeting).' },
  { term: 'EMR', en: 'Eastern Mediterranean Region: the IFMSA region Egypt belongs to.', ar: 'إقليم شرق المتوسط: الإقليم اللي مصر تبعه في IFMSA.' },
  { term: 'LEO', en: 'Local Exchange Officer: in charge of professional exchanges (SCOPE) in the LC.', ar: 'مسؤول التبادل المحلي: مسؤول عن التبادل الإكلينيكي (SCOPE) في اللجنة المحلية.' },
  { term: 'NEO', en: 'National Exchange Officer: in charge of professional exchanges (SCOPE) in the country.', ar: 'مسؤول التبادل الوطني: مسؤول عن التبادل الإكلينيكي (SCOPE) على مستوى الدولة.' },
  { term: 'LORE', en: 'Local Officer on Research Exchange: in charge of research exchanges (SCORE) in the LC.', ar: 'مسؤول التبادل البحثي المحلي (SCORE) في اللجنة المحلية.' },
  { term: 'NORE', en: 'National Officer on Research Exchange: in charge of research exchanges (SCORE) in the country.', ar: 'مسؤول التبادل البحثي الوطني (SCORE) على مستوى الدولة.' },
  { term: 'Sending / Hosting NMO', en: 'The sending NMO selects its outgoing students; the hosting NMO organizes the clerkship and hosts them.', ar: 'الـ NMO المُرسِلة بتختار الطلبة المسافرين، والـ NMO المستضيفة بتنظم التدريب وبتستقبلهم.' },
  { term: 'AF', en: 'Application Form: your exchange application in the IFMSA exchange database.', ar: 'استمارة التقديم على التبادل في قاعدة بيانات IFMSA.' },
  { term: 'CA', en: 'Card of Acceptance: sent to you after the hosting NMO accepts you.', ar: 'كارت القبول: بيوصلك بعد ما الـ NMO المستضيفة تقبلك.' },
  { term: 'CC', en: 'Card of Confirmation: you send it to the hosting NMO to confirm your exchange.', ar: 'كارت التأكيد: بتبعته للـ NMO المستضيفة عشان تأكد التبادل.' },
  { term: 'IL', en: 'Invitation Letter from the hosting side.', ar: 'خطاب الدعوة من الجهة المستضيفة.' },
  { term: 'PDT', en: 'Pre-Departure Training: preparation before travelling (ethics, culture shock, working within your skills).', ar: 'تدريب ما قبل السفر: تجهيز قبل التبادل (الأخلاقيات، الصدمة الثقافية، والشغل في حدود مهاراتك).' },
  { term: 'SDGs', en: 'Sustainable Development Goals: the 17 UN goals many IFMSA projects align with.', ar: 'أهداف التنمية المستدامة: الـ 17 هدف بتوع الأمم المتحدة اللي مشاريع كتير في IFMSA بتمشي عليها.' },
];

export function GlossaryPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  const units = [...content.committees, ...content.divisions].map((unit) => ({
    term: unit.name,
    meaning: text(unit.fullName, locale),
  }));
  const terms = [...glossaryTerms.map((item) => ({ term: item.term, meaning: locale === 'ar' ? item.ar : item.en })), ...units].sort((a, b) =>
    a.term.localeCompare(b.term, 'en'),
  );

  return (
    <main>
      <PageHero
        locale={locale}
        badge={say(locale, 'Glossary', 'القاموس')}
        title={say(locale, 'Abbreviations, explained', 'الاختصارات ومعناها')}
        lead={say(
          locale,
          'New to BMSA? These are the abbreviations you will hear in IFMSA, our committees, and the exchange program.',
          'لسه جديد في بمسا؟ دي الاختصارات اللي هتسمعها في IFMSA واللجان وبرنامج التبادل.',
        )}
      />
      <section className="site-section">
        <div className="site-container">
          <dl className="glossary-list">
            {terms.map((item) => (
              <div key={item.term}>
                <dt dir="ltr">{item.term}</dt>
                <dd>{item.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}

export function ExchangeReviewPage({ locale, content }: { locale: Locale; content: BmsaContent }) {
  return (
    <main>
      <PageHero
        locale={locale}
        badge={say(locale, 'Exchange', 'التبادل')}
        title={say(locale, 'Rate your exchange', 'قيّم تجربة التبادل')}
        lead={say(
          locale,
          'Back from SCOPE or SCORE? Rate your destination so the next students know what to expect. Reviews are read by the team before they appear.',
          'رجعت من SCOPE أو SCORE؟ قيّم الدولة اللي سافرتها عشان اللي بعدك يعرفوا يتوقعوا إيه. الفريق بيقرا التقييمات قبل ما تظهر.',
        )}
      />
      <section className="site-section">
        <div className="site-container">
          <div className="form-card review-card">
            <ExchangeReviewForm locale={locale} destinations={content.exchangeDestinations} />
          </div>
        </div>
      </section>
    </main>
  );
}
