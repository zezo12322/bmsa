import SiteShell from '@/components/site/SiteShell';
import { DocumentsPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'documents');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="documents">
      <DocumentsPage locale="en" content={content} />
    </SiteShell>
  );
}
