import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bmsa-benisuef.org'),
  title: 'BMSA Benisuef | Medical Students Association',
  description:
    'BMSA Benisuef is the IFMSA-Egypt local committee at Beni Suef University Faculty of Medicine.',
  keywords: ['BMSA', 'Beni Suef', 'IFMSA Egypt', 'medical students', 'SCOME', 'SCOPE', 'SCOPH'],
  icons: {
    icon: '/images/logos/bmsa-logo-v.png',
  },
  openGraph: {
    type: 'website',
    title: 'BMSA Benisuef',
    description:
      'A CMS-powered bilingual website for BMSA Benisuef and its committees, activities, merch, and membership flow.',
    images: ['/images/logos/bmsa-logo-h.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cairo.variable}`}>{children}</body>
    </html>
  );
}
