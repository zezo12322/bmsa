import SiteShell from '@/components/site/SiteShell';
import { NewsPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'news');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="news">
      <NewsPage locale="en" content={content} />
    </SiteShell>
  );
}
