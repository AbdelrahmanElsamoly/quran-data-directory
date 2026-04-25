'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslations } from '@/i18n';
import type { ResourceType } from '@/types/resource';

type TypeKey = 'library' | 'sdk' | 'dataset' | 'api' | 'tafsir';

const resourceTypeKeys: { value: ResourceType; key: TypeKey }[] = [
  { value: 'library', key: 'library' },
  { value: 'sdk', key: 'sdk' },
  { value: 'dataset', key: 'dataset' },
  { value: 'api', key: 'api' },
  { value: 'tafsir', key: 'tafsir' },
];

const licenseOptions = [
  { value: 'MIT', label: 'MIT' },
  { value: 'Apache-2.0', label: 'Apache 2.0' },
  { value: 'GPL-3.0', label: 'GPL 3.0' },
  { value: 'BSD-3-Clause', label: 'BSD 3-Clause' },
  { value: 'CC-BY-4.0', label: 'CC BY 4.0' },
  { value: 'CC-BY-SA-4.0', label: 'CC BY-SA 4.0' },
  { value: 'CC-BY-SA-3.0', label: 'CC BY-SA 3.0' },
  { value: 'CC-BY-NC-4.0', label: 'CC BY-NC 4.0' },
  { value: 'custom', label: 'Custom/Proprietary' },
];

export function ResourceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [type, setType] = useState(searchParams.get('type') || '');
  const [license, setLicense] = useState(searchParams.get('license') || '');
  const [badge, setBadge] = useState(searchParams.get('itqan_badge') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (license) params.set('license', license);
    if (badge) params.set('itqan_badge', badge);
    if (searchParams.get('search')) params.set('search', searchParams.get('search')!);
    router.push(`/resources?${params.toString()}`);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, license, badge]);

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-20 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-5">
        <h2 className="font-heading font-semibold text-sm text-[var(--text-primary)] mb-4">
          {t.catalog.filters.title}
        </h2>

        {/* Resource Type */}
        <div className="mb-5">
          <h3 className="text-xs font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t.catalog.filters.type}
          </h3>
          <div className="space-y-2">
            {resourceTypeKeys.map((rt) => (
              <label key={rt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value={rt.value}
                  checked={type === rt.value}
                  onChange={() => setType(rt.value)}
                  className="w-4 h-4 text-[var(--accent-primary)] border-[var(--border-color)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {t.catalog.types[rt.key]}
                </span>
              </label>
            ))}
            {type && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value=""
                  checked={type === ''}
                  onChange={() => setType('')}
                  className="w-4 h-4 text-[var(--accent-primary)] border-[var(--border-color)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  {t.catalog.filters.allTypes}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* License */}
        <div className="mb-5">
          <h3 className="text-xs font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t.catalog.filters.license}
          </h3>
          <div className="space-y-2">
            {licenseOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="license"
                  value={opt.value}
                  checked={license === opt.value}
                  onChange={() => setLicense(opt.value)}
                  className="w-4 h-4 text-[var(--accent-primary)] border-[var(--border-color)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
            {license && (
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="license"
                  value=""
                  checked={license === ''}
                  onChange={() => setLicense('')}
                  className="w-4 h-4 text-[var(--accent-primary)] border-[var(--border-color)] focus:ring-[var(--accent-primary)]"
                />
                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
                  {t.catalog.filters.allLicenses}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Itqan Badge */}
        <div className="mb-2">
          <h3 className="text-xs font-heading font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {t.catalog.filters.itqanBadge}
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="badge"
                value="true"
                checked={badge === 'true'}
                onChange={() => setBadge('true')}
                className="w-4 h-4 text-[var(--accent-gold)] border-[var(--border-color)] focus:ring-[var(--accent-gold)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">{t.catalog.filters.verifiedOnly}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="badge"
                value="false"
                checked={badge === 'false'}
                onChange={() => setBadge('false')}
                className="w-4 h-4 text-[var(--accent-gold)] border-[var(--border-color)] focus:ring-[var(--accent-gold)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">{t.catalog.filters.notVerified}</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
