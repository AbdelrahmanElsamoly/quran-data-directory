# Trusted By Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the "Trusted By" section on the resource detail page with a compact centered row of round avatars, smooth expand/collapse, and clickable logos.

**Architecture:** Replace the current grid-of-bordered-cards pattern with a new `ConsumerAvatar` component (round avatars, clickable) and refactor `TrustedBySection` to show 3 featured consumers in a centered row with a smooth "Show all / Show less" expand. Remove the now-unnecessary `ConsumerGrid` and `ConsumerCard` components.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS 3, Vitest, Testing Library React

---

### Task 1: Create ConsumerAvatar Component

**Files:**
- Create: `src/components/resources/ConsumerAvatar.tsx`

This component renders a single consumer as a round avatar. It handles logo vs initials fallback, clickable links, and hover effects.

- [ ] **Step 1: Create the ConsumerAvatar component**

Create `src/components/resources/ConsumerAvatar.tsx`:

```tsx
'use client';

import { useState } from 'react';
import type { Consumer } from '@/types/resource';

interface ConsumerAvatarProps {
  consumer: Consumer;
  size: 'featured' | 'expanded';
}

const sizeMap = {
  featured: {
    avatar: 'h-13 w-13 text-lg',    // 52px
    gap: 'gap-2',
  },
  expanded: {
    avatar: 'h-9 w-9 text-sm',      // 36px
    gap: 'gap-1.5',
  },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

export function ConsumerAvatar({ consumer, size }: ConsumerAvatarProps) {
  const [logoError, setLogoError] = useState(false);
  const sizes = sizeMap[size];
  const gradient = gradientColors[consumer.name.charCodeAt(0) % gradientColors.length];
  const initials = getInitials(consumer.name);
  const isClickable = consumer.website_url && consumer.website_url.startsWith('http');

  const avatarContent = consumer.logo_url && !logoError ? (
    <img
      src={consumer.logo_url}
      alt={`${consumer.name} logo`}
      className={`rounded-full object-cover ${sizes.avatar}`}
      onError={() => setLogoError(true)}
    />
  ) : (
    <span className={`rounded-full font-bold text-white ${sizes.avatar}`}>{initials}</span>
  );

  const wrapperClasses = `
    flex flex-col items-center transition-transform duration-200 hover:scale-105
  `;

  if (isClickable) {
    return (
      <a
        href={consumer.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClasses}
      >
        <div
          className={`rounded-full bg-gradient-to-br ${gradient} shadow-sm ${sizes.avatar}`}
        >
          {avatarContent}
        </div>
        <span className={`font-medium text-[var(--text-primary)] ${size === 'featured' ? 'text-xs' : 'text-[10px]'}`}>
          {consumer.name}
        </span>
        {size === 'featured' && consumer.category && (
          <span className="text-[9px] text-[var(--text-muted)]">{consumer.category}</span>
        )}
      </a>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div
        className={`rounded-full bg-gradient-to-br ${gradient} shadow-sm ${sizes.avatar}`}
      >
        {avatarContent}
      </div>
      <span className={`font-medium text-[var(--text-primary)] ${size === 'featured' ? 'text-xs' : 'text-[10px]'}`}>
        {consumer.name}
      </span>
      {size === 'featured' && consumer.category && (
        <span className="text-[9px] text-[var(--text-muted)]">{consumer.category}</span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No errors related to the new file.

- [ ] **Step 3: Commit**

```bash
git add src/components/resources/ConsumerAvatar.tsx
git commit -m "feat: add ConsumerAvatar component with round avatars and clickable links"
```

---

### Task 2: Refactor TrustedBySection

**Files:**
- Modify: `src/components/resources/TrustedBySection.tsx`

Replace the entire component with the new layout: 3 featured consumers in a centered row + expandable remaining consumers.

- [ ] **Step 1: Rewrite TrustedBySection**

Replace the entire contents of `src/components/resources/TrustedBySection.tsx` with:

```tsx
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
```

- [ ] **Step 2: Add fade-in animation to Tailwind config**

Check if `tailwind.config.ts` or `tailwind.config.js` exists and add the animation:

```bash
cat /home/muhammad/Work/itqan/quran-data-directory/tailwind.config.ts 2>/dev/null || cat /home/muhammad/Work/itqan/quran-data-directory/tailwind.config.js 2>/dev/null
```

Add to the `theme.extend` section (create the file if it doesn't exist):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npx tsc --noEmit --pretty 2>&1 | head -20
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/resources/TrustedBySection.tsx
git commit -m "feat: redesign TrustedBySection with compact row and smooth expand"
```

