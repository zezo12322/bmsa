'use client';

import { useState } from 'react';
import { submitMerchOrder } from '@/app/actions';
import type { MerchItem, Locale } from '@/lib/types';
import { text } from '@/lib/types';

type Labels = {
  order: string;
  product: string;
  size: string;
  qty: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  submit: string;
};

export default function MerchOrderForm({
  locale,
  items,
  labels,
  initialSlug = '',
}: {
  locale: Locale;
  items: MerchItem[];
  labels: Labels;
  initialSlug?: string;
}) {
  const [selectedSlug, setSelectedSlug] = useState(() =>
    items.some((item) => item.slug === initialSlug && item.inStock) ? initialSlug : '',
  );

  const selectedItem = items.find((item) => item.slug === selectedSlug);
  const showSizes = Boolean(selectedItem?.hasSizes && selectedItem.sizes.length > 0);

  return (
    <form action={submitMerchOrder}>
      <input type="hidden" name="locale" value={locale} />

      <label>
        {labels.product}
        <select
          name="item_slug"
          required
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
        >
          <option value="">{locale === 'ar' ? 'اختر المنتج' : 'Choose a product'}</option>
          {items.map((item) => (
            <option key={item.slug} value={item.slug} disabled={!item.inStock}>
              {text(item.name, locale)}
              {!item.inStock ? (locale === 'ar' ? ' — غير متاح' : ' — Out of stock') : ''}
            </option>
          ))}
        </select>
      </label>

      {showSizes ? (
        <label>
          {labels.size}
          <select name="size" required>
            <option value="">{locale === 'ar' ? 'اختر المقاس' : 'Choose size'}</option>
            {selectedItem!.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label>
        {labels.qty}
        <input name="quantity" type="number" min="1" max="100" defaultValue="1" required />
      </label>

      <label>
        {labels.name}
        <input name="name" autoComplete="name" required />
      </label>

      <label>
        {labels.phone}
        <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required />
      </label>

      <label>
        {labels.email}
        <input name="email" type="email" autoComplete="email" dir="ltr" required />
      </label>

      <label>
        {labels.notes}
        <textarea name="notes" rows={4} />
      </label>

      <button className="button primary full" type="submit">
        {labels.submit}
      </button>
    </form>
  );
}
