/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Facebook, Globe2, Instagram, Linkedin, Mail, MapPin, Menu, Stethoscope } from 'lucide-react';
import HtmlLang from '@/components/site/HtmlLang';
import { siteCopy } from '@/lib/bmsa-data';
import { localizePath, pageHref, pagePaths, type PageKey } from '@/lib/routes';
import type { Locale } from '@/lib/types';

const navKeys = Object.keys(pagePaths) as PageKey[];

export default function SiteShell({
  locale,
  current,
  path,
  children,
}: {
  locale: Locale;
  current: PageKey;
  /** English path of a detail page (e.g. `/committees/scome`), so the language switch keeps the slug. */
  path?: string;
  children: React.ReactNode;
}) {
  const copy = siteCopy[locale];
  const otherLocale: Locale = locale === 'ar' ? 'en' : 'ar';
  const alternatePath = path ? localizePath(otherLocale, path) : pageHref(otherLocale, current);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const socials = [
    { href: copy.facebook, label: 'Facebook', Icon: Facebook },
    { href: copy.instagram, label: 'Instagram', Icon: Instagram },
    { href: copy.linkedin, label: 'LinkedIn', Icon: Linkedin },
  ].filter((social) => social.href);

  return (
    <div className="site-shell" lang={locale} dir={dir}>
      {/* Set <html lang/dir> before first paint; HtmlLang keeps it in sync on client navigation. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(locale)};document.documentElement.dir=${JSON.stringify(dir)};`,
        }}
      />
      <HtmlLang locale={locale} />
      <a className="skip-link" href="#main">
        {locale === 'ar' ? 'انتقل إلى المحتوى' : 'Skip to content'}
      </a>
      <header className="site-header">
        <script dangerouslySetInnerHTML={{ __html: `(function(){var h=document.querySelector('.site-header');if(!h)return;function u(){h.classList.toggle('nav-scrolled',window.scrollY>20);}window.addEventListener('scroll',u,{passive:true});u();})();` }} />
        <div className="site-container nav-bar">
          <Link className="brand-link" href={pageHref(locale, 'home')} aria-label={copy.brand}>
            <img src="/images/logos/bmsa-logo-h.png" alt={copy.brand} width={160} height={94} />
          </Link>

          <nav className="desktop-nav" aria-label={locale === 'ar' ? 'القائمة الرئيسية' : 'Primary navigation'}>
            {navKeys.map((key) => (
              <Link
                key={key}
                href={pageHref(locale, key)}
                className={[current === key ? 'active' : '', key === 'join' ? 'nav-cta' : ''].filter(Boolean).join(' ') || undefined}
                aria-current={current === key ? 'page' : undefined}
              >
                {copy.nav[key]}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Link
              className="lang-chip"
              href={alternatePath}
              hrefLang={otherLocale}
              aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe2 size={16} />
              {otherLocale === 'ar' ? 'عربي' : 'EN'}
            </Link>
            <details className="mobile-menu">
              <summary aria-label={locale === 'ar' ? 'فتح القائمة' : 'Open navigation'}>
                <Menu size={22} />
              </summary>
              <nav className="mobile-menu-panel" aria-label={locale === 'ar' ? 'القائمة' : 'Mobile navigation'}>
                {navKeys.map((key) => (
                  <Link
                    key={key}
                    href={pageHref(locale, key)}
                    className={current === key ? 'active' : undefined}
                    aria-current={current === key ? 'page' : undefined}
                  >
                    {copy.nav[key]}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <div id="main">{children}</div>

      <footer className="site-footer">
        <div className="site-container footer-grid">
          <div>
            <Link className="footer-logo" href={pageHref(locale, 'home')}>
              <img src="/images/logos/bmsa-logo-h-white.png" alt={copy.brand} width={160} height={94} />
            </Link>
            <p>{copy.heroLead}</p>
            {socials.length ? (
              <div className="social-row" aria-label={locale === 'ar' ? 'حساباتنا' : 'Social links'}>
                {socials.map(({ href, label, Icon }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3>{locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h3>
            <ul className="footer-list">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link href={pageHref(locale, key)}>{copy.nav[key]}</Link>
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
                <a href={`mailto:${copy.email}`} dir="ltr">
                  {copy.email}
                </a>
              </li>
              <li>
                <Stethoscope size={18} />
                <span>{copy.tagline}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {copy.brand}.{' '}
            {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
        </div>
      </footer>
    </div>
  );
}
