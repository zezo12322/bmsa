export type AdminField = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'number' | 'select';
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
        label: 'Committee',
        type: 'select',
        required: true,
        options: ['scome', 'scope', 'scoph', 'scora', 'score', 'scorp'].map((value) => ({ label: value.toUpperCase(), value })),
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
      { name: 'icon', label: 'Icon', type: 'text', helper: 'Examples: stethoscope, plane, heart-pulse, ribbon, file-pen, scale.' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
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
    description: 'Executive Board and Technical Officers shown on the About page.',
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
          { label: 'Technical Officers', value: 'to' },
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
