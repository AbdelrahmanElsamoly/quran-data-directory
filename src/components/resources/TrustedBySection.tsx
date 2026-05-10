'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n';
import type { Consumer } from '@/types/resource';
import { ConsumerAvatar } from './ConsumerAvatar';

const FEATURED_COUNT = 3;

interface TrustedBySectionProps {
  consumers: Consumer[];
}

export function TrustedBySection({ consumers }: TrustedBySectionProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  if (!consumers || consumers.length === 0) {
    return null;
  }

  const featured = consumers.slice(0, FEATURED_COUNT);
  const remaining = consumers.slice(FEATURED_COUNT);

  return (
    <div className="mb-6">
      <h2 className="font-heading text-sm font-semibold mb-1 tracking-wider uppercase text-[var(--text-muted)] text-center">
        {t.resource.detail.trustedBy}
      </h2>
      <p className="text-xs text-[var(--text-muted)] mb-4 text-center">
        {t.resource.detail.trustedByCount.replace('{{count}}', String(consumers.length))}
      </p>

      {/* Featured consumers */}
      <div className="flex flex-wrap justify-center gap-7">
        {featured.map((consumer) => (
          <ConsumerAvatar key={consumer.name} consumer={consumer} size="featured" />
        ))}
      </div>

      {/* Expand / Collapse trigger */}
      {remaining.length > 0 && (
        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-[var(--accent-primary)] border-b border-dashed border-[var(--accent-primary)] pb-0.5 hover:text-[var(--accent-primary)]/80 transition-colors"
          >
            {expanded
              ? t.resource.detail.showLess
              : `${t.resource.detail.showMore.replace('{{count}}', String(remaining.length))} →`}
          </button>
        </div>
      )}

      {/* Expanded consumers */}
      {expanded && remaining.length > 0 && (
        <div className="flex flex-wrap justify-center gap-5 mt-4 pt-4 border-t border-[var(--border-color)] animate-fade-in">
          {remaining.map((consumer) => (
            <ConsumerAvatar key={consumer.name} consumer={consumer} size="expanded" />
          ))}
        </div>
      )}
    </div>
  );
}
