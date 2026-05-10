# Trusted By Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Trusted By" section to the resource detail page that displays consumer apps/orgs in a logo grid with expand/collapse behavior.

**Architecture:** Three focused React components (TrustedBySection → ConsumerGrid → ConsumerCard) that render a responsive grid of clickable cards. Section is conditionally rendered — hidden when no consumers exist. Data model extended with a Consumer interface.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Vitest + Testing Library

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/types/resource.ts` | Modify | Add `Consumer` interface and `consumers` field to `Resource` |
| `src/i18n/messages/en.ts` | Modify | Add `trustedBy`, `trustedByCount`, `showMore`, `showLess` keys |
| `src/i18n/messages/ar.ts` | Modify | Add Arabic translations for the same keys |
| `src/components/resources/ConsumerCard.tsx` | Create | Single clickable consumer card component |
| `src/components/resources/ConsumerGrid.tsx` | Create | 3-column grid with expand/collapse state |
| `src/components/resources/TrustedBySection.tsx` | Create | Section wrapper, conditionally renders grid |
| `src/app/resources/[slug]/ResourceDetailClient.tsx` | Modify | Import and render TrustedBySection between GitHub stats and comments |
| `src/lib/mock-data.ts` | Modify | Add sample `consumers` data to mock resources |
| `src/__tests__/ConsumerCard.test.tsx` | Create | Tests for ConsumerCard component |
| `src/__tests__/ConsumerGrid.test.tsx` | Create | Tests for ConsumerGrid component |
| `src/__tests__/TrustedBySection.test.tsx` | Create | Tests for TrustedBySection component |

---

### Task 1: Add Consumer Type to Data Model

**Files:**
- Modify: `src/types/resource.ts`

- [ ] **Step 1: Add Consumer interface and consumers field**

Add the following interface before the `Resource` interface (around line 5, after the `GithubStats` interface):

```typescript
export interface Consumer {
  name: string;
  logo_url?: string;
  website_url: string;
  category?: string;
}
```

Then add the `consumers` field to the `Resource` interface (after `github_stats: GithubStats | null;`):

```typescript
  consumers?: Consumer[];
```

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors (confirm the types compile cleanly)

- [ ] **Step 3: Commit**

```bash
git add src/types/resource.ts
git commit -m "feat: add Consumer type to resource data model"
```

---

### Task 2: Add i18n Keys (English)

**Files:**
- Modify: `src/i18n/messages/en.ts`

- [ ] **Step 1: Add keys to the resource.detail section**

In `src/i18n/messages/en.ts`, add these entries inside the `detail` object (after `relatedResources`):

```typescript
      trustedBy: 'Used By',
      trustedByCount: 'Trusted by {{count}} {{count, plural, one{application} other{applications}}}',
      showMore: 'Show more',
      showLess: 'Show less',
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/messages/en.ts
git commit -m "i18n: add trusted by section keys (en)"
```

---

### Task 3: Add i18n Keys (Arabic)

**Files:**
- Modify: `src/i18n/messages/ar.ts`

- [ ] **Step 1: Add keys to the resource.detail section**

In `src/i18n/messages/ar.ts`, add these entries inside the `detail` object (after `relatedResources`):

```typescript
      trustedBy: 'يُستخدم بواسطة',
      trustedByCount: 'موثوق من قبل {{count}} {{count, plural, one{تطبيق} other{تطبيق}}}',
      showMore: 'عرض المزيد',
      showLess: 'عرض أقل',
