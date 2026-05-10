'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n';
import { useState, useRef, useEffect } from 'react';
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
  const { t, direction } = useLanguage();
  const isRtl = direction === 'rtl';
  const currentSort = (searchParams.get('sort') || 'relevance') as SortOption;

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevance') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentOption = sortOptions.find((o) => o.value === currentSort);
  const selectedLabel = currentOption
    ? t.catalog.sort.options[currentOption.key]
    : t.catalog.sort.options.relevance;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-trigger" className="text-sm text-[var(--text-muted)] font-heading whitespace-nowrap">
        {t.catalog.sort.by}
      </label>
      <div className="relative inline-block" ref={containerRef}>
        <button
          id="sort-trigger"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent cursor-pointer transition-colors min-w-[200px] justify-between"
        >
          <span className="truncate">{selectedLabel}</span>
          <span className="shrink-0 text-[var(--text-muted)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {open && (
          <div
            className={`absolute z-50 mt-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-lg overflow-hidden ${isRtl ? 'right-0' : 'left-0'}`}
            style={{ minWidth: '200px' }}
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-start px-3 py-2.5 text-sm transition-colors ${
                  currentSort === option.value
                    ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t.catalog.sort.options[option.key]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
