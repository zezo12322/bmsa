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
  return content.committees.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBmsaContent();
  const unit = content.committees.find((item) => item.slug === slug);
  if (!unit) return {};
  const path = `/committees/${slug}`;
  return {
    title: `${unit.name} — ${text(unit.fullName, 'en')}`,
    description: text(unit.description, 'en'),
    alternates: {
      canonical: localizePath('en', path),
      languages: { en: path, ar: localizePath('ar', path) },
    },
    openGraph: { images: [unit.logo] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getBmsaContent();
  const unit = content.committees.find((item) => item.slug === slug);
  if (!unit) notFound();

  return (
    <SiteShell locale="en" current="committees" path={`/committees/${slug}`}>
      <UnitPage locale="en" content={content} kind="committees" unit={unit} />
    </SiteShell>
  );
}