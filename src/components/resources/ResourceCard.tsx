'use client';

import Link from 'next/link';
import { ResourceBadge } from '@/components/ui/Badge';
import type { Resource } from '@/types/resource';
import { useTranslations } from '@/i18n';

interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}

function formatDownloads(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toString();
}

export function ResourceCard({ resource, rank, downloadCount }: ResourceCardProps) {
  const t = useTranslations();

  return (
    <article className="card group relative flex flex-col h-full overflow-hidden">
      {rank != null && (
        <div
          className="flex items-center justify-center bg-[var(--accent-primary)] text-white py-3 text-xl font-bold"
          aria-label={`Rank ${rank}`}
          dir="ltr"
        >
          #{rank}
        </div>
      )}
      <Link
        href={`/resources/${resource.slug}`}
        className="flex flex-col flex-grow p-3 hover:bg-[var(--bg-secondary)] transition-colors no-underline"
      >
        <div className="flex items-center gap-2 mb-2">
          <ResourceBadge type={resource.type} />
          {resource.itqan_badge && (
            <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)]" title="Itqan Verified">
              {t.resource.itqanBadge}
            </span>
          )}
        </div>

        <h3 className="font-heading font-semibold text-sm mb-1.5 leading-snug text-[var(--text-primary)]">
          {resource.name}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2 flex-grow">
          {resource.short_description || resource.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {downloadCount != null && (
              <span className="text-xs text-[var(--text-muted)] inline-flex items-center gap-1 leading-none">
                <svg className="w-3 h-3 self-center" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
                {formatDownloads(downloadCount)}
              </span>
            )}
            {downloadCount != null && resource.license && (
              <span className="text-[var(--text-muted)] text-xs">•</span>
            )}
            {resource.license && (
              <span className="text-xs text-[var(--text-muted)]">{resource.license}</span>
            )}
            {resource.license && resource.version && (
              <span className="text-[var(--text-muted)] text-xs">•</span>
            )}
            {resource.version && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
                {resource.version}
              </span>
            )}
          </div>
          {resource.github_url && (
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors ml-2 bg-transparent border-none p-0 cursor-pointer"
              title={t.resource.github}
              aria-label={t.resource.github}
              onClick={(e) => {
                e.stopPropagation();
                window.open(resource.github_url, '_blank', 'noopener,noreferrer');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </button>
          )}
        </div>
      </Link>
    </article>
  );
}
