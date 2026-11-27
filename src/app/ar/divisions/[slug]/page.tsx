import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import UnitPage from '@/components/site/UnitPage';
import { getBmsaContent } from '@/lib/cms';
import { localizePath } from '@/lib/routes';
import { text } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getBmsaContent();
  return content.divisions.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBmsaContent();
  const unit = content.divisions.find((item) => item.slug === slug);
  if (!unit) return {};
  const path = `/divisions/${slug}`;
  return {
    title: `${unit.name} — ${text(unit.fullName, 'ar')}`,
    description: text(unit.description, 'ar'),
    alternates: {
      canonical: localizePath('ar', path),
      languages: { en: path, ar: localizePath('ar', path) },
    },
    openGraph: { images: [unit.logo] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getBmsaContent();
  const unit = content.divisions.find((item) => item.slug === slug);
  if (!unit) notFound();

  return (
    <SiteShell locale="ar" current="divisions" path={`/divisions/${slug}`}>
      <UnitPage locale="ar" content={content} kind="divisions" unit={unit} />
    </SiteShell>
  );
}