'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n';

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguage();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) params.set('search', query.trim());
    else params.delete('search');
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" dir="ltr">
      <div className="flex h-14 items-center rounded-full bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.03)] sm:h-16">
        <button
          type="submit"
          className="h-full shrink-0 rounded-full bg-black px-6 text-sm font-black text-white transition hover:bg-[#171717] sm:px-8"
        >
          {locale === 'ar' ? 'ابحث' : 'Search'}
        </button>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={locale === 'ar' ? 'البحث في الموارد' : 'Search resources'}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-5 text-right text-sm text-black outline-none placeholder:text-[#777] focus:ring-0"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>
    </form>
  );
}
