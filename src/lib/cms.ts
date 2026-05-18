import { cache } from 'react';
import { fallbackContent } from './bmsa-data';
import type { Activity, BoardMember, BmsaContent, MerchItem } from './types';
import { createPublicSupabaseClient } from '@/utils/supabase/public';

type CmsImageRow = {
  key: string;
  url: string;
};

type CmsActivityRow = {
  id: string;
  slug: string;
  committee: string;
  title_en: string;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  tag_en: string | null;
  tag_ar: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number | null;
};

type CmsMerchRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  price_en: string | null;
  price_ar: string | null;
  image_url: string | null;
  icon: string | null;
  gradient: string | null;
  sizes: string[] | null;
  has_sizes: boolean | null;
  in_stock: boolean | null;
  sort_order: number | null;
};

type CmsBoardRow = {
  id: string;
  tier: 'eb' | 'to';
  position_title_en: string;
  position_title_ar: string | null;
  role_en: string | null;
  role_ar: string | null;
  member_name_en: string | null;
  member_name_ar: string | null;
  image_url: string | null;
  icon: string | null;
  gradient: string | null;
  sort_order: number | null;
};

function assetUrl(value?: string | null) {
  if (!value) return null;
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return `/${value.replace(/^\/+/, '')}`;
}

function imageMap(rows: CmsImageRow[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    if (row.key && row.url) acc[row.key] = assetUrl(row.url) || row.url;
    return acc;
  }, {});
}

function mapActivity(row: CmsActivityRow): Activity {
  const titleAr = row.title_ar || row.title_en;
  const excerptEn = row.excerpt_en || row.description_en || '';
  const excerptAr = row.excerpt_ar || row.description_ar || excerptEn;
  const descriptionEn = row.description_en || excerptEn;
  const descriptionAr = row.description_ar || excerptAr || descriptionEn;

  return {
    id: row.id,
    slug: row.slug,
    committee: row.committee,
    title: { en: row.title_en, ar: titleAr },
    excerpt: { en: excerptEn, ar: excerptAr },
    description: { en: descriptionEn, ar: descriptionAr },
    tag: {
      en: row.tag_en || row.committee.toUpperCase(),
      ar: row.tag_ar || row.tag_en || row.committee.toUpperCase(),
    },
    imageUrl: assetUrl(row.image_url),
    icon: row.icon || 'calendar-days',
    sortOrder: row.sort_order || 0,
  };
}

function mapMerch(row: CmsMerchRow): MerchItem {
  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.name_en, ar: row.name_ar || row.name_en },
    description: {
      en: row.description_en || '',
      ar: row.description_ar || row.description_en || '',
    },
    price: {
      en: row.price_en || 'Contact for price',
      ar: row.price_ar || row.price_en || 'تواصل لمعرفة السعر',
    },
    imageUrl: assetUrl(row.image_url),
    icon: row.icon || 'shirt',
    gradient: row.gradient || 'linear-gradient(135deg,#c0392b,#922b21)',
    sizes: row.sizes || [],
    hasSizes: Boolean(row.has_sizes || row.sizes?.length),
    inStock: row.in_stock !== false,
    sortOrder: row.sort_order || 0,
  };
}

function mapBoard(row: CmsBoardRow): BoardMember {
  return {
    id: row.id,
    tier: row.tier,
    positionTitle: {
      en: row.position_title_en,
      ar: row.position_title_ar || row.position_title_en,
    },
    role: {
      en: row.role_en || 'BMSA Benisuef',
      ar: row.role_ar || row.role_en || 'بمسا بني سويف',
    },
    memberName: {
      en: row.member_name_en || 'TBD',
      ar: row.member_name_ar || row.member_name_en || 'يُعلن لاحقاً',
    },
    imageUrl: assetUrl(row.image_url),
    icon: row.icon || 'user',
    gradient: row.gradient || 'linear-gradient(135deg,#c0392b,#e15a4a)',
    sortOrder: row.sort_order || 0,
  };
}

async function getPublishedRows<T>(table: string) {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.warn(`CMS read failed for ${table}:`, error.message);
    return [];
  }

  return (data || []) as T[];
}

export const getBmsaContent = cache(async (): Promise<BmsaContent> => {
  const [imageRows, activityRows, merchRows, boardRows] = await Promise.all([
    getPublishedRows<CmsImageRow>('bmsa_images'),
    getPublishedRows<CmsActivityRow>('bmsa_activities'),
    getPublishedRows<CmsMerchRow>('bmsa_merch_items'),
    getPublishedRows<CmsBoardRow>('bmsa_board_members'),
  ]);

  return {
    committees: fallbackContent.committees,
    divisions: fallbackContent.divisions,
    activities: activityRows.length ? activityRows.map(mapActivity) : fallbackContent.activities,
    merchItems: merchRows.length ? merchRows.map(mapMerch) : fallbackContent.merchItems,
    boardMembers: boardRows.length ? boardRows.map(mapBoard) : fallbackContent.boardMembers,
    images: imageMap(imageRows),
  };
});
