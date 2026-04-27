# Versioning & GitHub Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add resource version display on cards/detail pages and GitHub stats (stars, forks, issues, last commit) on detail pages.

**Architecture:** Backend-served fields (`version`, `github_stats`) on the `Resource` type. Frontend adds a version badge to `ResourceCard`, a version row to the metadata section, and a new `GithubStatsCard` component on the detail page. Zero data fetching from frontend — purely presentational.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, custom i18n (React Context), SWR

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/types/resource.ts` | Add `GithubStats` interface + `version`/`github_stats` on `Resource` |
| Modify | `src/i18n/messages/index.ts` | Extend `Messages` interface with version/GitHub keys |
| Modify | `src/i18n/messages/en.ts` | Add English translation strings |
| Modify | `src/i18n/messages/ar.ts` | Add Arabic translation strings |
| Modify | `src/lib/mock-data.ts` | Populate `version`/`github_stats` on select mock resources |
| Modify | `src/components/resources/ResourceCard.tsx` | Add version badge in footer |
| Create | `src/components/resources/GithubStatsCard.tsx` | New pure-presentational component for GitHub stats |
| Modify | `src/app/resources/[slug]/ResourceDetailClient.tsx` | Add version row + `GithubStatsCard` to detail page |

---

### Task 1: Add type definitions

**Goal:** Define `GithubStats` interface and extend `Resource` with `version` and `github_stats`.

**Files:**
- Modify: `src/types/resource.ts`

- [ ] **Step 1: Add `GithubStats` interface and new fields to `Resource`**

Add the `GithubStats` interface after the `Resource` interface, and add two new fields to `Resource`:

```typescript
export interface GithubStats {
  stars: number;
  forks: number;
  open_issues: number;
  last_commit: string;  // ISO 8601
}

export interface Resource {
  // ... existing fields ...
  version: string | null;
  github_stats: GithubStats | null;

  // Preview fields ...
}
```

Place the `version` and `github_stats` fields after `updated_at` and before the preview fields comment.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/types/resource.ts
git commit -m "feat: add version and github_stats to Resource type"
```

---

### Task 2: Add i18n translations

**Goal:** Add translation keys for Version, GitHub stats labels, and fallback messages in both English and Arabic.

**Files:**
- Modify: `src/i18n/messages/index.ts` — Extend `Messages` interface
- Modify: `src/i18n/messages/en.ts` — English strings
- Modify: `src/i18n/messages/ar.ts` — Arabic strings

- [ ] **Step 1: Extend `Messages` interface**

In `src/i18n/messages/index.ts`, add these fields inside the `resource` namespace (at the top level of `resource`, alongside `itqanBadge`, `details`, `github`):

```typescript
resource: {
  // existing ...
  version: string;
  github: {
    stats: string;
    stars: string;
    forks: string;
    openIssues: string;
    lastCommit: string;
    viewOnGithub: string;
    statsUnavailable: string;
  };
  detail: {
    // existing ...
    version: string;
  }
};
```

Note: `github` currently exists as a `string` key (`github: 'GitHub'` for the tooltip). We need to keep that _and_ add a nested `githubStats` object. To avoid the naming collision, use `githubStats` as the nested key:

```typescript
resource: {
  // existing ...
  version: string;
  githubStats: {
    title: string;
    stars: string;
    forks: string;
    openIssues: string;
    lastCommit: string;
    viewOnGithub: string;
    statsUnavailable: string;
  };
  detail: {
    // existing ...
    version: string;
  }
};
```

- [ ] **Step 2: Add English translations**

In `src/i18n/messages/en.ts`, add inside `resource`:

```typescript
resource: {
  // existing ...
  version: 'Version',
  githubStats: {
    title: 'GitHub Statistics',
    stars: 'Stars',
    forks: 'Forks',
    openIssues: 'Open Issues',
    lastCommit: 'Last Commit',
    viewOnGithub: 'View on GitHub',
    statsUnavailable: 'Stats unavailable',
  },
  detail: {
    // existing ...
    version: 'Version',
  },
},
```

