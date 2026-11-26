import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import { ActivityDetailPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { localizePath } from '@/lib/routes';
import { text } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getBmsaContent();
  return content.activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBmsaContent();
  const activity = content.activities.find((item) => item.slug === slug);
  if (!activity) return {};
  const path = `/activities/${slug}`;
  return {
    title: text(activity.title, 'ar'),
    description: text(activity.excerpt, 'ar'),
    alternates: {
      canonical: localizePath('ar', path),
      languages: { en: path, ar: localizePath('ar', path) },
    },
    openGraph: activity.imageUrl ? { images: [activity.imageUrl] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getBmsaContent();
  const activity = content.activities.find((item) => item.slug === slug);
  if (!activity) notFound();

  return (
    <SiteShell locale="ar" current="activities">
      <ActivityDetailPage locale="ar" content={content} activity={activity} />
    </SiteShell>
  );
}
