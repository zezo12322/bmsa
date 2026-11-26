import SiteShell from '@/components/site/SiteShell';
import { DivisionsPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'divisions');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="divisions">
      <DivisionsPage locale="ar" content={content} />
    </SiteShell>
  );
}
