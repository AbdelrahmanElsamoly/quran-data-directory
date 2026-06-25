'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n';
import type { SortOption } from '@/types/resource';

export function SortControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { direction, t } = useLanguage();
  const currentSort = (searchParams.get('sort') || 'relevance') as SortOption;
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const options: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: t.catalog.sort.options.relevance },
    { value: 'downloads', label: t.catalog.sort.options.downloads },
    { value: 'newest', label: t.catalog.sort.options.newest },
    { value: 'oldest', label: t.catalog.sort.options.oldest },
    { value: 'name_asc', label: t.catalog.sort.options.name_asc },
    { value: 'name_desc', label: t.catalog.sort.options.name_desc },
  ];
  const selectedOption = options.find((option) => option.value === currentSort) ?? options[0];

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  const handleChange = (value: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'relevance') params.delete('sort');
    else params.set('sort', value);
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative w-fit" dir={direction}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="group inline-flex min-w-[210px] items-center gap-3 rounded-xl border border-[#e7e7e7] bg-white px-4 py-3 text-start shadow-[0_4px_18px_rgba(0,0,0,0.04)] transition hover:border-[#cfcfcf] hover:shadow-[0_7px_22px_rgba(0,0,0,0.07)] focus:outline-none focus:ring-2 focus:ring-black/10"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f3f5f4] text-black">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M8 7h12M4 7h.01M12 12h8M4 12h4M16 17h4M4 17h8" />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold uppercase tracking-wide text-[#999]">
            {t.catalog.sort.by}
          </span>
          <span className="mt-0.5 block truncate text-sm font-black text-black">{selectedOption.label}</span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-[#777] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t.catalog.sort.by}
          className="absolute start-0 z-30 mt-2 w-full min-w-[210px] overflow-hidden rounded-xl border border-[#e7e7e7] bg-white p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.13)]"
        >
          {options.map((option) => {
            const isSelected = option.value === currentSort;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleChange(option.value)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                  isSelected ? 'bg-black text-white' : 'text-[#555] hover:bg-[#f5f6f5] hover:text-black'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
