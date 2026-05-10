# Trusted By — Sidebar Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the "Trusted By" section from the main content column to the sidebar, show all consumers at once in a compact logo cloud, and add hover tooltips.

**Architecture:** Refactor `TrustedBySection` into a sidebar component that renders all consumers as 38px circular logos in a wrapped row. Add hover state to show name + category. Move the component invocation from the main column to the sidebar in `ResourceDetailClient`.

**Tech Stack:** React (Next.js App Router), Tailwind CSS, TypeScript, Vitest + React Testing Library

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/resources/TrustedBySection.tsx` | Rewrite: remove featured/expand logic, add hover tooltip, render all consumers as sidebar logos |
| `src/components/resources/ConsumerAvatar.tsx` | Add `size="sidebar"` variant (38px, no text below logo) |
| `src/app/resources/[slug]/ResourceDetailClient.tsx` | Move `<TrustedBySection>` from main column to sidebar |
| `src/__tests__/TrustedBySection.test.tsx` | Rewrite all tests for new sidebar behavior |

---

### Task 1: Add `sidebar` size to ConsumerAvatar

**Files:**
- Modify: `src/components/resources/ConsumerAvatar.tsx`

- [ ] **Step 1: Add `sidebar` size to sizeMap**

In `ConsumerAvatar.tsx`, add a `sidebar` entry to the `sizeMap` object (around line 11-20):

```typescript
const sizeMap = {
  featured: {
    avatar: 'h-13 w-13 text-lg',    // 52px
    gap: 'gap-2',
  },
  expanded: {
    avatar: 'h-9 w-9 text-sm',      // 36px
    gap: 'gap-1.5',
  },
  sidebar: {
    avatar: 'h-[38px] w-[38px] text-xs',  // 38px
    gap: 'gap-1',
  },
};
```

- [ ] **Step 2: Remove name/category text from ConsumerAvatar for sidebar size**

In the JSX return blocks (lines 70-106), the component currently always renders the consumer name and category below the avatar. For the `sidebar` size, these should NOT be rendered — the name/category will be shown in the hover tooltip instead.

Add a conditional check. In both the clickable (`<a>`) and non-clickable (`<div>`) return paths, wrap the name and category spans with a size check:

```tsx
// After the avatar div, replace the name rendering:
{size !== 'sidebar' && (
  <span className={`font-medium text-[var(--text-primary)] ${size === 'featured' ? 'text-xs' : 'text-[10px]'}`}>
    {consumer.name}
  </span>
)}
{size !== 'sidebar' && consumer.category && (
  <span className="text-[9px] text-[var(--text-muted)]">{consumer.category}</span>
)}
```

This means editing both return paths: the `<a>` block (lines 82-87) and the `<div>` block (lines 99-104).

- [ ] **Step 3: Run typecheck to verify no type errors**

```bash
npx tsc --noEmit
```

Expected: No errors.

---

### Task 2: Rewrite TrustedBySection as sidebar component

**Files:**
- Modify: `src/components/resources/TrustedBySection.tsx`

- [ ] **Step 1: Rewrite the entire component**

Replace the entire contents of `TrustedBySection.tsx` with the new sidebar implementation:

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import type { Consumer } from '@/types/resource';
import { ConsumerAvatar } from './ConsumerAvatar';

interface TrustedBySectionProps {
  consumers: Consumer[];
}

// Gradient colors for hover tooltip background
const gradientTones: Record<string, string> = {
  'from-blue-500': 'bg-blue-50 border-blue-200 text-blue-800',
  'from-emerald-500': 'bg-emerald-50 border-emerald-200 text-emerald-800',
  'from-amber-500': 'bg-amber-50 border-amber-200 text-amber-800',
  'from-violet-500': 'bg-violet-50 border-violet-200 text-violet-800',
  'from-red-500': 'bg-red-50 border-red-200 text-red-800',
  'from-cyan-500': 'bg-cyan-50 border-cyan-200 text-cyan-800',
  'from-pink-500': 'bg-pink-50 border-pink-200 text-pink-800',
  'from-teal-500': 'bg-teal-50 border-teal-200 text-teal-800',
  'from-orange-500': 'bg-orange-50 border-orange-200 text-orange-800',
  'from-indigo-500': 'bg-indigo-50 border-indigo-200 text-indigo-800',
  'from-lime-500': 'bg-lime-50 border-lime-200 text-lime-800',
  'from-purple-500': 'bg-purple-50 border-purple-200 text-purple-800',
};

function getGradientTone(consumerName: string): string {
  const gradientColors = [
    'from-blue-500', 'from-emerald-500', 'from-amber-500', 'from-violet-500',
    'from-red-500', 'from-cyan-500', 'from-pink-500', 'from-teal-500',
    'from-orange-500', 'from-indigo-500', 'from-lime-500', 'from-purple-500',
  ];
  return gradientColors[consumerName.charCodeAt(0) % gradientColors.length];
}

export function TrustedBySection({ consumers }: TrustedBySectionProps) {
  const { t } = useLanguage();
  const [hoveredName, setHoveredName] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!consumers || consumers.length === 0) {
    return null;
  }

  // Find the gradient tone for the currently hovered consumer
  const hoveredConsumer = consumers.find((c) => c.name === hoveredName);
  const gradientTone = hoveredConsumer ? getGradientTone(hoveredConsumer.name) : null;
  const tooltipStyle = gradientTone ? gradientTones[gradientTone] : 'bg-gray-50 border-gray-200 text-gray-800';

  return (
    <div
      ref={containerRef}
      className="border border-[var(--border-color)] rounded-xl p-4 bg-[var(--bg-card)] shadow-sm"
    >
      <h2 className="font-heading text-xs font-semibold text-center tracking-wider uppercase text-[var(--text-muted)] mb-1">
        {t.resource.detail.trustedBy}
      </h2>
      <p className="text-[10px] text-[var(--text-muted)] mb-3 text-center">
        {t.resource.detail.trustedByCount.replace('{{count}}', String(consumers.length))}
      </p>

      {/* Logo cloud */}
      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {consumers.map((consumer) => (
          <ConsumerAvatar
            key={consumer.name}
            consumer={consumer}
            size="sidebar"
            onMouseEnter={() => {
              setHoveredName(consumer.name);
              setHoveredCategory(consumer.category ?? null);
            }}
            onMouseLeave={() => {
              setHoveredName(null);
              setHoveredCategory(null);
            }}
          />
        ))}
      </div>

      {/* Hover tooltip card */}
      {hoveredName && (
        <div className={`mt-2.5 p-2.5 rounded-lg text-center border ${tooltipStyle} transition-opacity duration-150`}>
          <div className="text-sm font-semibold">{hoveredName}</div>
          {hoveredCategory && (
            <div className="text-[10px] opacity-80">{hoveredCategory}</div>
          )}
        </div>
      )}
    </div>
  );
}
```

