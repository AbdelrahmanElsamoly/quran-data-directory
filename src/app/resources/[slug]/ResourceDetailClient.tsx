'use client';

import Link from 'next/link';
import { ResourceBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { AccessRequestButton } from '@/components/resources/AccessRequestButton';
import { RelatedResources } from '@/components/resources/RelatedResources';
import { CommentSection } from '@/components/resources/CommentSection';
import { ReportButton } from '@/components/resources/ReportButton';
import { ResourcePreview } from '@/components/resources/ResourcePreview';
import { usePreview } from '@/hooks/usePreview';
import { useLanguage } from '@/i18n';
import type { Resource } from '@/types/resource';

interface ResourceDetailClientProps {
  resource: Resource;
}

export function ResourceDetailClient({ resource }: ResourceDetailClientProps) {
  const { t, locale } = useLanguage();
  const { data: previewData, loading: previewLoading } = usePreview(resource.slug, resource.type);

  return (
    <div className="section-padding py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-[var(--text-muted)]">
          <li><Link href="/" className="hover:text-[var(--accent-primary)]">{t.resource.detail.home}</Link></li>
          <li>/</li>
          <li><Link href="/resources" className="hover:text-[var(--accent-primary)]">{t.resource.detail.resources}</Link></li>
          <li>/</li>
          <li className="text-[var(--text-primary)]">{resource.name}</li>
        </ol>
      </nav>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content (left in RTL = first column) */}
        <div className="lg:col-span-2">
          {/* Resource header */}
          <header className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <ResourceBadge type={resource.type} />
              {resource.itqan_badge && (
                <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)] text-sm" title="Itqan Verified">
                  ★ Itqan
                </span>
              )}
            </div>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
              {resource.name}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {t.catalog.types[resource.type]}
            </p>
          </header>

          {/* Preview Section */}
          <ResourcePreview
            resourceType={resource.type}
            previewData={previewData}
            loading={previewLoading}
          />

          {/* Description */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold mb-3">{t.resource.detail.description}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {resource.description}
            </p>
          </div>

          {/* Metadata */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold mb-4">{t.resource.detail.information}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.license}</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">{resource.license}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.type}</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">
                  {t.catalog.types[resource.type]}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.created}</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">
                  {formatDate(resource.created_at, locale)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.updated}</dt>
                <dd className="text-sm font-medium text-[var(--text-primary)]">
                  {formatDate(resource.updated_at, locale)}
                </dd>
              </div>
            </dl>

            {/* External links */}
            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex flex-wrap gap-3">
              {resource.documentation_url && (
                <a
                  href={resource.documentation_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.resource.detail.documentation}
                </a>
              )}
              {resource.github_url && (
                <a
                  href={resource.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Comments */}
          <CommentSection resourceId={resource.id} />

          {/* Related Resources */}
          <RelatedResources currentResourceId={resource.id} />
        </div>

        {/* Sidebar (right column in RTL) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Access request CTA */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">{t.resource.detail.accessRequest}</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                {t.resource.detail.accessRequestDescription}
              </p>
              <AccessRequestButton
                resourceSlug={resource.slug}
                resourceName={resource.name}
              />
            </div>

            {/* Report button */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">{t.resource.detail.reportModalTitle}</h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
                {t.resource.detail.reportTooltip}
              </p>
              <ReportButton
                resourceSlug={resource.slug}
                resourceName={resource.name}
              />
            </div>

            {/* Quick info card */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-5">
              <h3 className="font-heading font-semibold text-sm mb-3">{t.resource.detail.quickSummary}</h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center justify-between">
                  <span>{t.resource.detail.status}</span>
                  <span className="font-medium text-[var(--success)]">{t.resource.detail.published}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>{t.resource.detail.license}</span>
                  <span className="font-medium">{resource.license}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>{t.resource.detail.itqanCertified}</span>
                  <span className={`font-medium ${resource.itqan_badge ? 'text-[var(--accent-gold)]' : 'text-[var(--text-muted)]'}`}>
                    {resource.itqan_badge ? t.resource.detail.yes : t.resource.detail.no}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
