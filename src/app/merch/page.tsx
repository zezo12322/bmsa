import SiteShell from '@/components/site/SiteShell';
import { MerchPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [content, params] = await Promise.all([getBmsaContent(), searchParams]);
  return (
    <SiteShell locale="en" current="merch">
      <MerchPage locale="en" content={content} params={params} />
    </SiteShell>
  );
}