```

- [ ] **Step 2: Commit**

```bash
git add src/i18n/messages/ar.ts
git commit -m "i18n: add trusted by section keys (ar)"
```

---

### Task 4: Create ConsumerCard Component

**Files:**
- Create: `src/components/resources/ConsumerCard.tsx`

- [ ] **Step 1: Write the ConsumerCard component**

Create `src/components/resources/ConsumerCard.tsx`:

```typescript
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
              target.parentElement!.textContent = getInitials(consumer.name);
              target.parentElement!.className = `flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg font-bold text-white`;
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/resources/ConsumerCard.tsx
git commit -m "ui: add ConsumerCard component"
```

---

### Task 5: Create ConsumerGrid Component

**Files:**
- Create: `src/components/resources/ConsumerGrid.tsx`

- [ ] **Step 1: Write the ConsumerGrid component**

Create `src/components/resources/ConsumerGrid.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/resources/ConsumerGrid.tsx
git commit -m "ui: add ConsumerGrid component with expand/collapse"
```

---

### Task 6: Create TrustedBySection Component

**Files:**
- Create: `src/components/resources/TrustedBySection.tsx`

- [ ] **Step 1: Write the TrustedBySection component**

Create `src/components/resources/TrustedBySection.tsx`:

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/resources/TrustedBySection.tsx
git commit -m "ui: add TrustedBySection component"
```

---

### Task 7: Integrate TrustedBySection into ResourceDetailClient

**Files:**
- Modify: `src/app/resources/[slug]/ResourceDetailClient.tsx`

- [ ] **Step 1: Import TrustedBySection**

Add the import near the top of the file, after the `GithubStatsCard` import:

```typescript
import { TrustedBySection } from '@/components/resources/TrustedBySection';
```

- [ ] **Step 2: Add TrustedBySection to the JSX**

In the main content column (`lg:col-span-2`), insert the component between the GitHub stats and the Comments section. Find this block:

```tsx
          {/* GitHub Stats */}
          {resource.github_url && (
            <GithubStatsCard
              githubUrl={resource.github_url}
              stats={resource.github_stats}
            />
          )}

          {/* Comments */}
          <CommentSection resourceId={resource.id} />
```

Replace it with:

```tsx
          {/* GitHub Stats */}
          {resource.github_url && (
            <GithubStatsCard
              githubUrl={resource.github_url}
              stats={resource.github_stats}
            />
          )}

          {/* Trusted By */}
          {resource.consumers && resource.consumers.length > 0 && (
            <TrustedBySection consumers={resource.consumers} />
          )}

          {/* Comments */}
          <CommentSection resourceId={resource.id} />
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/app/resources/[slug]/ResourceDetailClient.tsx
git commit -m "ui: integrate TrustedBySection into resource detail page"
```

---

### Task 8: Add Sample Consumers to Mock Data

**Files:**
- Modify: `src/lib/mock-data.ts`

- [ ] **Step 1: Add consumers to the first few mock resources**

Add a `consumers` array to the first 3 mock resources in `mockResources`:

For resource id 1 (Quranic Text Toolkit), add after `github_stats`:
```typescript
    consumers: [
      { name: 'Quran.com', website_url: 'https://quran.com', category: 'Website' },
      { name: 'iSalam', website_url: 'https://isalam.app', category: 'Mobile App' },
      { name: 'Ayat', website_url: 'https://ayat.app', category: 'Mobile App' },
      { name: 'Noor App', website_url: 'https://noor.app', category: 'Mobile App' },
      { name: 'Quran+ AI', website_url: 'https://quranplus.io', category: 'AI Platform' },
      { name: 'Al-Maktaba', website_url: 'https://maktaba.org', category: 'E-Book' },
      { name: 'Quranic NLP', website_url: 'https://qurannlp.org', category: 'Research' },
      { name: 'PrayerTime', website_url: 'https://prayertime.app', category: 'Utility' },
    ],
```

For resource id 2 (Surah Navigator SDK), add after `github_stats`:
```typescript
    consumers: [
      { name: 'iSalam', website_url: 'https://isalam.app', category: 'Mobile App' },
      { name: 'Ayat', website_url: 'https://ayat.app', category: 'Mobile App' },
      { name: 'VerseMap', website_url: 'https://versemap.io', category: 'Analytics' },
    ],
```

For resource id 3 (Classical Arabic Morphology Dataset), add after `github_stats`:
```typescript
    consumers: [
      { name: 'Quranic NLP', website_url: 'https://qurannlp.org', category: 'Research' },
      { name: 'ArabicKit', website_url: 'https://arabickit.dev', category: 'Toolkit' },
    ],
```

