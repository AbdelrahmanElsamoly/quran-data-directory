# Unify Trending and Featured Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `ResourceCard` with optional `rank` and `downloadCount` props so both Trending and Featured sections use the same component, eliminating visual drift.

**Architecture:** Add two optional props to `ResourceCard` — `rank` (shows `#N` badge at top-left) and `downloadCount` (shows in bottom bar). Update `TrendingResources` to pass these props via `ResourceCard` instead of the separate `TrendingCard`. Delete `TrendingCard.tsx`.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library

---

### Task 1: Add `rank` and `downloadCount` props to ResourceCard

**Files:**
- Modify: `src/components/resources/ResourceCard.tsx`

- [ ] **Step 1: Update the interface and add rank badge rendering**

In `src/components/resources/ResourceCard.tsx`, update the interface and add rank badge logic:

```typescript
// Change the interface from:
interface ResourceCardProps {
  resource: Resource;
}

// To:
interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}
```

Add the rank badge rendering inside the component, right after `const t = useTranslations();` and before the `descriptionPreview` variable:

```typescript
export function ResourceCard({ resource, rank, downloadCount }: ResourceCardProps) {
  const t = useTranslations();

  const descriptionPreview = resource.description.length > 180
    ? resource.description.slice(0, 180) + '…'
    : resource.description;

  // Add rank badge if rank prop is provided
  const rankBadge = rank != null ? (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold shrink-0"
      aria-label={`Rank ${rank}`}
      dir="ltr"
    >
      #{rank}
    </span>
  ) : null;
```

- [ ] **Step 2: Add rank badge positioning to the card container**

Change the card container `className` from:
```
className="card p-5 flex flex-col h-full"
```
To:
```
className="card group relative p-5 flex flex-col h-full"
```

- [ ] **Step 3: Wrap rank badge in a positioned container and adjust content padding**

Replace the current first `<div>` block (lines 20-27, the badge + itqan_badge section) with a wrapper that includes the rank badge:

```tsx
<div className={`flex items-center gap-2 mb-3 ${rank != null ? 'pt-8' : ''}`}>
  {rankBadge && (
    <span className="absolute top-3 left-3 rtl:right-3 rtl:left-auto z-10">
      {rankBadge}
    </span>
  )}
  <ResourceBadge type={resource.type} />
  {resource.itqan_badge && (
    <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)]" title="Itqan Verified">
      {t.resource.itqanBadge}
    </span>
  )}
</div>
```

- [ ] **Step 4: Add downloadCount to the bottom bar**

Find the bottom bar `div` (currently line 42). Change the left side from:
```tsx
<div className="flex items-center gap-2">
  <span className="text-xs text-[var(--text-muted)]">{resource.license}</span>
  {resource.version && (
    <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
      {resource.version}
    </span>
  )}
</div>
```

To:
```tsx
<div className="flex items-center gap-2">
  {downloadCount != null && (
    <span className="text-xs text-[var(--text-muted)]">
      {downloadCount.toLocaleString()} downloads
    </span>
  )}
  {downloadCount != null && resource.license && (
    <span className="text-[var(--text-muted)]">•</span>
  )}
  <span className="text-xs text-[var(--text-muted)]">{resource.license}</span>
  {resource.version && (
    <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
      {resource.version}
    </span>
  )}
</div>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/resources/ResourceCard.tsx
git commit -m "feat: add optional rank and downloadCount props to ResourceCard"
```

---

### Task 2: Add tests for new ResourceCard props

**Files:**
- Create: `src/__tests__/ResourceCard.test.tsx`

- [ ] **Step 1: Write tests for rank and downloadCount props**

