import SiteShell from '@/components/site/SiteShell';
import { NewsPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'news');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="news">
      <NewsPage locale="ar" content={content} />
    </SiteShell>
  );
}
