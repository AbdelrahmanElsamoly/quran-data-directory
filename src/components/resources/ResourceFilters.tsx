'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n';
import type { ResourceType } from '@/types/resource';

const types: ResourceType[] = ['tafsir', 'sdk', 'dataset', 'library'];
const licenses = [
  { value: 'MIT', label: 'مفتوح بالكامل', en: 'Fully open', code: 'CC0', color: '#23c86b', bg: '#e5f8ec' },
  { value: 'CC-BY-4.0', label: 'مع إسناد', en: 'Attribution', code: 'CC BY', color: '#23c86b', bg: '#e5f8ec' },
  { value: 'CC-BY-SA-4.0', label: 'إسناد ومشاركة بالمثل', en: 'Attribution share-alike', code: 'CC BY-SA', color: '#e4c628', bg: '#fbf5d8' },
  { value: 'CC-BY-SA-3.0', label: 'إسناد بلا اشتقاق', en: 'Attribution no derivatives', code: 'CC BY-SA', color: '#e4c628', bg: '#fbf5d8' },
  { value: 'CC-BY-NC-4.0', label: 'إسناد واستخدام غير تجاري', en: 'Non-commercial', code: 'CC BY-NC-SA', color: '#ec4b52', bg: '#fde8e8' },
  { value: 'custom', label: 'إسناد غير تجاري ومشاركة بالمثل', en: 'Custom license', code: 'CC BY-NC-ND', color: '#ec4b52', bg: '#fde8e8' },
];

function FilterIcon({ type }: { type: ResourceType }) {
  if (type === 'library') return <path d="M6 4h12v16H6zM9 8h6M9 12h6" />;
  if (type === 'dataset') return <><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 10h16M10 5v14"/></>;
  if (type === 'sdk') return <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>;
  return <><path d="M12 3v18M5 7l14 10M19 7 5 17"/></>;
}

export function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useLanguage();
  const selectedType = searchParams.get('type') || '';
  const selectedLicense = searchParams.get('license') || '';
  const hasFilters = Boolean(selectedType || selectedLicense || searchParams.get('itqan_badge'));

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || params.get(key) === value) params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('type');
    params.delete('license');
    params.delete('itqan_badge');
    params.delete('page');
    router.push(`/resources?${params.toString()}`);
  };

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-[18px] bg-[#fafafa] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">{locale === 'ar' ? 'الفلاتر' : 'Filters'}</h2>
            <p className="mt-1 text-xs text-[#aaa]">
              {locale === 'ar' ? 'الفلترة حسب المعلومات التالية' : 'Filter using the options below'}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#c9c9c9] transition hover:bg-white hover:text-black disabled:opacity-40"
            aria-label={locale === 'ar' ? 'مسح الفلاتر' : 'Clear filters'}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13" />
            </svg>
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-black">{locale === 'ar' ? 'الناشر' : 'Publisher'}</h3>
          <button type="button" className="mt-3 flex h-11 w-full items-center justify-between rounded-full bg-white px-4 text-xs text-[#888]">
            <span>{locale === 'ar' ? 'اختر الناشر' : 'Choose publisher'}</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>

        <div className="mt-7">
          <h3 className="text-sm font-black">{locale === 'ar' ? 'نوع المورد' : 'Resource type'}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateParam('type', type)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                  selectedType === type
                    ? 'border-black bg-white text-black shadow-sm'
                    : 'border-transparent bg-white/70 text-[#777] hover:border-[#ddd]'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <FilterIcon type={type} />
                </svg>
                {t.catalog.types[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-black">{locale === 'ar' ? 'التراخيص' : 'Licenses'}</h3>
          <div className="mt-4 space-y-3">
            {licenses.map((item) => {
              const active = selectedLicense === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => updateParam('license', item.value)}
                  className="flex w-full items-center justify-between gap-2 text-start"
                >
                  <span className="flex items-center gap-2 text-[11px] font-medium text-[#666]">
                    <span className={`h-3.5 w-3.5 rounded-[3px] border ${active ? 'border-black bg-black' : 'border-[#ddd] bg-white'}`}>
                      {active && (
                        <svg className="h-full w-full text-white" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}><path d="m3 8 3 3 7-7"/></svg>
                      )}
                    </span>
                    {locale === 'ar' ? item.label : item.en}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded px-2 py-1 text-[8px] font-black text-[#777]" style={{ backgroundColor: item.bg }}>
                    {item.code}
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
