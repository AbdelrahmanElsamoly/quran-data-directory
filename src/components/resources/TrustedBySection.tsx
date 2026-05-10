'use client';

import { useLanguage } from '@/i18n';
import type { Consumer } from '@/types/resource';
import { ConsumerGrid } from './ConsumerGrid';

interface TrustedBySectionProps {
  consumers: Consumer[];
}

export function TrustedBySection({ consumers }: TrustedBySectionProps) {
  const { t } = useLanguage();

  if (!consumers || consumers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="font-heading text-lg font-semibold mb-4 text-[var(--text-primary)]">
        {t.resource.detail.trustedBy}
      </h2>
      <p className="text-xs text-[var(--text-muted)] mb-4">
        {t.resource.detail.trustedByCount.replace('{{count}}', String(consumers.length))}
      </p>
      <ConsumerGrid consumers={consumers} />
    </div>
  );
}
