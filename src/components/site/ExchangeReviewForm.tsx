'use client';

import { startTransition, useActionState, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { submitExchangeReview, type ExchangeReviewState } from '@/app/actions';
import { reviewCategories } from '@/lib/review-categories';
import type { ExchangeDestination, Locale } from '@/lib/types';
import { text } from '@/lib/types';

const copy = {
  en: {
    destination: 'Where did you go?',
    choose: 'Choose a country',
    other: 'Another country',
    otherCountry: 'Country',
    program: 'Program',
    period: 'When?',
    periodHint: 'e.g. August 2025',
    name: 'Your name (optional, shown with your review)',
    nameHint: 'Leave empty to stay anonymous',
    ratings: 'Rate each part from 1 (poor) to 5 (excellent)',
    pick: 'Rate',
    comment: 'Tips for the next student (optional)',
    commentHint: 'What should they know before going? Housing, costs, the department, what to pack...',
    consent: 'I agree that BMSA Benisuef may publish this review on its website.',
    submit: 'Send review',
    sending: 'Sending…',
    successTitle: 'Thank you! Your review was received',
    successBody: 'The team will read it and publish it on the destination card.',
    another: 'Send another review',
    errors: {
      cms: 'Online submissions are temporarily unavailable. Please try again later.',
      invalid: 'Please choose a country, rate every part, and accept the consent.',
      submit: 'Something went wrong. Please try again in a moment.',
    },
  },
  ar: {
    destination: 'سافرت فين؟',
    choose: 'اختار الدولة',
    other: 'دولة تانية',
    otherCountry: 'الدولة',
    program: 'البرنامج',
    period: 'إمتى؟',
    periodHint: 'مثلاً أغسطس 2025',
    name: 'اسمك (اختياري، هيظهر مع تقييمك)',
    nameHint: 'سيبه فاضي لو عايز تفضل مجهول',
    ratings: 'قيّم كل جزء من 1 (وحش) لـ 5 (ممتاز)',
    pick: 'قيّم',
    comment: 'نصايح للطالب اللي جاي (اختياري)',
    commentHint: 'إيه اللي لازم يعرفه قبل ما يسافر؟ السكن، التكاليف، القسم، ياخد إيه معاه...',
    consent: 'أوافق إن بمسا بني سويف تنشر التقييم ده على الموقع.',
    submit: 'ابعت التقييم',
    sending: 'جاري الإرسال…',
    successTitle: 'شكراً! وصلنا تقييمك',
    successBody: 'الفريق هيراجعه وينشره على كارت الدولة.',
    another: 'ابعت تقييم تاني',
    errors: {
      cms: 'الإرسال مش متاح دلوقتي. جرّب تاني بعد شوية.',
      invalid: 'اختار الدولة، قيّم كل الأجزاء، ووافق على النشر.',
      submit: 'حصل خطأ. جرّب تاني بعد شوية.',
    },
  },
};

const initialState: ExchangeReviewState = { status: 'idle' };

export default function ExchangeReviewForm({ locale, destinations }: { locale: Locale; destinations: ExchangeDestination[] }) {
  const t = copy[locale];
  const [state, formAction, pending] = useActionState(submitExchangeReview, initialState);
  const [destination, setDestination] = useState('');
  const [dismissed, setDismissed] = useState<ExchangeReviewState | null>(null);

  if (state.status === 'success' && state !== dismissed) {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={40} aria-hidden="true" />
        <h3>{t.successTitle}</h3>
        <p>{t.successBody}</p>
        <button
          type="button"
          className="button secondary"
          onClick={() => {
            setDestination('');
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
      className="review-form"
      onSubmit={(event) => {
        // Submit manually so what was typed survives a server-side rejection.
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      <div className="hp-field" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === 'error' && state.error ? (
        <div className="form-notice error" role="alert">
          {t.errors[state.error]}
        </div>
      ) : null}

      <div className="form-row">
        <label>
          {t.destination}
          <select name="destination" required value={destination} onChange={(event) => setDestination(event.target.value)}>
            <option value="" disabled>
              {t.choose}
            </option>
            {destinations.map((item) => (
              <option key={item.slug} value={item.slug}>
                {text(item.country, locale)}
              </option>
            ))}
            <option value="other">{t.other}</option>
          </select>
        </label>
        {destination === 'other' ? (
          <label>
            {t.otherCountry}
            <input name="country_other" required maxLength={80} />
          </label>
        ) : null}
      </div>

      <div className="form-row">
        <fieldset className="radio-group">
          <legend>{t.program}</legend>
          {(['scope', 'score'] as const).map((value) => (
            <label key={value}>
              <input type="radio" name="program" value={value} required defaultChecked={value === 'scope'} />
              <span>{value.toUpperCase()}</span>
            </label>
          ))}
        </fieldset>
        <label>
          {t.period}
          <input name="period" placeholder={t.periodHint} maxLength={60} />
        </label>
      </div>

      <fieldset className="rating-grid">
        <legend>{t.ratings}</legend>
        {reviewCategories.map((category) => (
          <label key={category.key}>
            {text(category.label, locale)}
            <select name={`rating_${category.key}`} required defaultValue="">
              <option value="" disabled>
                {t.pick}
              </option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {'★'.repeat(value)} {value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </fieldset>

      <label>
        {t.name}
        <input name="reviewer_name" maxLength={80} placeholder={t.nameHint} autoComplete="off" />
      </label>
      <label>
        {t.comment}
        <textarea name="comment" rows={5} maxLength={1500} placeholder={t.commentHint} />
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
