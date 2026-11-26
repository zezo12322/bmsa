import SiteShell from '@/components/site/SiteShell';
import { JoinPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('ar', 'join');

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [content, params] = await Promise.all([getBmsaContent(), searchParams]);
  return (
    <SiteShell locale="ar" current="join">
      <JoinPage locale="ar" content={content} params={params} />
    </SiteShell>
  );
}
