import SiteShell from '@/components/site/SiteShell';
import { GlossaryPage } from '@/components/site/ResourcePages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'glossary');

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="glossary">
      <GlossaryPage locale="en" content={content} />
    </SiteShell>
  );
}