Create `src/__tests__/ResourceCard.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourceCard } from '@/components/resources/ResourceCard';
import { LanguageProvider } from '@/i18n/LanguageContext';
import type { Resource } from '@/types/resource';

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 1,
    name: 'Test Resource',
    slug: 'test-resource',
    type: 'api',
    description: 'A test resource description for testing purposes',
    documentation_url: null,
    github_url: null,
    license: 'MIT',
    itqan_badge: false,
    status: 'published',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    version: '1.0.0',
    github_stats: null,
    total_downloads: 1000,
    downloads: 1000,
    ...overrides,
  };
}

function renderWithProvider(ui: React.ReactElement) {
  localStorage.setItem('ratq_locale', 'en');
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('ResourceCard', () => {
  it('renders rank badge when rank prop is provided', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={1} />
    );
    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders download count when downloadCount prop is provided', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} downloadCount={12345} />
    );
    expect(screen.getByText('12,345 downloads')).toBeInTheDocument();
  });

  it('renders both rank badge and download count together', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={3} downloadCount={999} />
    );
    expect(screen.getByLabelText('Rank 3')).toBeInTheDocument();
    expect(screen.getByText('999 downloads')).toBeInTheDocument();
  });

  it('does not render rank badge when rank prop is omitted', () => {
    const { container } = renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(container.querySelector('[aria-label^="Rank"]')).not.toBeInTheDocument();
  });

  it('does not render download count when downloadCount prop is omitted', () => {
    const { container } = renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(container.textContent).not.toContain('downloads');
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/ResourceCard.test.tsx -v`
Expected: All 5 tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/ResourceCard.test.tsx
git commit -m "test: add tests for ResourceCard rank and downloadCount props"
```

---

### Task 3: Update TrendingResources to use ResourceCard

**Files:**
- Modify: `src/components/resources/TrendingResources.tsx`

- [ ] **Step 1: Update imports**

Change the imports from:
```typescript
import TrendingCard from './TrendingCard';
```

To:
```typescript
import { ResourceCard } from './ResourceCard';
import type { Resource } from '@/types/resource';
```

- [ ] **Step 2: Update the card rendering loop**

Replace the card rendering section (lines 66-74):
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {resources.map((resource, index) => (
    <TrendingCard
      key={resource.id}
      resource={resource}
      rank={(index + 1) as 1 | 2 | 3}
    />
  ))}
</div>
```

With:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {resources.map((resource, index) => (
    <ResourceCard
      key={resource.id}
      resource={{
        id: resource.id,
        name: resource.name,
        slug: resource.slug,
        type: resource.type as import('@/types/resource').ResourceType,
        description: resource.description,
        documentation_url: null,
        github_url: null,
        license: resource.license,
        itqan_badge: false,
        status: 'published' as const,
        created_at: '',
        updated_at: '',
        version: resource.version,
        github_stats: null,
        total_downloads: resource.downloads,
        downloads: resource.downloads,
      } as Resource}
      rank={index + 1}
      downloadCount={resource.downloads}
    />
  ))}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/resources/TrendingResources.tsx
git commit -m "refactor: use ResourceCard instead of TrendingCard in TrendingResources"
```

---

### Task 4: Delete TrendingCard component

**Files:**
- Delete: `src/components/resources/TrendingCard.tsx`

- [ ] **Step 1: Remove the file**

Run: `rm src/components/resources/TrendingCard.tsx`

- [ ] **Step 2: Update the existing TrendingResources test to import ResourceCard**

The test file at `src/__tests__/TrendingResources.test.tsx` currently tests that trending cards render with download counts. After this change, the cards are `ResourceCard` components, so the test assertions about download counts should still work (since ResourceCard now shows downloadCount). However, the test imports `TrendingResources` which no longer imports `TrendingCard`, so no import changes are needed in the test file.

Verify the existing tests still pass by checking they assert on text content that ResourceCard will produce (e.g., `screen.getByText(/1,000 downloads/)`).

- [ ] **Step 3: Run existing tests to verify nothing is broken**

Run: `npx vitest run src/__tests__/TrendingResources.test.tsx -v`
Expected: All existing tests PASS

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete unused TrendingCard component"
```

---

### Task 5: Final verification

**Files:**
- All modified files

- [ ] **Step 1: Run all tests**

Run: `npx vitest run -v`
Expected: All tests PASS (including the 3 existing test files + new ResourceCard tests)

- [ ] **Step 2: Verify no imports reference TrendingCard**

Run: `grep -r "TrendingCard" src/`
Expected: No results (no files should import or reference TrendingCard)

- [ ] **Step 3: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final cleanup after card unification"
```
