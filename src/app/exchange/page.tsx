import SiteShell from '@/components/site/SiteShell';
import ExchangePage from '@/components/site/ExchangePage';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'exchange');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="exchange">
      <ExchangePage locale="en" content={content} />
    </SiteShell>
  );
}
