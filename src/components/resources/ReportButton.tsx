'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';
import { ReportModal } from './ReportModal';

interface ReportButtonProps {
  resourceSlug: string;
  resourceName: string;
  onReportSubmitted?: () => void;
}

export function ReportButton({ resourceSlug, resourceName, onReportSubmitted }: ReportButtonProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !user) {
    return (
      <Link href={`/login?redirect=/resources/${resourceSlug}`} className="btn-outline block text-center text-sm py-2.5 px-4">
        {t.resource.detail.loginToReport}
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="block text-center text-sm py-2.5 px-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--danger)] text-white hover:bg-[rgba(220,38,38,0.9)] transition-colors duration-200"
        title={t.resource.detail.reportTooltip}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8l-4-3H7L3 21z" />
        </svg>
        {t.resource.detail.report}
      </button>

      {modalOpen && (
        <ReportModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={onReportSubmitted}
          resourceSlug={resourceSlug}
          resourceName={resourceName}
        />
      )}
    </>
  );
}
