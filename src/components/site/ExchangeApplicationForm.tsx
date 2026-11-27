'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitExchangeApplication, type ExchangeApplicationState } from '@/app/actions';
import { currentCallState } from '@/lib/exchange-calls';
import type { ExchangeCall, ExchangeDestination, Locale } from '@/lib/types';
import { text } from '@/lib/types';
import Flag from '@/components/site/Flag';

const MAX_DESTINATIONS = 3;

const academicYears = {
  en: ['1st year', '2nd year', '3rd year', '4th year', '5th year', '6th year', 'Intern'],
  ar: ['الفرقة الأولى', 'الفرقة الثانية', 'الفرقة الثالثة', 'الفرقة الرابعة', 'الفرقة الخامسة', 'الفرقة السادسة', 'امتياز'],
};

const copy = {
  en: {
    title: 'Exchange pre-application',
    openFor: 'Applying for:',
    interest:
      'No call is open right now. Send this form to register your interest and we will contact you when applications open.',
    name: 'Full name',
    email: 'Email',
    phone: 'Phone (WhatsApp)',
    year: 'Academic year',
    chooseYear: 'Choose your year',
    membership: 'BMSA membership',
    chooseMembership: 'Choose one',
    memberships: [
      ['active', 'Active member'],
      ['new', 'New member (this year)'],
      ['not-yet', 'Not a member yet'],
    ],
    program: 'Program',
    programs: [
      ['scope', 'SCOPE — Clinical exchange'],
      ['score', 'SCORE — Research exchange'],
      ['either', 'Either — I am open to both'],
    ],
    destinations: `Preferred destinations (up to ${MAX_DESTINATIONS})`,
    period: 'Preferred period',
    periodHint: 'e.g. July or August',
    languages: 'Languages you speak',
    languagesHint: 'e.g. Arabic, English (IELTS 7), basic German',
    motivation: 'Why do you want to go on exchange?',
    motivationHint: 'A few sentences about your goals and what you want to learn.',
    consent: 'I agree that BMSA Benisuef may contact me about the exchange program using these details.',
    submit: 'Send pre-application',
    sending: 'Sending…',
    successTitle: 'Your pre-application was received',
    successBody: 'The SCOPE/SCORE team will review it and contact you about the next steps.',
    successCall: 'Linked to:',
    another: 'Send another response',
    errors: {
      cms: 'Online submissions are temporarily unavailable. Please email us instead.',
      invalid: 'Please fill in all required fields with a valid email and accept the consent.',
      submit: 'Something went wrong. Please try again in a moment.',
    },
  },
  ar: {
    title: 'التقديم المبدئي للتبادل',
    openFor: 'التقديم على:',
    interest: 'مفيش تقديم مفتوح دلوقتي. ابعت الفورم ده عشان تسجّل اهتمامك، وهنتواصل معاك أول ما التقديم يفتح.',
    name: 'الاسم بالكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف (واتساب)',
    year: 'الفرقة الدراسية',
    chooseYear: 'اختر الفرقة',
    membership: 'العضوية في بمسا',
    chooseMembership: 'اختر',
    memberships: [
      ['active', 'عضو نشط'],
      ['new', 'عضو جديد (السنة دي)'],
      ['not-yet', 'لسه مش عضو'],
    ],
    program: 'البرنامج',
    programs: [
      ['scope', 'SCOPE — تبادل إكلينيكي'],
      ['score', 'SCORE — تبادل بحثي'],
      ['either', 'أي منهم — مهتم بالاتنين'],
    ],
    destinations: `الوجهات المفضلة (لحد ${MAX_DESTINATIONS})`,
    period: 'الفترة المفضلة',
    periodHint: 'مثلاً يوليو أو أغسطس',
    languages: 'اللغات اللي بتتكلمها',
    languagesHint: 'مثلاً العربية، الإنجليزية (IELTS 7)، أساسيات الألمانية',
    motivation: 'ليه عايز تسافر تبادل؟',
    motivationHint: 'بضع جمل عن أهدافك وعايز تتعلم إيه.',
    consent: 'أوافق إن بمسا بني سويف تتواصل معايا بخصوص برنامج التبادل باستخدام البيانات دي.',
    submit: 'إرسال التقديم المبدئي',
    sending: 'جاري الإرسال…',
    successTitle: 'وصلنا تقديمك المبدئي',
    successBody: 'فريق SCOPE/SCORE هيراجعه ويتواصل معاك بخصوص الخطوات الجاية.',
    successCall: 'مرتبط بـ:',
    another: 'إرسال رد آخر',
    errors: {
      cms: 'الإرسال الإلكتروني غير متاح مؤقتاً. راسلنا على الإيميل.',
      invalid: 'املأ كل الخانات المطلوبة بإيميل صحيح ووافق على التواصل.',
      submit: 'حدث خطأ. حاول مرة أخرى بعد قليل.',
    },
  },
};

