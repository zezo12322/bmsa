import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteShell from '@/components/site/SiteShell';
import { NewsDetailPage } from '@/components/site/Pages';
import { getBmsaContent } from '@/lib/cms';
import { localizePath } from '@/lib/routes';
import { text } from '@/lib/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const content = await getBmsaContent();
  return content.news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBmsaContent();
  const item = content.news.find((n) => n.slug === slug);
  if (!item) return {};
  const path = `/news/${slug}`;
  return {
    title: text(item.title, 'en'),
    description: text(item.excerpt, 'en'),
    alternates: {
      canonical: localizePath('en', path),
      languages: { en: path, ar: localizePath('ar', path) },
    },
    openGraph: item.imageUrl ? { images: [item.imageUrl] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = await getBmsaContent();
  const item = content.news.find((n) => n.slug === slug);
  if (!item) notFound();

  return (
    <SiteShell locale="en" current="news" path={`/news/${slug}`}>
      <NewsDetailPage locale="en" content={content} item={item} />
    </SiteShell>
  );
}