- [ ] **Step 3: Add Arabic translations**

In `src/i18n/messages/ar.ts`, add inside `resource`:

```typescript
resource: {
  // existing ...
  version: 'الإصدار',
  githubStats: {
    title: 'إحصائيات GitHub',
    stars: 'النجوم',
    forks: 'الشقوق',
    openIssues: 'القضايا المفتوحة',
    lastCommit: 'آخر تحديث',
    viewOnGithub: 'عرض على GitHub',
    statsUnavailable: 'الإحصائيات غير متاحة',
  },
  detail: {
    // existing ...
    version: 'الإصدار',
  },
},
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors (the `as Messages` cast in `index.ts` will catch mismatches)

- [ ] **Step 5: Commit**

```bash
git add src/i18n/messages/index.ts src/i18n/messages/en.ts src/i18n/messages/ar.ts
git commit -m "feat: add i18n keys for version and GitHub stats"
```

---

### Task 3: Update mock data

**Goal:** Add `version` and `github_stats` to mock resources for local development and testing.

**Files:**
- Modify: `src/lib/mock-data.ts`

- [ ] **Step 1: Add `version` and `github_stats` to select mock resources**

Add `version: string | null` and `github_stats: GithubStats | null` to a subset of mock resources to test both present/absent cases. Use the following pattern:

**Resources with both version AND github_stats** (has `github_url`):
- Resource 1 (QTT): `version: 'v2.4.1'`, `github_stats: { stars: 342, forks: 58, open_issues: 7, last_commit: '2026-04-20T10:30:00Z' }`
- Resource 2 (Surah Navigator): `version: 'v1.8.0'`, `github_stats: { stars: 215, forks: 34, open_issues: 3, last_commit: '2026-04-25T08:15:00Z' }`
- Resource 3 (Morphology Dataset): `version: 'v3.0.0'`, `github_stats: { stars: 189, forks: 42, open_issues: 12, last_commit: '2026-04-10T14:00:00Z' }`
- Resource 5 (Ibn Kathir): `version: 'v1.2.3'`, `github_stats: { stars: 421, forks: 67, open_issues: 2, last_commit: '2026-04-22T09:45:00Z' }`
- Resource 7 (Audio SDK): `version: 'v2.1.0'`, `github_stats: { stars: 156, forks: 23, open_issues: 5, last_commit: '2026-04-18T16:20:00Z' }`
- Resource 12 (Web Reader SDK): `version: 'v4.0.2'`, `github_stats: { stars: 278, forks: 45, open_issues: 1, last_commit: '2026-04-26T11:00:00Z' }`

**Resource with version but no github_stats** (has `github_url` but stats are null — simulates deleted/private repo):
- Resource 6 (Arabic Font Renderer): `version: 'v1.0.5'`, `github_stats: null`

**Resources with `github_url` but no version:**
- Resource 8 (Translation Alignment): `version: null`, `github_stats: { stars: 95, forks: 18, open_issues: 4, last_commit: '2026-04-15T12:30:00Z' }`
- Resource 10 (Majid Tafsir): `version: null`, `github_stats: null`
- Resource 13 (Audio Dataset): `version: null`, `github_stats: { stars: 134, forks: 29, open_issues: 8, last_commit: '2026-04-12T10:00:00Z' }`
- Resource 15 (Baghawi Tafsir): `version: null`, `github_stats: { stars: 203, forks: 38, open_issues: 6, last_commit: '2026-04-19T15:45:00Z' }`
- Resource 16 (Arabic Corpus): `version: null`, `github_stats: { stars: 512, forks: 89, open_issues: 15, last_commit: '2026-04-24T08:00:00Z' }`
- Resource 17 (Verse Mapping SDK): `version: null`, `github_stats: null`
- Resource 18 (Parallel Corpus): `version: null`, `github_stats: { stars: 167, forks: 31, open_issues: 3, last_commit: '2026-04-21T13:15:00Z' }`
- Resource 20 (Al-Jalalayn): `version: null`, `github_stats: null`

**Resources without `github_url`** (4, 9, 11, 14, 19): `version: null`, `github_stats: null`

Also add the import: `import type { Resource, Comment, GithubStats } from '@/types/resource';`

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/mock-data.ts
git commit -m "feat: add version and github_stats to mock data"
```

