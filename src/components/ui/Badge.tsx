'use client';

import type { ResourceType } from '@/types/resource';
import { useTranslations } from '@/i18n';

interface BadgeProps {
  type: ResourceType;
  className?: string;
}

export function ResourceBadge({ type, className }: BadgeProps) {
  const t = useTranslations();

  const styles: Record<ResourceType, string> = {
    library: 'bg-blue-100 text-blue-800',
    sdk: 'bg-purple-100 text-purple-800',
    dataset: 'bg-teal-100 text-teal-800',
    api: 'bg-orange-100 text-orange-800',
    tafsir: 'bg-amber-100 text-amber-800',
  };

  const labels: Record<ResourceType, string> = {
    library: t.catalog.types.library,
    sdk: t.catalog.types.sdk,
    dataset: t.catalog.types.dataset,
    api: t.catalog.types.api,
    tafsir: t.catalog.types.tafsir,
  };

  return (
    <span className={`badge ${styles[type]} ${className || ''}`}>
      {labels[type]}
    </span>
  );
}
