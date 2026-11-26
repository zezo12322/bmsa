import SiteShell from '@/components/site/SiteShell';
import { ActivitiesPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'activities');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="activities">
      <ActivitiesPage locale="ar" content={content} />
    </SiteShell>
  );
}
