import { cache } from 'react';
import { fallbackContent } from './bmsa-data';
import type {
  Activity,
  BoardMember,
  BmsaContent,
  ExchangeCall,
  ExchangeDestination,
  ExchangeProgram,
  ExchangeRegion,
  ExchangeStory,
  MerchItem,
  NewsItem,
} from './types';
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

type CmsNewsRow = {
  id: string;
  slug: string;
  title_en: string;
  title_ar: string | null;
  excerpt_en: string | null;
  excerpt_ar: string | null;
  body_en: string | null;
  body_ar: string | null;
  tag_en: string | null;
  tag_ar: string | null;
  image_url: string | null;
  posted_at: string | null;
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
  tier: 'eb' | 'to' | 'sdd';
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

type CmsDestinationRow = {
  id: string;
  slug: string;
  country_en: string;
  country_ar: string | null;
  flag: string | null;
  region: string | null;
  exchange_type: string | null;
  cities_en: string | null;
  cities_ar: string | null;
  fields_en: string | null;
  fields_ar: string | null;
  language_en: string | null;
  language_ar: string | null;
  notes_en: string | null;
  notes_ar: string | null;
  sort_order: number | null;
};

type CmsStoryRow = {
  id: string;
  slug: string;
  student_name_en: string;
  student_name_ar: string | null;
  academic_year_en: string | null;
  academic_year_ar: string | null;
  exchange_type: string | null;
  country_en: string | null;
  country_ar: string | null;
  flag: string | null;
  host_en: string | null;
  host_ar: string | null;
  period_en: string | null;
  period_ar: string | null;
  quote_en: string | null;
  quote_ar: string | null;
  story_en: string | null;
  story_ar: string | null;
  image_url: string | null;
  sort_order: number | null;
};

type CmsCallRow = {
  id: string;
  title_en: string;
  title_ar: string | null;
  exchange_type: string | null;
  opens_at: string;
  closes_at: string;
  details_en: string | null;
  details_ar: string | null;
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

function mapNews(row: CmsNewsRow): NewsItem {
  const excerptEn = row.excerpt_en || row.body_en || '';
  const excerptAr = row.excerpt_ar || row.body_ar || excerptEn;
  return {
    id: row.id,
    slug: row.slug,
    title: { en: row.title_en, ar: row.title_ar || row.title_en },
    excerpt: { en: excerptEn, ar: excerptAr },
    body: { en: row.body_en || excerptEn, ar: row.body_ar || excerptAr },
    tag: { en: row.tag_en || 'BMSA', ar: row.tag_ar || row.tag_en || 'BMSA' },
    imageUrl: assetUrl(row.image_url),
    postedAt: row.posted_at,
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

/** Both languages, falling back to whichever one was filled in. */
function bilingual(en: string | null | undefined, ar: string | null | undefined) {
  const enText = en || ar || '';
  return { en: enText, ar: ar || enText };
}

const REGIONS: ExchangeRegion[] = ['europe', 'americas', 'asia', 'africa', 'middle-east', 'oceania'];

function mapDestination(row: CmsDestinationRow): ExchangeDestination {
  const type = row.exchange_type || 'scope';
  const programs: ExchangeProgram[] = type === 'both' ? ['scope', 'score'] : type === 'score' ? ['score'] : ['scope'];
  return {
    id: row.id,
    slug: row.slug,
    country: bilingual(row.country_en, row.country_ar),
    flag: row.flag || '🌍',
    region: REGIONS.includes(row.region as ExchangeRegion) ? (row.region as ExchangeRegion) : 'europe',
    programs,
    cities: bilingual(row.cities_en, row.cities_ar),
    fields: bilingual(row.fields_en, row.fields_ar),
    language: bilingual(row.language_en, row.language_ar),
    notes: bilingual(row.notes_en, row.notes_ar),
    sortOrder: row.sort_order || 0,
  };
}

function mapStory(row: CmsStoryRow): ExchangeStory {
  return {
    id: row.id,
    slug: row.slug,
    studentName: bilingual(row.student_name_en, row.student_name_ar),
    academicYear: bilingual(row.academic_year_en, row.academic_year_ar),
    program: row.exchange_type === 'score' ? 'score' : 'scope',
    country: bilingual(row.country_en, row.country_ar),
    flag: row.flag || '🌍',
    host: bilingual(row.host_en, row.host_ar),
    period: bilingual(row.period_en, row.period_ar),
    quote: bilingual(row.quote_en, row.quote_ar),
    story: bilingual(row.story_en, row.story_ar),
    imageUrl: assetUrl(row.image_url),
    sortOrder: row.sort_order || 0,
  };
}

function mapCall(row: CmsCallRow): ExchangeCall {
  const type = row.exchange_type;
  return {
    id: row.id,
    title: bilingual(row.title_en, row.title_ar),
    program: type === 'score' || type === 'both' ? type : 'scope',
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    details: bilingual(row.details_en, row.details_ar),
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
  const [imageRows, activityRows, newsRows, merchRows, boardRows, destinationRows, storyRows, callRows] = await Promise.all([
    getPublishedRows<CmsImageRow>('bmsa_images'),
    getPublishedRows<CmsActivityRow>('bmsa_activities'),
    getPublishedRows<CmsNewsRow>('bmsa_news'),
    getPublishedRows<CmsMerchRow>('bmsa_merch_items'),
    getPublishedRows<CmsBoardRow>('bmsa_board_members'),
    getPublishedRows<CmsDestinationRow>('bmsa_exchange_destinations'),
    getPublishedRows<CmsStoryRow>('bmsa_exchange_stories'),
    getPublishedRows<CmsCallRow>('bmsa_exchange_calls'),
  ]);

  return {
    committees: fallbackContent.committees,
    divisions: fallbackContent.divisions,
    activities: activityRows.length ? activityRows.map(mapActivity) : fallbackContent.activities,
    news: newsRows.map(mapNews),
    merchItems: merchRows.length ? merchRows.map(mapMerch) : fallbackContent.merchItems,
    boardMembers: boardRows.length ? boardRows.map(mapBoard) : fallbackContent.boardMembers,
    exchangeDestinations: destinationRows.length ? destinationRows.map(mapDestination) : fallbackContent.exchangeDestinations,
    exchangeStories: storyRows.length ? storyRows.map(mapStory) : fallbackContent.exchangeStories,
    exchangeCalls: callRows.length ? callRows.map(mapCall) : fallbackContent.exchangeCalls,
    images: imageMap(imageRows),
  };
});
