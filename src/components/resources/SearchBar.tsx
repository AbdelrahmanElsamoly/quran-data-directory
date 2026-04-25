'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n';

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const { locale } = useLanguage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('search', query.trim());
    }
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locale === 'ar' ? 'ابحث في الموارد...' : 'Search resources...'}
          className="input-field ps-12 pe-4"
        />
        <button
          type="submit"
          className="absolute inset-y-0 start-0 flex items-center px-4 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}
