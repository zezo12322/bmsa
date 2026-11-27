import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import { ExchangeReviewPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'قيّم تجربة التبادل',
  description: 'رجعت من تبادل SCOPE أو SCORE؟ قيّم الدولة اللي سافرتها لطلبة بمسا بني سويف اللي جايين.',
  alternates: { canonical: '/ar/exchange/review', languages: { en: '/exchange/review', ar: '/ar/exchange/review' } },
};

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="exchange" path="/exchange/review">
      <ExchangeReviewPage locale="ar" content={content} />
    </SiteShell>
  );
}
