import SiteShell from '@/components/site/SiteShell';
import { OpportunitiesPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'opportunities');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="opportunities">
      <OpportunitiesPage locale="en" content={content} />
    </SiteShell>
  );
}
