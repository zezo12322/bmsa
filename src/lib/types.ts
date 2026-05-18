export type Locale = 'en' | 'ar';

export type LocalizedText = {
  en: string;
  ar: string;
};

export type Committee = {
  slug: string;
  name: string;
  fullName: LocalizedText;
  description: LocalizedText;
  color: string;
  logo: string;
  programs: LocalizedText[];
};

export type Division = {
  slug: string;
  name: string;
  fullName: LocalizedText;
  description: LocalizedText;
  color: string;
  logo: string;
};

export type Activity = {
  id?: string;
  slug: string;
  committee: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  description: LocalizedText;
  tag: LocalizedText;
  imageUrl?: string | null;
  icon: string;
  sortOrder: number;
};

export type MerchItem = {
  id?: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  price: LocalizedText;
  imageUrl?: string | null;
  icon: string;
  gradient: string;
  sizes: string[];
  hasSizes: boolean;
  inStock: boolean;
  sortOrder: number;
};

export type BoardMember = {
  id?: string;
  tier: 'eb' | 'to';
  positionTitle: LocalizedText;
  role: LocalizedText;
  memberName: LocalizedText;
  imageUrl?: string | null;
  icon: string;
  gradient: string;
  sortOrder: number;
};

export type BmsaContent = {
  committees: Committee[];
  divisions: Division[];
  activities: Activity[];
  merchItems: MerchItem[];
  boardMembers: BoardMember[];
  images: Record<string, string>;
};

export function text(value: LocalizedText, locale: Locale) {
  return value[locale] || value.en || value.ar;
}
