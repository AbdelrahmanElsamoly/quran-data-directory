'use client';

import Link from 'next/link';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { SearchBar } from '@/components/resources/SearchBar';
import { useResources } from '@/hooks/useResources';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { useTranslations } from '@/i18n';

export default function HomePage() {
  const { data, isLoading } = useResources({ itqan_badge: 'true', page_size: 6 });
  const t = useTranslations();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 via-[var(--bg-primary)] to-[var(--sand)]/20" />
        <div className="section-padding pt-14 pb-8 sm:pt-16 sm:pb-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-6 text-balance">
              {t.home.hero.title}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-2xl mx-auto text-balance">
              {t.home.hero.subtitle}
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[var(--text-muted)] flex-wrap">
              {t.home.hero.categories.map((cat, i) => (
                <span key={cat} className="flex items-center gap-4">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />}
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="section-padding py-3">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '20+', label: t.home.stats.resources },
              { value: '12', label: t.home.stats.publishers },
              { value: '350+', label: t.home.stats.developers },
              { value: '12.4K', label: t.home.stats.downloads },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                <div className="font-heading text-3xl sm:text-4xl font-bold text-[var(--accent-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-heading text-[var(--text-muted)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section — moved above featured for better flow */}
      <section className="section-padding pt-10 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--accent-primary)] rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
              {t.home.cta.title}
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto leading-relaxed">
              {t.home.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="px-6 py-3 rounded-lg bg-white text-[var(--accent-primary)] font-heading font-semibold hover:bg-white/90 transition-colors">
                {t.home.cta.getStarted}
              </Link>
              <Link href="/resources" className="px-6 py-3 rounded-lg border-2 border-white/30 text-white font-heading hover:bg-white/10 transition-colors">
                {t.home.cta.explore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="section-padding pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              {t.home.featured.title}
            </h2>
            <Link href="/resources" className="text-sm font-heading text-[var(--accent-primary)] hover:underline flex items-center gap-1">
              {t.home.featured.browseAll}
              <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <ListSkeleton count={6} />
          ) : data?.results.length ? (
            <ResourceGrid resources={data.results} />
          ) : (
            <p className="text-center py-12 text-[var(--text-muted)]">
              {t.home.featured.empty}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
