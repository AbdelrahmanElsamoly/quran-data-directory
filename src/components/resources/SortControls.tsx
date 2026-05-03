'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/i18n';
import type { SortOption } from '@/types/resource';

type SortKey = 'relevance' | 'downloads' | 'newest' | 'oldest' | 'name_asc' | 'name_desc';

const sortOptions: { value: SortOption; key: SortKey }[] = [
  { value: 'relevance', key: 'relevance' },
  { value: 'downloads', key: 'downloads' },
  { value: 'newest', key: 'newest' },
  { value: 'oldest', key: 'oldest' },
  { value: 'name_asc', key: 'name_asc' },
  { value: 'name_desc', key: 'name_desc' },
];

export function SortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const currentSort = (searchParams.get('sort') || 'relevance') as SortOption;

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevance') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    // Reset to page 1 when sort changes
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
  };

  const ChevronDown = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-[var(--text-muted)] font-heading whitespace-nowrap">
        {t.catalog.sort.by}
      </label>
      <div className="relative inline-block">
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value as SortOption)}
          className="appearance-none bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-lg ps-3 pe-10 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent cursor-pointer transition-colors min-w-[200px]"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t.catalog.sort.options[option.key]}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
          <span className="text-[var(--text-muted)]">{ChevronDown}</span>
        </div>
      </div>
    </div>
  );
}
