'use client';

import type { Consumer } from '@/types/resource';

interface ConsumerCardProps {
  consumer: Consumer;
  index: number;
}

const gradientColors = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-500 to-amber-700',
  'from-violet-500 to-violet-700',
  'from-red-500 to-red-700',
  'from-cyan-500 to-cyan-700',
  'from-pink-500 to-pink-700',
  'from-teal-500 to-teal-700',
  'from-orange-500 to-orange-700',
  'from-indigo-500 to-indigo-700',
  'from-lime-500 to-lime-700',
  'from-purple-500 to-purple-700',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ConsumerCard({ consumer, index }: ConsumerCardProps) {
  const gradient = gradientColors[index % gradientColors.length];

  const isClickable = consumer.website_url && consumer.website_url.startsWith('http');

  const cardContent = (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg font-bold text-white`}
      >
        {consumer.logo_url ? (
          <img
            src={consumer.logo_url}
            alt={`${consumer.name} logo`}
            className="h-full w-full rounded-xl object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              // Replace image with initials by setting parent content
              const parent = target.parentElement;
              if (parent) {
                parent.textContent = getInitials(consumer.name);
              }
            }}
          />
        ) : (
          getInitials(consumer.name)
        )}
      </div>
      <div>
        <p className="font-medium text-sm text-[var(--text-primary)]">{consumer.name}</p>
        {consumer.category && (
          <p className="text-xs text-[var(--text-muted)]">{consumer.category}</p>
        )}
      </div>
    </div>
  );

  if (isClickable) {
    return (
      <a
        href={consumer.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-center transition-colors hover:border-[var(--accent-primary)]"
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-center">
      {cardContent}
    </div>
  );
}
