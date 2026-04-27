'use client';

import { formatDate } from '@/lib/utils';
import type { GithubStats } from '@/types/resource';
import { useLanguage } from '@/i18n';

interface GithubStatsCardProps {
  githubUrl: string;
  stats: GithubStats | null;
}

export function GithubStatsCard({ githubUrl, stats }: GithubStatsCardProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold">{t.resource.githubStats.title}</h2>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {t.resource.githubStats.viewOnGithub}
        </a>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Stars */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.stars}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.stars}</dd>
          </div>

          {/* Forks */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.forks}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.forks}</dd>
          </div>

          {/* Open Issues */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.openIssues}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.open_issues}</dd>
          </div>

          {/* Last Commit */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.lastCommit}</dt>
            <dd className="text-sm font-medium text-[var(--text-primary)]">{formatDate(stats.last_commit, locale)}</dd>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-muted)] mb-3">{t.resource.githubStats.statsUnavailable}</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent-primary)] hover:underline"
          >
            {t.resource.githubStats.viewOnGithub} &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
