import SiteShell from '@/components/site/SiteShell';
import { CommitteesPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'committees');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="committees">
      <CommitteesPage locale="ar" content={content} />
    </SiteShell>
  );
}
