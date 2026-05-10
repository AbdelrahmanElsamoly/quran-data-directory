'use client';

import { useState } from 'react';
import { useLanguage } from '@/i18n';
import type { Consumer } from '@/types/resource';
import { ConsumerCard } from './ConsumerCard';

const VISIBLE_COUNT = 6;

interface ConsumerGridProps {
  consumers: Consumer[];
}

export function ConsumerGrid({ consumers }: ConsumerGridProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const shouldShowPlaceholder = consumers.length > VISIBLE_COUNT;
  const displayedConsumers = expanded ? consumers : consumers.slice(0, VISIBLE_COUNT);

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {displayedConsumers.map((consumer, index) => (
          <ConsumerCard key={consumer.name} consumer={consumer} index={index} />
        ))}

        {shouldShowPlaceholder && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-center transition-colors hover:border-[var(--accent-primary)]"
          >
            <span className="text-2xl font-bold text-[var(--text-muted)]">+</span>
            <span className="text-sm font-medium text-[var(--text-muted)]">
              +{consumers.length - VISIBLE_COUNT}
            </span>
          </button>
        )}
      </div>

      {expanded && consumers.length > VISIBLE_COUNT && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="border border-[var(--border-color)] bg-transparent text-[var(--text-muted)] rounded-lg px-4 py-2 text-xs transition-colors hover:text-[var(--text-primary)]"
          >
            {t.resource.detail.showLess}
          </button>
        </div>
      )}
    </div>
  );
}
