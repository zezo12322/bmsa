import SiteShell from '@/components/site/SiteShell';
import { VerifyPage } from '@/components/site/ResourcePages';
import { lookupCertificate } from '@/lib/certificates';
import { pageMetadata } from '@/lib/routes';

export const metadata = pageMetadata('en', 'verify');

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = (await searchParams).code;
  const code = (Array.isArray(raw) ? raw[0] : raw || '').trim().slice(0, 64);
  const { result, unavailable } = await lookupCertificate(code);
  return (
    <SiteShell locale="en" current="verify">
      <VerifyPage locale="en" code={code} result={result} unavailable={unavailable} />
    </SiteShell>
  );
}