---

### Task 4: Add version badge to ResourceCard

**Goal:** Display a version badge in the footer of resource cards when `resource.version` is non-null.

**Files:**
- Modify: `src/components/resources/ResourceCard.tsx`

- [ ] **Step 1: Add version badge between license and GitHub link**

In the footer `<div>` of `ResourceCard`, add the version badge after the license span and before the GitHub/details div:

```tsx
<div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
  <div className="flex items-center gap-2">
    <span className="text-xs text-[var(--text-muted)]">{resource.license}</span>
    {resource.version && (
      <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded">
        {resource.version}
      </span>
    )}
  </div>
  <div className="flex items-center gap-3">
    {/* existing GitHub link and Details link */}
  </div>
</div>
```

Note: The license span is currently standalone. Wrap it in a `<div className="flex items-center gap-2">` to hold both license and version side by side.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Builds successfully, no errors

- [ ] **Step 3: Visual verification**

Run: `npm run dev` (background), open `/resources` in browser
Expected: Cards with versions show badge next to license. Cards without versions show only license.

- [ ] **Step 4: Commit**

```bash
git add src/components/resources/ResourceCard.tsx
git commit -m "feat: add version badge to resource card footer"
```

---

### Task 5: Create GithubStatsCard component

**Goal:** Build a pure-presentational component that displays GitHub stats in a 2x2 grid or shows a fallback when stats are unavailable.

**Files:**
- Create: `src/components/resources/GithubStatsCard.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/resources/GithubStatsCard.tsx`:

```tsx
'use client';

import { formatDate } from '@/lib/utils';
import type { GithubStats } from '@/types/resource';
import { useLanguage } from '@/i18n';

interface GithubStatsCardProps {
  githubUrl: string;
  stats: GithubStats | null;
}

export function GithubStatsCard({ githubUrl, stats }: GithubStatsCardProps) {
  const { t, locale } = useLanguage();

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-lg font-semibold">{t.resource.githubStats.title}</h2>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-xs py-2 px-4 inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {t.resource.githubStats.viewOnGithub}
        </a>
      </div>

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Stars */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.stars}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.stars}</dd>
          </div>

          {/* Forks */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.forks}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.forks}</dd>
          </div>

          {/* Open Issues */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.openIssues}</dt>
            <dd className="text-xl font-semibold text-[var(--text-primary)]">{stats.open_issues}</dd>
          </div>

          {/* Last Commit */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.githubStats.lastCommit}</dt>
            <dd className="text-sm font-medium text-[var(--text-primary)]">{formatDate(stats.last_commit, locale)}</dd>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-muted)] mb-3">{t.resource.githubStats.statsUnavailable}</p>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--accent-primary)] hover:underline"
          >
            {t.resource.githubStats.viewOnGithub} →
          </a>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/components/resources/GithubStatsCard.tsx
git commit -m "feat: create GithubStatsCard component"
```

---

### Task 6: Integrate version and GitHub stats in detail page

**Goal:** Add version row to the metadata section and render `GithubStatsCard` when `resource.github_url` exists.

**Files:**
- Modify: `src/app/resources/[slug]/ResourceDetailClient.tsx`

- [ ] **Step 1: Import `GithubStatsCard`**

Add to the existing imports at the top:

```tsx
import { GithubStatsCard } from '@/components/resources/GithubStatsCard';
```

- [ ] **Step 2: Add version row to metadata grid**

In the Metadata `<dl>` grid, add a new row after the license row:

