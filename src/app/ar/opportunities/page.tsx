import SiteShell from '@/components/site/SiteShell';
import { OpportunitiesPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'opportunities');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="opportunities">
      <OpportunitiesPage locale="ar" content={content} />
    </SiteShell>
  );
}
