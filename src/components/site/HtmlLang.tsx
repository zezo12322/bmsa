'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/types';

/**
 * Keeps <html lang/dir> in sync with the current page locale, including after
 * client-side navigation between /en and /ar pages (the root layout is shared).
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return null;
}
