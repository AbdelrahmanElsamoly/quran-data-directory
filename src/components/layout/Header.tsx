'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { locale, setLocale, t } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => setMounted(true), []);

  const toggleLocale = () => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-color)]">
      <nav className="section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold text-[var(--accent-primary)]">
              RATQ
            </span>
            <span className="hidden sm:inline text-sm text-[var(--text-muted)] font-heading">
              {locale === 'ar' ? 'منصة المجتمع' : 'Community Platform'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/resources" className="text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              {t.header.nav.resources}
            </Link>
            <Link href="/about" className="text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              {t.header.nav.about}
            </Link>
            <Link href="/dashboard" className="text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              {t.header.nav.dashboard}
            </Link>
          </div>

          {/* Right Section: Language + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 text-xs font-heading font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]/50"
              aria-label="Switch language"
              title={locale === 'ar' ? t.header.langSwitch.en : t.header.langSwitch.ar}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.73-3.555" />
              </svg>
              <span>{locale === 'ar' ? t.header.langSwitch.en : t.header.langSwitch.ar}</span>
            </button>

            {mounted && (user ? (
              <button
                onClick={handleLogout}
                className="btn-outline"
              >
                {t.header.auth.logout}
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-outline">
                  {t.header.auth.login}
                </Link>
                <Link href="/register" className="btn-primary">
                  {t.header.auth.register}
                </Link>
              </>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLocale}
              className="sm:hidden flex items-center gap-1 text-xs font-heading font-semibold text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors px-2 py-1 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-primary)]"
              aria-label="Switch language"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.466.73-3.555" />
              </svg>
              <span>{locale === 'ar' ? t.header.langSwitch.en : t.header.langSwitch.ar}</span>
            </button>
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t.header.mobileMenu}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--border-color)] mt-2 pt-4 space-y-3">
            <Link href="/resources" className="block text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.header.nav.resources}
            </Link>
            <Link href="/about" className="block text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.header.nav.about}
            </Link>
            <Link href="/dashboard" className="block text-sm font-heading text-[var(--text-secondary)] hover:text-[var(--accent-primary)]">
              {t.header.nav.dashboard}
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {mounted && (user ? (
                <button
                  onClick={handleLogout}
                  className="btn-outline w-full text-center"
                >
                  {t.header.auth.logout}
                </button>
              ) : (
                <>
                  <Link href="/login" className="btn-outline w-full text-center">
                    {t.header.auth.login}
                  </Link>
                  <Link href="/register" className="btn-primary w-full text-center">
                    {t.header.auth.register}
                  </Link>
                </>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