```tsx
<div>
  <dt className="text-xs text-[var(--text-muted)] mb-1">{t.resource.detail.version}</dt>
  <dd className="text-sm font-medium text-[var(--text-primary)]">
    {resource.version || '—'}
  </dd>
</div>
```

Place it after the License `<div>` and before the Type `<div>`. This makes the grid: License, Version, Type, Created, Updated (5 items in a 2-col grid).

- [ ] **Step 3: Add `GithubStatsCard` after Metadata section**

Insert the `GithubStatsCard` between the closing `</div>` of the Metadata section and the `<CommentSection>`:

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

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: Builds successfully, no errors

- [ ] **Step 5: Visual verification**

Run: `npm run dev` (background), open `/resources/quranic-text-toolkit` in browser
Expected:
- Version "v2.4.1" shows in metadata grid
- GitHub stats section shows 2x2 grid with stars (342), forks (58), issues (7), last commit date
- "View on GitHub" link opens in new tab

Open `/resources/arabic-font-rendering-engine` (has github_url but null stats):
Expected: "Stats unavailable" fallback with repo link

Open `/resources/quranic-search-api` (no github_url):
Expected: No GitHub stats section rendered

- [ ] **Step 6: Commit**

```bash
git add src/app/resources/[slug]/ResourceDetailClient.tsx
git commit -m "feat: add version and GitHub stats to resource detail page"
```

---

### Task 7: Final verification

**Goal:** Run the full build and lint to ensure everything is correct.

- [ ] **Step 1: Run linting**

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 2: Run full build**

Run: `npm run build`
Expected: Clean build, no errors or warnings related to our changes

- [ ] **Step 3: Commit**

```bash
git commit -m "ci: verify build and lint pass for versioning/GitHub stats feature"
```
(Only commit if there are no issues. If there are fixes needed, amend the previous commit.)

---

## Self-Review Checklist

### Spec Coverage
| Spec Requirement | Task |
|-----------------|------|
| Type definitions (`GithubStats`, `version`, `github_stats`) | Task 1 |
| Version badge on ResourceCard footer | Task 4 |
| Version in Metadata section on detail page | Task 6 (Step 2) |
| GithubStatsCard component (2x2 grid, fallback) | Task 5 |
| GithubStatsCard on detail page (conditional on `github_url`) | Task 6 (Step 3) |
| Mock data with version/github_stats | Task 3 |
| i18n translations (ar + en) | Task 2 |
| Error handling: null version hides badge | Task 4 (conditional render) |
| Error handling: null github_stats shows fallback | Task 5 (stats ? : branch) |
| Error handling: no github_url hides card | Task 6 (conditional render) |

### Placeholder Scan
- No "TBD", "TODO", or "implement later" ✓
- No vague "add error handling" — all error cases are handled explicitly ✓
- All code blocks are complete with actual implementation ✓
- All file paths are absolute and verified against codebase ✓

### Type Consistency
- `GithubStats` interface defined in Task 1, used consistently in Task 3 (mock), Task 5 (component prop), Task 6 (passing `resource.github_stats`) ✓
- `version: string | null` on Resource — Task 4 checks truthiness, Task 6 uses `|| '—'` ✓
- i18n keys: `t.resource.version`, `t.resource.githubStats.*`, `t.resource.detail.version` — consistent across en.ts, ar.ts, and component usage ✓

---

## Execution Summary

| # | Task | Files | Est. Effort |
|---|------|-------|-------------|
| 1 | Type definitions | 1 modify | 2 min |
| 2 | i18n translations | 3 modify | 5 min |
| 3 | Mock data | 1 modify | 5 min |
| 4 | Version badge on card | 1 modify | 3 min |
| 5 | GithubStatsCard component | 1 create | 10 min |
| 6 | Detail page integration | 1 modify | 5 min |
| 7 | Final verification | — | 3 min |

**Total estimated: ~33 min of implementation**
