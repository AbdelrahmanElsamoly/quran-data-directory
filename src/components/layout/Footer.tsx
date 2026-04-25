'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n';

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-auto">
      <div className="section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-lg font-heading font-bold text-[var(--accent-primary)]">
              RATQ
            </Link>
            <p className="mt-2 text-sm text-[var(--text-muted)] max-w-md leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-[var(--text-primary)] mb-3">
              {t.footer.platform.title}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resources" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.platform.browse}
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.platform.standards}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.platform.docs}
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-[var(--text-primary)] mb-3">
              {t.footer.community.title}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.community.about}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.community.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                  {t.footer.community.privacy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            {t.footer.copyright.replace('{{year}}', String(year))}
          </p>
        </div>
      </div>
    </footer>
  );
}