---

### Task 3: Update i18n Messages

**Files:**
- Modify: `src/i18n/messages/en.ts`
- Modify: `src/i18n/messages/ar.ts`

- [ ] **Step 1: Update English messages**

In `src/i18n/messages/en.ts`, find the `resource.detail` section and make these changes:

Change:
```ts
trustedBy: 'Used By',
```
To:
```ts
trustedBy: 'Trusted By',
```

Change:
```ts
showMore: 'Show more',
```
To:
```ts
showMore: 'Show all {{count}}',
```

- [ ] **Step 2: Update Arabic messages**

In `src/i18n/messages/ar.ts`, find the `resource.detail` section and make these changes:

Change:
```ts
trustedBy: 'يُستخدم بواسطة',
```
To:
```ts
trustedBy: 'موثوق من قبل',
```

Change:
```ts
showMore: 'عرض المزيد',
```
To:
```ts
showMore: 'عرض الكل ({{count}})',
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/messages/en.ts src/i18n/messages/ar.ts
git commit -m "i18n: update trusted by heading and show more text"
```

---

### Task 4: Remove ConsumerGrid and ConsumerCard

**Files:**
- Delete: `src/components/resources/ConsumerGrid.tsx`
- Delete: `src/components/resources/ConsumerCard.tsx`
- Delete: `src/__tests__/ConsumerGrid.test.tsx`
- Delete: `src/__tests__/ConsumerCard.test.tsx`

These components are no longer used after the TrustedBySection refactor.

- [ ] **Step 1: Remove unused files**

```bash
rm /home/muhammad/Work/itqan/quran-data-directory/src/components/resources/ConsumerGrid.tsx
rm /home/muhammad/Work/itqan/quran-data-directory/src/components/resources/ConsumerCard.tsx
rm /home/muhammad/Work/itqan/quran-data-directory/src/__tests__/ConsumerGrid.test.tsx
rm /home/muhammad/Work/itqan/quran-data-directory/src/__tests__/ConsumerCard.test.tsx
```

- [ ] **Step 2: Verify no remaining imports**

```bash
grep -rn "ConsumerGrid\|ConsumerCard" /home/muhammad/Work/itqan/quran-data-directory/src --include="*.tsx" --include="*.ts" | grep -v "__tests__"
```

Expected: No output (no remaining references).

- [ ] **Step 3: Commit**

```bash
git rm src/components/resources/ConsumerGrid.tsx src/components/resources/ConsumerCard.tsx src/__tests__/ConsumerGrid.test.tsx src/__tests__/ConsumerCard.test.tsx
git commit -m "refactor: remove ConsumerGrid and ConsumerCard (replaced by ConsumerAvatar)"
```

---

### Task 5: Update Tests

**Files:**
- Modify: `src/__tests__/TrustedBySection.test.tsx`

The existing tests need to be updated to match the new component structure. The new component:
- Renders null for empty consumers (unchanged)
- Shows "Trusted By" heading (updated from "Used By" / "يُستخدم بواسطة")
- Shows 3 featured consumers
- Shows "Show all N" / "Show less" trigger
- Shows expanded consumers when toggled

- [ ] **Step 1: Rewrite TrustedBySection tests**

Replace the entire contents of `src/__tests__/TrustedBySection.test.tsx` with:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrustedBySection } from '@/components/resources/TrustedBySection';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: i % 2 === 0 ? 'Enterprise' : 'Platform',
  }));