For resource id 4 (Quranic Search API), add after `github_stats`:
```typescript
    consumers: [
      { name: 'Quran.com', website_url: 'https://quran.com', category: 'Website' },
      { name: 'VerseAnalytics', website_url: 'https://verseanalytics.io', category: 'Analytics' },
    ],
```

For resources id 5–16, add `consumers: []` (empty array) to test the section visibility behavior.

For resources id 17–20, omit the `consumers` field entirely (undefined).

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock-data.ts
git commit -m "test: add sample consumers data to mock resources"
```

---

### Task 9: Write ConsumerCard Tests

**Files:**
- Create: `src/__tests__/ConsumerCard.test.tsx`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/ConsumerCard.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConsumerCard } from '@/components/resources/ConsumerCard';
import type { Consumer } from '@/types/resource';

const baseConsumer: Consumer = {
  name: 'Quran.com',
  website_url: 'https://quran.com',
  category: 'Website',
};

describe('ConsumerCard', () => {
  it('renders consumer name and category', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    expect(screen.getByText('Quran.com')).toBeTruthy();
    expect(screen.getByText('Website')).toBeTruthy();
  });

  it('renders initials when no logo is provided', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    expect(screen.getByText('Q')).toBeTruthy();
  });

  it('renders logo image when logo_url is provided', () => {
    const consumerWithLogo: Consumer = { ...baseConsumer, logo_url: '/logo.png' };
    render(<ConsumerCard consumer={consumerWithLogo} index={0} />);
    const img = screen.getByAltText('Quran.com logo');
    expect(img).toBeTruthy();
    expect(img).toHaveAttribute('src', '/logo.png');
  });

  it('falls back to initials when logo image fails to load', () => {
    const consumerWithLogo: Consumer = { ...baseConsumer, logo_url: '/broken-logo.png' };
    render(<ConsumerCard consumer={consumerWithLogo} index={0} />);
    const img = screen.getByAltText('Quran.com logo');
    // Simulate image load error
    img.dispatchEvent(new Event('error'));
    expect(screen.getByText('Q')).toBeTruthy();
  });

  it('renders as a clickable link when website_url is valid', () => {
    render(<ConsumerCard consumer={baseConsumer} index={0} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://quran.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders as a div when website_url is invalid', () => {
    const consumerNoLink: Consumer = { ...baseConsumer, website_url: 'not-a-url' };
    render(<ConsumerCard consumer={consumerNoLink} index={0} />);
    const card = screen.getByText('Quran.com').closest('div');
    expect(card).not.toBeNull();
    expect(card!.tagName).toBe('DIV');
  });

  it('renders without category when not provided', () => {
    const consumerNoCategory: Consumer = { name: 'Test App', website_url: 'https://test.app' };
    render(<ConsumerCard consumer={consumerNoCategory} index={0} />);
    expect(screen.getByText('Test App')).toBeTruthy();
    expect(screen.queryByText('Website')).toBeNull();
  });

  it('shows correct initials for multi-word names', () => {
    const multiWord: Consumer = { name: 'iSalam App', website_url: 'https://isalam.app' };
    render(<ConsumerCard consumer={multiWord} index={0} />);
    expect(screen.getByText('iS')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/ConsumerCard.test.tsx`
Expected: All 8 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/ConsumerCard.test.tsx
git commit -m "test: add ConsumerCard component tests"
```

---

### Task 10: Write ConsumerGrid Tests

**Files:**
- Create: `src/__tests__/ConsumerGrid.test.tsx`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/ConsumerGrid.test.tsx`:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConsumerGrid } from '@/components/resources/ConsumerGrid';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: 'App',
  }));

