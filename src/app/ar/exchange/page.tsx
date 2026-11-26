import SiteShell from '@/components/site/SiteShell';
import ExchangePage from '@/components/site/ExchangePage';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'exchange');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="exchange">
      <ExchangePage locale="ar" content={content} />
    </SiteShell>
  );
}
