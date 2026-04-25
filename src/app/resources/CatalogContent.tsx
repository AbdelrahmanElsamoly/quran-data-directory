'use client';

import { useSearchParams } from 'next/navigation';
import { ResourceFilters } from '@/components/resources/ResourceFilters';
import { ResourceGrid } from '@/components/resources/ResourceGrid';
import { SearchBar } from '@/components/resources/SearchBar';
import { Pagination } from '@/components/ui/Pagination';
import { useResources } from '@/hooks/useResources';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { useTranslations } from '@/i18n';

export function CatalogContent() {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const type = searchParams.get('type') || undefined;
  const license = searchParams.get('license') || undefined;
  const itqan_badge = searchParams.get('itqan_badge') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading } = useResources({ type, license, itqan_badge, search, page });

  const showingText = data
    ? search
      ? t.catalog.showingSearch.replace('{{count}}', String(data.results.length)).replace('{{total}}', String(data.count)).replace('{{query}}', search)
      : t.catalog.showing.replace('{{count}}', String(data.results.length)).replace('{{total}}', String(data.count))
    : '';

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)] mb-3">
            {t.catalog.title}
          </h1>
          <p className="text-[var(--text-secondary)] mb-4">
            {t.catalog.subtitle}
          </p>
          <div className="max-w-lg">
            <SearchBar initialQuery={search || ''} />
          </div>
        </div>

        {/* Filters + Grid */}
        <div className="flex gap-6">
          <ResourceFilters />
          <div className="flex-grow min-w-0">
            {isLoading ? (
              <ListSkeleton count={9} />
            ) : data?.results.length ? (
              <>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {showingText}
                </p>
                <ResourceGrid resources={data.results} />
                <Pagination count={data.count} pageSize={12} />
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--text-muted)] font-heading mb-3">
                  {t.catalog.empty.title}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {t.catalog.empty.subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
