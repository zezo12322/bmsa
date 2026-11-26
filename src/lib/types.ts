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
  programs: LocalizedText[];
};

/** A standing committee or a support division — both can own activities and receive applications. */
export type OrgUnit = Committee | Division;

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
  tier: 'eb' | 'to' | 'sdd';
  positionTitle: LocalizedText;
  role: LocalizedText;
  memberName: LocalizedText;
  imageUrl?: string | null;
  icon: string;
  gradient: string;
  sortOrder: number;
};

export type ExchangeProgram = 'scope' | 'score';

export type ExchangeRegion = 'europe' | 'americas' | 'asia' | 'africa' | 'middle-east' | 'oceania';

export type ExchangeDestination = {
  id?: string;
  slug: string;
  country: LocalizedText;
  /** Emoji flag, e.g. 🇩🇪 */
  flag: string;
  region: ExchangeRegion;
  /** Which programs this destination is offered in. */
  programs: ExchangeProgram[];
  cities: LocalizedText;
  fields: LocalizedText;
  language: LocalizedText;
  notes: LocalizedText;
  sortOrder: number;
};

export type ExchangeStory = {
  id?: string;
  slug: string;
  studentName: LocalizedText;
  academicYear: LocalizedText;
  program: ExchangeProgram;
  country: LocalizedText;
  flag: string;
  host: LocalizedText;
  period: LocalizedText;
  quote: LocalizedText;
  story: LocalizedText;
  imageUrl?: string | null;
  sortOrder: number;
};

export type ExchangeCall = {
  id?: string;
  title: LocalizedText;
  /** Which program the call is for. */
  program: ExchangeProgram | 'both';
  /** ISO timestamps (UTC). */
  opensAt: string;
  closesAt: string;
  details: LocalizedText;
};

export type BmsaContent = {
  committees: Committee[];
  divisions: Division[];
  activities: Activity[];
  merchItems: MerchItem[];
  boardMembers: BoardMember[];
  exchangeDestinations: ExchangeDestination[];
  exchangeStories: ExchangeStory[];
  exchangeCalls: ExchangeCall[];
  images: Record<string, string>;
};

export function text(value: LocalizedText, locale: Locale) {
  return value[locale] || value.en || value.ar;
}
