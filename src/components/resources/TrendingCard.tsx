'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { ResourceBadge } from '@/components/ui/Badge';
import type { TrendingResource } from '@/types/announcement';

interface TrendingCardProps {
  resource: TrendingResource;
  rank: 1 | 2 | 3;
}

export default function TrendingCard({ resource, rank }: TrendingCardProps) {
  const t = useTranslations();

  const rankBadge = (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold shrink-0"
      aria-label={`Rank ${rank}`}
    >
      #{rank}
    </span>
  );

  const downloadCount = resource.downloads.toLocaleString();

  return (
    <div className="card group relative flex flex-col justify-between p-5">
      <div className="flex items-start gap-3 mb-3">
        {rankBadge}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <ResourceBadge type={resource.type as never} />
          </div>
          <h3 className="font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
            {resource.name}
          </h3>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
        {resource.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
        <span>{downloadCount} {t.trending.downloads.replace('{{count}}', '')}</span>
        {resource.version && <span>• {t.resource.version} {resource.version}</span>}
        {resource.license && <span>• {resource.license}</span>}
      </div>

      <Link
        href={`/resources/${resource.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] hover:underline mt-auto"
      >
        {t.trending.viewResource}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