Key changes from the old version:
- Removed `FEATURED_COUNT`, `useState(false)` for expand, `remaining`/`featured` slicing
- Removed expand/collapse button
- All consumers rendered in a single flex row
- Added `hoveredName`/`hoveredCategory` state for tooltip
- Added `onMouseEnter`/`onMouseLeave` props passed to `ConsumerAvatar`
- Added tooltip card below the logo cloud
- Added `gradientTones` mapping for tooltip background colors
- Added `getGradientTone` helper (mirrors ConsumerAvatar's gradient logic)
- Container styling: sidebar card with border, rounded corners, subtle shadow

- [ ] **Step 2: Update ConsumerAvatar to accept onMouseEnter/onMouseLeave props**

In `ConsumerAvatar.tsx`, add optional event handlers to the interface and pass them through:

```typescript
interface ConsumerAvatarProps {
  consumer: Consumer;
  size: 'featured' | 'expanded' | 'sidebar';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
```

Then add these handlers to the wrapper element (the `<a>` or `<div>` that wraps the avatar):

In the `<a>` block (around line 71-89), add to the `className` line:
```tsx
<a
  href={consumer.website_url}
  target="_blank"
  rel="noopener noreferrer"
  className={wrapperClasses}
  onMouseEnter={onMouseEnter}
  onMouseLeave={onMouseLeave}
>
```

In the `<div>` block (around line 93-106), add:
```tsx
<div
  className={wrapperClasses}
  onMouseEnter={onMouseEnter}
  onMouseLeave={onMouseLeave}
>
```

- [ ] **Step 3: Run typecheck to verify no type errors**

```bash
npx tsc --noEmit
```

Expected: No errors.

---

### Task 3: Move TrustedBySection to sidebar in ResourceDetailClient

**Files:**
- Modify: `src/app/resources/[slug]/ResourceDetailClient.tsx`

- [ ] **Step 1: Move the TrustedBySection from main column to sidebar**

In `ResourceDetailClient.tsx`, find the current TrustedBySection render (lines 148-151):

```tsx
{/* Trusted By */}
{resource.consumers && resource.consumers.length > 0 && (
  <TrustedBySection consumers={resource.consumers} />
)}
```

**Remove** this block from the main content area (after the GitHub Stats section, before Comments).

**Insert** it at the top of the sidebar `<aside>`, right after the opening `<div className="sticky top-6 space-y-6">` tag (after line 162):

```tsx
{/* Sidebar */}
<aside className="lg:col-span-1">
  <div className="sticky top-6 space-y-6">
    {/* Trusted By */}
    {resource.consumers && resource.consumers.length > 0 && (
      <TrustedBySection consumers={resource.consumers} />
    )}

    {/* Access request CTA */}
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-5">
```

The sidebar structure becomes: TrustedBy → AccessRequest → Report → QuickSummary.

- [ ] **Step 2: Verify the layout looks correct**

No automated test for this — manually verify by running the dev server:
```bash
npm run dev
```

Navigate to a resource that has consumers (e.g., `/resources/qtt`). Confirm:
- Trusted By section appears in the sidebar at the top
- All consumer logos are visible in a compact row
- Hovering a logo shows name + category below the logos
- Main content column no longer has the Trusted By section

---

### Task 4: Update tests for new sidebar behavior

**Files:**
- Modify: `src/__tests__/TrustedBySection.test.tsx`

- [ ] **Step 1: Rewrite the test file**

Replace the entire contents of `src/__tests__/TrustedBySection.test.tsx` with:

```typescript
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

function renderWithProvider(ui: React.ReactElement, locale: 'ar' | 'en' = 'ar') {
  return render(<LanguageProvider>{ui}</LanguageProvider>, {
    wrapper: ({ children }) => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key: string) => key === 'ratq_locale' ? locale : null,
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
      return <LanguageProvider>{children}</LanguageProvider>;
    },
  });
}

describe('TrustedBySection — Sidebar', () => {
  it('renders null when consumers is empty', () => {
    const { container } = renderWithProvider(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders heading and count (English)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.getByText('Trusted By')).toBeTruthy();
    expect(screen.getByText('Trusted by 5 applications')).toBeTruthy();
  });

  it('renders heading and count (Arabic)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'ar');
    expect(screen.getByText('موثوق من قبل')).toBeTruthy();
    expect(screen.getByText('موثوق من قبل 5 تطبيق')).toBeTruthy();
  });

  it('renders all consumers at once (no expand/collapse)', () => {
    const consumers = makeConsumers(5);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
  });

  it('does not show expand/collapse button', () => {
    const consumers = makeConsumers(8);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    expect(screen.queryByText(/Show all|Show less|عرض الكل|عرض أقل/)).toBeNull();
  });

  it('shows hover tooltip with name when logo is hovered', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const logos = screen.container.querySelectorAll('[class*="transition-transform"]');
    // Find the first avatar wrapper (ConsumerAvatar wrapper has hover:scale-105)
    if (logos.length > 0) {
      fireEvent.mouseEnter(logos[0]);
      expect(screen.getByText('Consumer 1')).toBeTruthy();
      fireEvent.mouseLeave(logos[0]);
      expect(screen.queryByText('Consumer 1')).toBeNull();
    }
  });

  it('shows category in tooltip when available', () => {
    const consumers = makeConsumers(3);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const logos = screen.container.querySelectorAll('[class*="transition-transform"]');
    if (logos.length > 0) {
      fireEvent.mouseEnter(logos[0]);
      expect(screen.getByText('Enterprise')).toBeTruthy();
    }
  });

  it('renders consumer avatars as clickable links', () => {
    const consumers = makeConsumers(1);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const link = screen.getByText('Consumer 1').closest('a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('https://consumer1.app');
    expect(link?.getAttribute('target')).toBe('_blank');
  });

  it('renders exactly the number of logos matching consumers count', () => {
    const consumers = makeConsumers(8);
    renderWithProvider(<TrustedBySection consumers={consumers} />, 'en');
    const avatars = screen.container.querySelectorAll('[class*="aspect-square"]');
    expect(avatars.length).toBe(8);
  });
});
```

Key changes from the old test file:
- Removed tests for featured/expand/collapse behavior (tests at lines 52-108 in old file)
- Added test: "renders all consumers at once" (verifies no collapse)
- Added test: "does not show expand/collapse button"
- Added test: "shows hover tooltip with name when logo is hovered"
- Added test: "shows category in tooltip when available"
- Added test: "renders exactly the number of logos matching consumers count"
- Kept: empty consumers, heading/count (EN/AR), clickable links

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- src/__tests__/TrustedBySection.test.tsx
```

Expected: All 9 tests pass.

- [ ] **Step 3: Fix any test failures**

If any tests fail, read the error output and fix the test assertions or component code. Re-run until all tests pass.

---

### Task 5: Final verification

**Files:**
- All modified files

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All tests pass (no regressions in other test files).

- [ ] **Step 2: Run typecheck**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: No lint errors.

- [ ] **Step 4: Manual visual check**

```bash
npm run dev
```

Navigate to `/resources/qtt` (resource with 8 consumers). Verify:
- Trusted By is in the sidebar (top position)
- 8 colored logo circles in a wrapped row
- Hovering a logo shows its name + category in a colored card below
- Clicking a logo opens the consumer's website
- Main content column no longer has Trusted By
- Arabic locale works correctly (visit with `?locale=ar`)

- [ ] **Step 5: Commit**

```bash
git add src/components/resources/TrustedBySection.tsx src/components/resources/ConsumerAvatar.tsx src/app/resources/[slug]/ResourceDetailClient.tsx src/__tests__/TrustedBySection.test.tsx
git commit -m "refactor: move Trusted By section to sidebar with hover tooltips"
```

---

## Summary of Changes

| Change | Why |
|--------|-----|
| ConsumerAvatar: new `sidebar` size (38px) | Compact logos for sidebar |
| ConsumerAvatar: no name/category text for `sidebar` | Names shown in hover tooltip instead |
| ConsumerAvatar: accepts `onMouseEnter`/`onMouseLeave` | Enable hover detection for tooltip |
| TrustedBySection: rewritten as sidebar component | Remove featured/expand, add hover tooltip |
| TrustedBySection: all consumers visible at once | No collapse toggle needed in sidebar |
| TrustedBySection: tooltip card with gradient color | Visual feedback on hover matching logo |
| ResourceDetailClient: move component to sidebar | Better use of available space |
| Tests: rewritten for new behavior | 12 old tests → 9 new tests |
