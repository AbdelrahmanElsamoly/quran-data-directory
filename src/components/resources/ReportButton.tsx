'use client';

import { useLanguage } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ReportModal } from './ReportModal';

interface ReportButtonProps {
  resourceSlug: string;
  resourceName: string;
  onReportSubmitted?: () => void;
}

export function ReportButton({ resourceSlug, resourceName, onReportSubmitted }: ReportButtonProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => {
    if (!user) {
      router.push(`/login?redirect=/resources/${resourceSlug}`);
      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs text-[var(--text-muted)] hover:text-[var(--error)] inline-flex items-center gap-1.5 transition-colors"
        title={t.resource.detail.reportTooltip}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
