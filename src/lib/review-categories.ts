import type { ExchangeReview, LocalizedText, ReviewCategory } from './types';

export const reviewCategories: { key: ReviewCategory; label: LocalizedText }[] = [
  { key: 'overall', label: { en: 'Overall', ar: 'التقييم العام' } },
  { key: 'hosting', label: { en: 'Hospital / lab', ar: 'المستشفى / المعمل' } },
  { key: 'accommodation', label: { en: 'Accommodation', ar: 'السكن' } },
  { key: 'budget', label: { en: 'Value for money', ar: 'التكلفة' } },
  { key: 'transport', label: { en: 'Transport', ar: 'المواصلات' } },
  { key: 'social', label: { en: 'Social life', ar: 'الحياة الاجتماعية' } },
];

export type ReviewSummary = {
  count: number;
  averages: Record<ReviewCategory, number>;
  reviews: ExchangeReview[];
};

/** Groups published reviews by destination slug and averages each category. */
export function summarizeReviews(reviews: ExchangeReview[]) {
  const bySlug = new Map<string, ExchangeReview[]>();
  for (const review of reviews) {
    if (!review.destinationSlug) continue;
    bySlug.set(review.destinationSlug, [...(bySlug.get(review.destinationSlug) || []), review]);
  }
  const summaries = new Map<string, ReviewSummary>();
  for (const [slug, list] of bySlug) {
    const averages = Object.fromEntries(
      reviewCategories.map(({ key }) => [key, list.reduce((sum, review) => sum + review.ratings[key], 0) / list.length]),
    ) as Record<ReviewCategory, number>;
    summaries.set(slug, { count: list.length, averages, reviews: list });
  }
  return summaries;
}