const initialState: ExchangeApplicationState = { status: 'idle' };

export default function ExchangeApplicationForm({
  locale,
  calls,
  destinations,
}: {
  locale: Locale;
  calls: ExchangeCall[];
  destinations: ExchangeDestination[];
}) {
  const t = copy[locale];
  const [state, formAction, pending] = useActionState(submitExchangeApplication, initialState);
  const [picked, setPicked] = useState<string[]>([]);
  // The success message hides once dismissed; a new submission produces a new state object and shows it again.
  const [dismissed, setDismissed] = useState<ExchangeApplicationState | null>(null);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const available = destinations.filter((destination) => !destination.soldOut);
  const callState = now === null ? null : currentCallState(calls, now);
  const openCall = callState?.status === 'open' ? callState.call : null;

  function toggle(slug: string, checked: boolean) {
    setPicked((current) => (checked ? [...current, slug].slice(0, MAX_DESTINATIONS) : current.filter((item) => item !== slug)));
  }

  if (state.status === 'success' && state !== dismissed) {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h3>{t.successTitle}</h3>
        <p>{t.successBody}</p>
        {state.callTitle ? (
          <p>
            <strong>{t.successCall}</strong> {state.callTitle[locale]}
          </p>
        ) : null}
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setPicked([]);
            setDismissed(state);
          }}
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        // Submit manually so the browser keeps what was typed if the server rejects it
        // (a plain `action` prop makes React reset the form after every submission).
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {now !== null ? (
        <p className={openCall ? 'form-callout open' : 'form-callout'}>
          {openCall ? (
            <>
              <strong>{t.openFor}</strong> {text(openCall.title, locale)}
            </>
          ) : (
            t.interest
          )}
        </p>
      ) : null}

      {state.status === 'error' && state.error ? (
        <div className="form-notice error" role="alert">
          {t.errors[state.error]}
        </div>
      ) : null}

      <div className="form-row">
        <label>
          {t.name}
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          {t.phone}
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required maxLength={40} />
        </label>
      </div>
      <label>
        {t.email}
        <input name="email" type="email" autoComplete="email" dir="ltr" required maxLength={160} />
      </label>
      <div className="form-row">
        <label>
          {t.year}
          <select name="faculty_year" required defaultValue="">
            <option value="" disabled>
              {t.chooseYear}
            </option>
            {academicYears[locale].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t.membership}
          <select name="membership_status" required defaultValue="">
            <option value="" disabled>
              {t.chooseMembership}
            </option>
            {t.memberships.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="radio-group">
        <legend>{t.program}</legend>
        {t.programs.map(([value, label]) => (
          <label key={value}>
            <input type="radio" name="program" value={value} required defaultChecked={value === 'either'} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>

      {available.length ? (
        <fieldset className="destination-picker">
          <legend>
            {t.destinations} <span className="picked-count">{picked.length}/{MAX_DESTINATIONS}</span>
          </legend>
          <div>
            {available.map((destination) => {
              const checked = picked.includes(destination.slug);
              return (
                <label key={destination.slug} className={checked ? 'checked' : undefined}>
                  <input
                    type="checkbox"
                    name="preferred_destinations"
                    value={text(destination.country, 'en')}
                    checked={checked}
                    disabled={!checked && picked.length >= MAX_DESTINATIONS}
                    onChange={(event) => toggle(destination.slug, event.target.checked)}
                  />
                  <span aria-hidden="true"><Flag emoji={destination.flag} /></span>
                  {text(destination.country, locale)}
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="form-row">
        <label>
          {t.period}
          <input name="preferred_period" placeholder={t.periodHint} maxLength={120} />
        </label>
        <label>
          {t.languages}
          <input name="languages" placeholder={t.languagesHint} maxLength={200} />
        </label>
      </div>
      <label>
        {t.motivation}
        <textarea name="motivation" rows={5} required placeholder={t.motivationHint} maxLength={3000} />
      </label>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>{t.consent}</span>
      </label>
      <button className="button primary full" type="submit" disabled={pending}>
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}