function renderWithProvider(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('TrustedBySection', () => {
  it('renders null when consumers is empty', () => {
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and count when consumers exist', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    // English locale (default)
    expect(screen.getByText('Trusted By')).toBeTruthy();
    expect(screen.getByText('Trusted by 5 applications')).toBeTruthy();
  });

  it('renders exactly 3 featured consumers', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('Consumer 1')).toBeTruthy();
    expect(screen.getByText('Consumer 2')).toBeTruthy();
    expect(screen.getByText('Consumer 3')).toBeTruthy();
    // Consumer 4 and 5 should NOT be visible initially
    expect(screen.queryByText('Consumer 4')).toBeNull();
    expect(screen.queryByText('Consumer 5')).toBeNull();
  });

  it('shows expand trigger when there are more than 3 consumers', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('Show all 2 →')).toBeTruthy();
  });

  it('does not show expand trigger when 3 or fewer consumers', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.queryByText(/Show all/)).toBeNull();
  });

  it('expands to show all consumers on click', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    fireEvent.click(screen.getByText('Show all 2 →'));
    expect(screen.getByText('Consumer 4')).toBeTruthy();
    expect(screen.getByText('Consumer 5')).toBeTruthy();
    expect(screen.getByText('Show less')).toBeTruthy();
  });

  it('collapses back to featured only on second click', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    fireEvent.click(screen.getByText('Show all 2 →'));
    expect(screen.getByText('Consumer 4')).toBeTruthy();
    fireEvent.click(screen.getByText('Show less'));
    expect(screen.queryByText('Consumer 4')).toBeNull();
    expect(screen.queryByText('Consumer 5')).toBeNull();
    expect(screen.getByText('Show all 2 →')).toBeTruthy();
  });

  it('renders category labels for featured consumers', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('Enterprise')).toBeTruthy();
    expect(screen.getByText('Platform')).toBeTruthy();
  });

  it('renders consumer avatars as links', () => {
    const consumers = makeConsumers(1);
    renderWithProvider(<TrustedBySection consumers={consumers} />);
    const link = screen.getByText('Consumer 1').closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://consumer1.app');
    expect(link?.getAttribute('target')).toBe('_blank');
  });
});
```

- [ ] **Step 2: Run the tests**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npm run test:run src/__tests__/TrustedBySection.test.tsx
```

Expected: All 9 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/TrustedBySection.test.tsx
git commit -m "test: update TrustedBySection tests for new layout"
```

---

### Task 6: Final Verification

**Files:**
- N/A (verification only)

- [ ] **Step 1: Run full test suite**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npm run test:run
```

Expected: All tests pass, including the updated TrustedBySection tests and no ConsumerGrid/ConsumerCard test errors.

- [ ] **Step 2: Run TypeScript check**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npx tsc --noEmit --pretty
```

Expected: No errors.

- [ ] **Step 3: Run linter**

```bash
cd /home/muhammad/Work/itqan/quran-data-directory && npm run lint
```

Expected: No new errors.

- [ ] **Step 4: Commit any remaining changes**

```bash
git add -A
git status
```

If there are no uncommitted changes beyond what's already staged, this step is a no-op. Otherwise:

```bash
git commit -m "chore: final verification and cleanup"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task |
|---|---|
| Heading "TRUSTED BY" uppercase | Task 2 |
| Subtitle "Trusted by N applications" | Task 2 |
| 3 featured consumers in centered row | Task 2 |
| Round avatars with gradient backgrounds | Task 1 |
| Clickable logos linking to websites | Task 1 |
| "Show all N →" / "Show less" trigger | Task 2 |
| Smooth fade-in animation | Task 2 (Tailwind config) |
| Responsive wrapping row | Task 2 (Tailwind classes) |
| Category labels on featured only | Task 1 |
| i18n: "Trusted By" / "موثوق من قبل" | Task 3 |
| i18n: "Show all N" / "عرض الكل" | Task 3 |
| Remove ConsumerGrid | Task 4 |
| Remove ConsumerCard | Task 4 |
| Update tests | Task 5 |