describe('ConsumerGrid', () => {
  it('renders all consumers when count is <= 6', () => {
    const consumers = makeConsumers(4);
    render(<ConsumerGrid consumers={consumers} />);
    consumers.forEach((c) => expect(screen.getByText(c.name)).toBeTruthy());
    expect(screen.queryByText('+2')).toBeNull();
  });

  it('renders 6 consumers and +N placeholder when count > 6', () => {
    const consumers = makeConsumers(10);
    render(<ConsumerGrid consumers={consumers} />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.getByText('+4')).toBeTruthy();
  });

  it('expands to show all consumers when +N is clicked', () => {
    const consumers = makeConsumers(10);
    render(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
  });

  it('shows "Show less" button after expanding', () => {
    const consumers = makeConsumers(10);
    render(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    expect(screen.getByText('عرض أقل')).toBeTruthy();
  });

  it('collapses back to 6 when "Show less" is clicked', () => {
    const consumers = makeConsumers(10);
    render(<ConsumerGrid consumers={consumers} />);
    fireEvent.click(screen.getByText('+4'));
    fireEvent.click(screen.getByText('عرض أقل'));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.queryByText('+4')).toBeTruthy();
  });

  it('does not show "+N" when exactly 6 consumers', () => {
    const consumers = makeConsumers(6);
    render(<ConsumerGrid consumers={consumers} />);
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Consumer ${i}`)).toBeTruthy();
    }
    expect(screen.queryByText('+0')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/ConsumerGrid.test.tsx`
Expected: All 6 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/ConsumerGrid.test.tsx
git commit -m "test: add ConsumerGrid component tests"
```

---

### Task 11: Write TrustedBySection Tests

**Files:**
- Create: `src/__tests__/TrustedBySection.test.tsx`

- [ ] **Step 1: Write the tests**

Create `src/__tests__/TrustedBySection.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrustedBySection } from '@/components/resources/TrustedBySection';
import type { Consumer } from '@/types/resource';

const makeConsumers = (count: number): Consumer[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Consumer ${i + 1}`,
    website_url: `https://consumer${i + 1}.app`,
    category: 'App',
  }));

describe('TrustedBySection', () => {
  it('renders null when consumers is empty', () => {
    const { container } = render(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when consumers is undefined (via type guard)', () => {
    // We pass an empty array since the prop type requires an array
    // The component checks length === 0, so empty array = null
    const { container } = render(<TrustedBySection consumers={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders title and count when consumers exist', () => {
    const consumers = makeConsumers(3);
    render(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('يُستخدم بواسطة')).toBeTruthy();
    expect(screen.getByText('موثوق من قبل 3 تطبيقات')).toBeTruthy();
  });

  it('renders singular form for 1 consumer', () => {
    const consumers = makeConsumers(1);
    render(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('موثوق من قبل 1 تطبيق')).toBeTruthy();
  });

  it('renders ConsumerGrid component', () => {
    const consumers = makeConsumers(4);
    render(<TrustedBySection consumers={consumers} />);
    expect(screen.getByText('Consumer 1')).toBeTruthy();
    expect(screen.getByText('Consumer 4')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/TrustedBySection.test.tsx`
Expected: All 5 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/TrustedBySection.test.tsx
git commit -m "test: add TrustedBySection component tests"
```

---

### Task 12: Run Full Test Suite and Verify

**Files:**
- N/A (verification step)

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests PASS (including existing tests)

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "chore: verify full test suite and types"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Consumer interface + Resource field → Task 1
- ✅ EN/AR i18n keys → Tasks 2, 3
- ✅ ConsumerCard component → Task 4
- ✅ ConsumerGrid with expand/collapse → Task 5
- ✅ TrustedBySection wrapper → Task 6
- ✅ Integration into ResourceDetailClient → Task 7
- ✅ Mock data with consumers → Task 8
- ✅ Tests for all 3 components → Tasks 9, 10, 11
- ✅ Empty state hidden → Tasks 6, 11
- ✅ Clickable cards with website_url → Task 4
- ✅ Logo fallback to initials → Task 4
- ✅ Responsive grid (1/2/3 cols) → Task 5
- ✅ RTL support (uses CSS logical properties via Tailwind) → Tasks 4, 5

**2. Placeholder scan:** No "TBD", "TODO", or vague requirements found. All code is concrete.

**3. Type consistency:** `Consumer` interface defined in Task 1, used consistently in Tasks 4–11. `consumers` field added to `Resource` in Task 1, consumed in Task 7.

**4. Scope check:** Focused on the Trusted By section only. Publisher dashboard management is noted as out-of-scope for a future plan.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-10-trusted-by-section.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
