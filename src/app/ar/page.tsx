import SiteShell from '@/components/site/SiteShell';
import { HomePage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';

export default async function Page() {
  const content = await getBmsaContent();
  return (
    <SiteShell locale="ar" current="home">
      <HomePage locale="ar" content={content} />
    </SiteShell>
  );
}
