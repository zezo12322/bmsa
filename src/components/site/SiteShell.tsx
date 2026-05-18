/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Globe2, Instagram, Linkedin, Mail, MapPin, Menu, Stethoscope } from 'lucide-react';
import { siteCopy } from '@/lib/bmsa-data';
import type { Locale } from '@/lib/types';

type PageKey = 'home' | 'about' | 'committees' | 'divisions' | 'activities' | 'merch' | 'join';

const paths: Record<PageKey, string> = {
  home: '/',
  about: '/about',
  committees: '/committees',
  divisions: '/divisions',
  activities: '/activities',
  merch: '/merch',
  join: '/join',
};

function localizedPath(locale: Locale, key: PageKey) {
  const path = paths[key];
  return locale === 'ar' ? `/ar${path === '/' ? '' : path}` : path;
}

export default function SiteShell({
  locale,
  current,
  children,
}: {
  locale: Locale;
  current: PageKey;
  children: React.ReactNode;
}) {
  const copy = siteCopy[locale];
  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const alternatePath = localizedPath(otherLocale, current);

  return (
    <div className="site-shell" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <header className="site-header">
        <script dangerouslySetInnerHTML={{ __html: `(function(){var h=document.querySelector('.site-header');if(!h)return;function u(){h.classList.toggle('nav-scrolled',window.scrollY>20);}window.addEventListener('scroll',u,{passive:true});u();})();` }} />
        <div className="site-container nav-bar">
          <Link className="brand-link" href={localizedPath(locale, 'home')} aria-label={copy.brand}>
            <img src="/images/logos/bmsa-logo-h.png" alt={copy.brand} />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {(Object.keys(paths) as PageKey[]).map((key) => (
              <Link
                key={key}
                href={localizedPath(locale, key)}
                className={current === key ? 'active' : undefined}
              >
                {copy.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link className="lang-chip" href={alternatePath}>
              <Globe2 size={16} />
              {otherLocale.toUpperCase()}
            </Link>
            <details className="mobile-menu">
              <summary aria-label="Open navigation">
                <Menu size={22} />
              </summary>
              <div className="mobile-menu-panel">
                {(Object.keys(paths) as PageKey[]).map((key) => (
                  <Link key={key} href={localizedPath(locale, key)}>
                    {copy.nav[key]}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="site-container footer-grid">
          <div>
            <Link className="footer-logo" href={localizedPath(locale, 'home')}>
              <img src="/images/logos/bmsa-logo-h-white.png" alt={copy.brand} />
            </Link>
            <p>{copy.heroLead}</p>
            <div className="social-row" aria-label="Social links">
              <a href={copy.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3>{locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="footer-list">
              {(Object.keys(paths) as PageKey[]).slice(0, 6).map((key) => (
                <li key={key}>
                  <Link href={localizedPath(locale, key)}>{copy.nav[key]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>{locale === 'ar' ? 'تواصل معنا' : 'Contact'}</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>{copy.location}</span>
              </li>
              <li>
                <Mail size={18} />
                <a href={`mailto:${copy.email}`}>{copy.email}</a>
              </li>
              <li>
                <Stethoscope size={18} />
                <span>{copy.tagline}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 {copy.brand}. IFMSA-Egypt Local Committee.</span>
        </div>
      </footer>
    </div>
  );
}
