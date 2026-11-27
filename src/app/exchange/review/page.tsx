import type { Metadata } from 'next';
import SiteShell from '@/components/site/SiteShell';
import { ExchangeReviewPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Rate your exchange',
  description: 'Back from a SCOPE or SCORE exchange? Rate your destination for the next BMSA Benisuef students.',
  alternates: { canonical: '/exchange/review', languages: { en: '/exchange/review', ar: '/ar/exchange/review' } },
};

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="exchange" path="/exchange/review">
      <ExchangeReviewPage locale="en" content={content} />
    </SiteShell>
  );
}
