import SiteShell from '@/components/site/SiteShell';
import { CommitteesPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="committees">
      <CommitteesPage locale="en" content={content} />
    </SiteShell>
  );
}
