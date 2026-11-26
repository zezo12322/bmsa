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
  title: {
    default: 'BMSA Benisuef | Medical Students Association',
    template: '%s | BMSA Benisuef',
  },
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
      'BMSA Benisuef — the IFMSA-Egypt local committee at Beni Suef University Faculty of Medicine: committees, activities, exchanges, and membership.',
    images: ['/images/logos/bmsa-logo-h.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Font variables must live on <html> so the :root tokens in globals.css can resolve them.
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
