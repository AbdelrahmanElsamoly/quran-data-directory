# Compact ResourceCard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the vertical height of `ResourceCard` by trimming padding, capping the description at 2 lines, collapsing the footer into an inline metadata row, and making the whole card clickable.

**Architecture:** Single-component refactor. Wrap card body in `<Link>` for whole-card click. Replace the two-column footer with a single inline metadata row. Keep the rank bar unchanged when `rank` is passed.

**Tech Stack:** Next.js (App Router), React, Tailwind CSS, Vitest + React Testing Library

---

### Task 1: Update ResourceCard tests

**Files:**
- Modify: `src/__tests__/ResourceCard.test.tsx`

- [ ] **Step 1: Update tests to reflect new structure**

Replace the test file with updated assertions matching the condensed card:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
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
  const result = render(<LanguageProvider>{ui}</LanguageProvider>);
  act(() => {});
  return result;
}

describe('ResourceCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders rank badge when rank prop is provided', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={1} />
    );
    expect(screen.getByLabelText('Rank 1')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
  });

  it('renders download count in metadata row', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} downloadCount={12345} />
    );
    expect(screen.getByText('12,345')).toBeInTheDocument();
  });

  it('renders both rank badge and download count together', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} rank={3} downloadCount={999} />
    );
    expect(screen.getByLabelText('Rank 3')).toBeInTheDocument();
    expect(screen.getByText('999')).toBeInTheDocument();
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

  it('wraps card content in a Link to the resource detail page', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({ slug: 'my-resource' })} />
    );
    const link = screen.getByRole('link', { name: /Test Resource/i });
    expect(link).toHaveAttribute('href', '/resources/my-resource');
  });

  it('does not render a separate Details link', () => {
    renderWithProvider(
      <ResourceCard resource={createResource()} />
    );
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });

  it('renders github link when github_url is present', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({ github_url: 'https://github.com/test/repo' })} />
    );
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/repo');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('clamps description to 2 lines', () => {
    renderWithProvider(
      <ResourceCard resource={createResource({
        description: 'This is a very long description that should be clamped to two lines maximum regardless of how much text is provided here to ensure the card stays compact.',
      })} />
    );
    const descriptionEl = screen.getByText(/This is a very long description/i);
    expect(descriptionEl.closest('p')).toHaveClass('line-clamp-2');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/ResourceCard.test.tsx`
Expected: FAIL — "Details" query still finds the old link, `line-clamp-2` class is missing, github link aria-label may be missing, etc.

- [ ] **Step 3: Commit failing tests**

```bash
git add src/__tests__/ResourceCard.test.tsx
git commit -m "test: update ResourceCard tests for condensed layout"
```

### Task 2: Implement the condensed ResourceCard

**Files:**
- Modify: `src/components/resources/ResourceCard.tsx`

- [ ] **Step 1: Rewrite ResourceCard with condensed layout**

Replace the component:

```tsx
'use client';

import Link from 'next/link';
import { ResourceBadge } from '@/components/ui/Badge';
import type { Resource } from '@/types/resource';
import { useTranslations } from '@/i18n';

interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}

export function ResourceCard({ resource, rank, downloadCount }: ResourceCardProps) {
  const t = useTranslations();

  return (
    <article className="card group relative flex flex-col h-full overflow-hidden">
      {rank != null && (
        <div
          className="flex items-center justify-center bg-[var(--accent-primary)] text-white py-3 text-xl font-bold"
          aria-label={`Rank ${rank}`}
          dir="ltr"
        >
          #{rank}
        </div>
      )}
      <Link
        href={`/resources/${resource.slug}`}
        className="flex flex-col flex-grow p-3 hover:bg-[var(--bg-secondary)] transition-colors no-underline"
      >
        <div className="flex items-center gap-2 mb-2">
          <ResourceBadge type={resource.type} />
          {resource.itqan_badge && (
            <span className="badge bg-[var(--accent-gold-light)] text-[var(--accent-gold)]" title="Itqan Verified">
              {t.resource.itqanBadge}
            </span>
          )}
        </div>

        <h3 className="font-heading font-semibold text-sm mb-1.5 leading-snug text-[var(--text-primary)]">
          {resource.name}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-2 flex-grow">
          {resource.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {downloadCount != null && (
              <span className="text-xs text-[var(--text-muted)]">
                {downloadCount.toLocaleString()}
              </span>
            )}
            {downloadCount != null && resource.license && (
              <span className="text-[var(--text-muted)] text-xs">•</span>
            )}
            {resource.license && (
              <span className="text-xs text-[var(--text-muted)]">{resource.license}</span>
            )}
            {resource.license && resource.version && (
              <span className="text-[var(--text-muted)] text-xs">•</span>
            )}
            {resource.version && (
              <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
                {resource.version}
              </span>
            )}
          </div>
          {resource.github_url && (
            <a
              href={resource.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors ml-2"
              title={t.resource.github}
              aria-label={t.resource.github}
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </Link>
    </article>
  );
}
```

Key changes from the original:
- Padding reduced from `p-5` to `p-3` on the content area
- Description uses `line-clamp-2` instead of manual 180-char truncation (remove the `descriptionPreview` variable)
- Font sizes reduced: heading `text-base` → `text-sm`, description `text-sm` → `text-xs`
- Footer divider (`border-t`) removed; metadata is a single inline row
- "Details →" link removed; entire card content is wrapped in `<Link>`
- GitHub link gets `onClick={(e) => e.stopPropagation()}` so clicking it doesn't also navigate the card link
- GitHub link gets explicit `aria-label` for accessibility
- Download count displays as raw number (no "downloads" suffix) to save space
- License is shown even when downloadCount is null (was previously hidden behind the separator logic)

- [ ] **Step 2: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/ResourceCard.test.tsx`
Expected: PASS all 8 tests

- [ ] **Step 3: Commit**

```bash
git add src/components/resources/ResourceCard.tsx
git commit -m "refactor: condense ResourceCard layout"
```

### Task 3: Verify consumers work correctly

**Files:**
- Verify: `src/components/resources/ResourceGrid.tsx`
- Verify: `src/components/resources/TrendingResources.tsx`

- [ ] **Step 1: Smoke test the full app**

Run the dev server and verify visually:
- ResourceGrid shows compact cards in the 3-column grid
- TrendingResources shows compact cards with rank bars
- RelatedResources still shows its own mini-card (unchanged)
- Clicking anywhere on a card navigates to the resource detail page
- Clicking the GitHub icon opens in a new tab without navigating the card

```bash
npm run dev
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: All tests pass (no regressions in other components)

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: verify compact ResourceCard consumers" --allow-empty
```

---

## Self-Review

**Spec coverage:**
- ✅ Padding reduced from `p-5` to `p-3`
- ✅ Description capped at 2 lines via `line-clamp-2`
- ✅ Footer divider removed, metadata collapsed into inline row
- ✅ "Details →" link removed, whole card is clickable via `<Link>`
- ✅ Rank bar unchanged when `rank` is passed
- ✅ GitHub link kept as separate `<a>` with `stopPropagation`
- ✅ ResourceGrid: no code changes needed
- ✅ TrendingResources: no code changes needed
- ✅ RelatedResources: explicitly out of scope
- ✅ Tests updated with new assertions
- ✅ Accessibility: `aria-label` on rank bar and GitHub link preserved

**Placeholder scan:** No TBDs, TODOs, or vague instructions. Every step has concrete code or commands.

**Type consistency:** Props interface unchanged (`resource`, `rank?`, `downloadCount?`). All type references match `@/types/resource`.
