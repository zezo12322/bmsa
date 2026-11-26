import type { Metadata } from 'next';
import type { Locale } from './types';

export type PageKey = 'home' | 'about' | 'committees' | 'divisions' | 'activities' | 'merch' | 'join';

export const pagePaths: Record<PageKey, string> = {
  home: '/',
  about: '/about',
  committees: '/committees',
  divisions: '/divisions',
  activities: '/activities',
  merch: '/merch',
  join: '/join',
};

/** Prefixes an English path with `/ar` for Arabic pages. */
export function localizePath(locale: Locale, path: string) {
  if (locale !== 'ar') return path;
  return path === '/' ? '/ar' : `/ar${path}`;
}

export function pageHref(locale: Locale, key: PageKey) {
  return localizePath(locale, pagePaths[key]);
}

const pageMeta: Record<Locale, Record<PageKey, { title: string; description: string }>> = {
  en: {
    home: {
      title: 'BMSA Benisuef | Medical Students Association',
      description:
        'BMSA Benisuef is the IFMSA-Egypt local committee at Beni Suef University Faculty of Medicine — medical education, exchanges, research, public health, and advocacy.',
    },
    about: {
      title: 'About Us',
      description: 'Mission, vision, values, and the Executive Board and Team of Officials of BMSA Benisuef.',
    },
    committees: {
      title: 'Standing Committees',
      description: 'SCOME, SCOPE, SCOPH, SCORA, SCORE, and SCORP — the six standing committees of BMSA Benisuef and their programs.',
    },
    divisions: {
      title: 'Support Divisions',
      description: 'CBSD, PSD, PNSD, FSD, and RSD — the support divisions that keep BMSA Benisuef organized and sustainable.',
    },
    activities: {
      title: 'Activities',
      description: 'Campaigns, workshops, and exchanges run by BMSA Benisuef committees.',
    },
    merch: {
      title: 'Merch Store',
      description: 'Order BMSA Benisuef hoodies, T-shirts, lab coats, and more.',
    },
    join: {
      title: 'Join BMSA',
      description: 'Apply to become a BMSA Benisuef member and choose the committee that fits you.',
    },
  },
  ar: {
    home: {
      title: 'بمسا بني سويف | جمعية طلاب الطب',
      description:
        'بمسا بني سويف هي اللجنة المحلية لـ IFMSA-Egypt في كلية طب جامعة بني سويف — تعليم طبي، تبادل، بحث علمي، صحة عامة، ومناصرة.',
    },
    about: {
      title: 'عن بمسا',
      description: 'الرسالة والرؤية والقيم، والمجلس التنفيذي وفريق المسؤولين في بمسا بني سويف.',
    },
    committees: {
      title: 'اللجان الدائمة',
      description: 'SCOME وSCOPE وSCOPH وSCORA وSCORE وSCORP — اللجان الدائمة الست في بمسا بني سويف وبرامجها.',
    },
    divisions: {
      title: 'أقسام الدعم',
      description: 'CBSD وPSD وPNSD وFSD وRSD — أقسام الدعم التي تحافظ على تنظيم واستدامة العمل في بمسا.',
    },
    activities: {
      title: 'الأنشطة',
      description: 'حملات وورش وبرامج تبادل تنفذها لجان بمسا بني سويف.',
    },
    merch: {
      title: 'المتجر',
      description: 'اطلب هودي وتيشيرت وروب بمسا بني سويف والمزيد.',
    },
    join: {
      title: 'انضم إلى بمسا',
      description: 'قدّم طلب عضوية في بمسا بني سويف واختر اللجنة المناسبة لك.',
    },
  },
};

export function pageMetadata(locale: Locale, key: PageKey): Metadata {
  const meta = pageMeta[locale][key];
  const enPath = pagePaths[key];
  const arPath = localizePath('ar', enPath);

  return {
    title: key === 'home' ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: {
      canonical: locale === 'ar' ? arPath : enPath,
      languages: { en: enPath, ar: arPath },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      images: ['/images/logos/bmsa-logo-h.png'],
    },
  };
}
