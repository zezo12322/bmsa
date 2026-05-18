import SiteShell from '@/components/site/SiteShell';
import { AboutPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="en" current="about">
      <AboutPage locale="en" content={content} />
    </SiteShell>
  );
}
