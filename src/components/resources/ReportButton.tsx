'use client';

import { useState } from 'react';
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
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) {
    return (
      <Link href={`/login?redirect=/resources/${resourceSlug}`} className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f7f7f7] text-xs font-black text-black transition hover:bg-[#ededed]">
        <FlagIcon />
        {locale === 'ar' ? 'إبلاغ عن هذا المورد' : 'Report this resource'}
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)} className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f7f7f7] text-xs font-black text-black transition hover:bg-[#ededed]">
        <FlagIcon />
        {locale === 'ar' ? 'إبلاغ عن هذا المورد' : 'Report this resource'}
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

function FlagIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M5 21V5m0 0c5-3 9 3 14 0v10c-5 3-9-3-14 0"/></svg>;
}
