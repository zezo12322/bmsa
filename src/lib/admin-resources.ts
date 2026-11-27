export type AdminField = {
  name: string;
  label: string;
  /** `datetime` is entered in Egypt time and stored as a UTC timestamp. */
  type: 'text' | 'textarea' | 'checkbox' | 'number' | 'select' | 'datetime';
  required?: boolean;
  helper?: string;
  options?: { label: string; value: string }[];
  parseAs?: 'array';
};

export type AdminResource = {
  key: string;
  title: string;
  description: string;
  table: string;
  titleField: string;
  subtitleField?: string;
  fields: AdminField[];
};

export const adminResources: Record<string, AdminResource> = {
  activities: {
    key: 'activities',
    title: 'Activities',
    description: 'Committee projects and activity cards used across the public website.',
    table: 'bmsa_activities',
    titleField: 'title_en',
    subtitleField: 'committee',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      {
        name: 'committee',
        label: 'Committee / Division',
        type: 'select',
        required: true,
        options: [
          ...['scome', 'scope', 'scoph', 'scora', 'score', 'scorp'].map((value) => ({ label: value.toUpperCase(), value })),
          ...['cbsd', 'psd', 'pnsd', 'fsd', 'rsd'].map((value) => ({ label: `${value.toUpperCase()} (Support Division)`, value })),
        ],
      },
      { name: 'title_en', label: 'Title EN', type: 'text', required: true },
      { name: 'title_ar', label: 'Title AR', type: 'text' },
      { name: 'excerpt_en', label: 'Excerpt EN', type: 'textarea' },
      { name: 'excerpt_ar', label: 'Excerpt AR', type: 'textarea' },
      { name: 'description_en', label: 'Description EN', type: 'textarea' },
      { name: 'description_ar', label: 'Description AR', type: 'textarea' },
      { name: 'tag_en', label: 'Tag EN', type: 'text' },
      { name: 'tag_ar', label: 'Tag AR', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'text', helper: 'Use /images/... or a Supabase Storage public URL.' },
      { name: 'icon', label: 'Icon', type: 'text', helper: 'Examples: stethoscope, plane, heart-pulse, ribbon, file-pen, scale, presentation, camera.' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  news: {
    key: 'news',
    title: 'News',
    description: 'BMSA-wide updates shown on the News page: recruitment, team announcements, partnerships, tips, greetings.',
    table: 'bmsa_news',
    titleField: 'title_en',
    subtitleField: 'tag_en',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'title_en', label: 'Title EN', type: 'text', required: true },
      { name: 'title_ar', label: 'Title AR', type: 'text' },
      { name: 'excerpt_en', label: 'Excerpt EN', type: 'textarea' },
      { name: 'excerpt_ar', label: 'Excerpt AR', type: 'textarea' },
      { name: 'body_en', label: 'Body EN', type: 'textarea', helper: 'Leave a blank line between paragraphs.' },
      { name: 'body_ar', label: 'Body AR', type: 'textarea' },
      { name: 'tag_en', label: 'Tag EN', type: 'text', helper: 'Examples: BMSA - Recruitment, BMSA - Team, BMSA - Partnership.' },
      { name: 'tag_ar', label: 'Tag AR', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'text', helper: 'Use /images/... or a Supabase Storage public URL.' },
      { name: 'posted_at', label: 'Posted at (Egypt time)', type: 'datetime' },
      { name: 'sort_order', label: 'Sort order', type: 'number', helper: 'Lower numbers show first.' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  merch: {
    key: 'merch',
    title: 'Merch Items',
    description: 'Products shown in the merch page and order form.',
    table: 'bmsa_merch_items',
    titleField: 'name_en',
    subtitleField: 'slug',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'name_en', label: 'Name EN', type: 'text', required: true },
      { name: 'name_ar', label: 'Name AR', type: 'text' },
      { name: 'description_en', label: 'Description EN', type: 'textarea' },
      { name: 'description_ar', label: 'Description AR', type: 'textarea' },
      { name: 'price_en', label: 'Price EN', type: 'text' },
      { name: 'price_ar', label: 'Price AR', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'text' },
      { name: 'icon', label: 'Icon', type: 'text' },
      { name: 'gradient', label: 'Gradient CSS', type: 'text' },
      { name: 'sizes', label: 'Sizes', type: 'textarea', parseAs: 'array', helper: 'One size per line.' },
      { name: 'has_sizes', label: 'Has sizes', type: 'checkbox' },
      { name: 'in_stock', label: 'In stock', type: 'checkbox' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  board: {
    key: 'board',
    title: 'Board Members',
    description: 'Executive Board and Team of Officials (TO) shown on the About page.',
    table: 'bmsa_board_members',
    titleField: 'position_title_en',
    subtitleField: 'tier',
    fields: [
      {
        name: 'tier',
        label: 'Tier',
        type: 'select',
        required: true,
        options: [
          { label: 'Executive Board', value: 'eb' },
          { label: 'TO: Standing Committee Officers', value: 'to' },
          { label: 'TO: Support Division Directors', value: 'sdd' },
        ],
      },
      { name: 'position_title_en', label: 'Position EN', type: 'text', required: true },
      { name: 'position_title_ar', label: 'Position AR', type: 'text' },
      { name: 'role_en', label: 'Role EN', type: 'text' },
      { name: 'role_ar', label: 'Role AR', type: 'text' },
      { name: 'member_name_en', label: 'Member name EN', type: 'text' },
      { name: 'member_name_ar', label: 'Member name AR', type: 'text' },
      { name: 'image_url', label: 'Photo URL', type: 'text' },
      { name: 'icon', label: 'Icon', type: 'text' },
      { name: 'gradient', label: 'Gradient CSS', type: 'text' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  'exchange-calls': {
    key: 'exchange-calls',
    title: 'Exchange Calls',
    description:
      'Application windows for exchange. The Exchange page and home page count down to the next opening, then to the closing date. Pre-applications are linked to the call that is open when they are sent.',
    table: 'bmsa_exchange_calls',
    titleField: 'title_en',
    subtitleField: 'exchange_type',
    fields: [
      { name: 'title_en', label: 'Title EN', type: 'text', required: true, helper: 'e.g. Summer 2027 exchange call' },
      { name: 'title_ar', label: 'Title AR', type: 'text' },
      {
        name: 'exchange_type',
        label: 'Program',
        type: 'select',
        required: true,
        options: [
          { label: 'SCOPE (clinical)', value: 'scope' },
          { label: 'SCORE (research)', value: 'score' },
          { label: 'Both', value: 'both' },
        ],
      },
      { name: 'opens_at', label: 'Applications open', type: 'datetime', required: true, helper: 'Egypt time (Cairo).' },
      { name: 'closes_at', label: 'Applications close', type: 'datetime', required: true, helper: 'Egypt time (Cairo). Must be after the opening time.' },
      { name: 'details_en', label: 'Details EN', type: 'textarea', helper: 'Optional short note shown under the countdown, e.g. eligibility or info session date.' },
      { name: 'details_ar', label: 'Details AR', type: 'textarea' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  'exchange-destinations': {
    key: 'exchange-destinations',
    title: 'Exchange Destinations',
    description: 'Countries shown in the destinations explorer on the Exchange page. When none are published, example destinations are shown.',
    table: 'bmsa_exchange_destinations',
    titleField: 'country_en',
    subtitleField: 'exchange_type',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, helper: 'Lowercase, e.g. germany' },
      { name: 'country_en', label: 'Country EN', type: 'text', required: true },
      { name: 'country_ar', label: 'Country AR', type: 'text' },
      { name: 'flag', label: 'Flag emoji', type: 'text', helper: 'Paste the flag emoji, e.g. 🇩🇪' },
      {
        name: 'region',
        label: 'Region',
        type: 'select',
        required: true,
        options: [
          { label: 'Europe', value: 'europe' },
          { label: 'Americas', value: 'americas' },
          { label: 'Asia', value: 'asia' },
          { label: 'Africa', value: 'africa' },
          { label: 'Middle East', value: 'middle-east' },
          { label: 'Oceania', value: 'oceania' },
        ],
      },
      {
        name: 'exchange_type',
        label: 'Program',
        type: 'select',
        required: true,
        options: [
          { label: 'SCOPE (clinical)', value: 'scope' },
          { label: 'SCORE (research)', value: 'score' },
          { label: 'Both', value: 'both' },
        ],
      },
      { name: 'cities_en', label: 'Cities / hosts EN', type: 'text' },
      { name: 'cities_ar', label: 'Cities / hosts AR', type: 'text' },
      { name: 'fields_en', label: 'Departments / research areas EN', type: 'textarea' },
      { name: 'fields_ar', label: 'Departments / research areas AR', type: 'textarea' },
      { name: 'language_en', label: 'Language requirement EN', type: 'text' },
      { name: 'language_ar', label: 'Language requirement AR', type: 'text' },
      { name: 'notes_en', label: 'Notes EN', type: 'textarea', helper: 'Optional, e.g. number of spots or months available.' },
      { name: 'notes_ar', label: 'Notes AR', type: 'textarea' },
      { name: 'sold_out', label: 'Sold out until next season', type: 'checkbox', helper: 'Tick when all seats in the current contracts are taken. Untick when new contracts arrive.' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  'exchange-stories': {
    key: 'exchange-stories',
    title: 'Exchange Stories',
    description: 'Stories from members who went on exchange, shown on the Exchange page. Publish only with the student’s permission.',
    table: 'bmsa_exchange_stories',
    titleField: 'student_name_en',
    subtitleField: 'country_en',
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true, helper: 'Lowercase, e.g. sara-germany-2025' },
      { name: 'student_name_en', label: 'Student name EN', type: 'text', required: true },
      { name: 'student_name_ar', label: 'Student name AR', type: 'text' },
      { name: 'academic_year_en', label: 'Academic year EN', type: 'text', helper: 'e.g. 5th year' },
      { name: 'academic_year_ar', label: 'Academic year AR', type: 'text' },
      {
        name: 'exchange_type',
        label: 'Program',
        type: 'select',
        required: true,
        options: [
          { label: 'SCOPE (clinical)', value: 'scope' },
          { label: 'SCORE (research)', value: 'score' },
        ],
      },
      { name: 'country_en', label: 'Country EN', type: 'text' },
      { name: 'country_ar', label: 'Country AR', type: 'text' },
      { name: 'flag', label: 'Flag emoji', type: 'text' },
      { name: 'host_en', label: 'Host hospital / lab EN', type: 'text' },
      { name: 'host_ar', label: 'Host hospital / lab AR', type: 'text' },
      { name: 'period_en', label: 'Period EN', type: 'text', helper: 'e.g. August 2025' },
      { name: 'period_ar', label: 'Period AR', type: 'text' },
      { name: 'quote_en', label: 'Short quote EN', type: 'textarea' },
      { name: 'quote_ar', label: 'Short quote AR', type: 'textarea' },
      { name: 'story_en', label: 'Full story EN', type: 'textarea', helper: 'Separate paragraphs with a blank line.' },
      { name: 'story_ar', label: 'Full story AR', type: 'textarea' },
      { name: 'image_url', label: 'Photo URL', type: 'text' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
  images: {
    key: 'images',
    title: 'Image Overrides',
    description: 'Global image keys and URLs for CMS-managed assets.',
    table: 'bmsa_images',
    titleField: 'key',
    subtitleField: 'category',
    fields: [
      { name: 'key', label: 'Image key', type: 'text', required: true, helper: 'Example: images/hero/hero-main.jpg' },
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'url', label: 'Public URL', type: 'text', required: true },
      { name: 'alt_en', label: 'Alt EN', type: 'text' },
      { name: 'alt_ar', label: 'Alt AR', type: 'text' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  },
};

export function getAdminResource(key: string) {
  return adminResources[key];
}
