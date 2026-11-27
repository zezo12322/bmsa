import SiteShell from '@/components/site/SiteShell';
import { GlossaryPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'glossary');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="glossary">
      <GlossaryPage locale="ar" content={content} />
    </SiteShell>
  );
}
