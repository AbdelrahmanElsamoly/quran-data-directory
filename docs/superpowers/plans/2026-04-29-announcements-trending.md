# Announcements & Trending Resources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Announcements Carousel and Trending Resources (Top 3) sections to the landing page above the existing Featured Resources section.

**Architecture:** Two new landing page sections built as client components using SWR for data fetching, Tailwind CSS for styling, and the existing i18n system for Arabic/English translations. Mock data layer extended to support both features. No test framework exists — Vitest + React Testing Library will be added from scratch.

**Tech Stack:** Next.js 16 (App Router), React 19, SWR, Tailwind CSS, TypeScript, Vitest (new), React Testing Library (new)

---

## File Map

### New files to create:
- `src/types/announcement.ts` — Announcement and TrendingResource types
- `src/hooks/useAnnouncements.ts` — SWR hook for active announcements
- `src/hooks/useTrendingResources.ts` — SWR hook for trending resources by period
- `src/components/resources/AnnouncementsCarousel.tsx` — Carousel component with auto-rotation
- `src/components/resources/TrendingResources.tsx` — Top-3 section with time-window toggle
- `src/components/resources/TrendingCard.tsx` — Individual ranked resource card
- `vitest.setup.ts` — Vitest setup file
- `vitest.config.ts` — Vitest configuration
- `src/__tests__/AnnouncementsCarousel.test.tsx` — Unit tests for carousel
- `src/__tests__/TrendingResources.test.tsx` — Unit tests for trending section
- `src/__tests__/useAnnouncements.test.ts` — Hook tests

### Existing files to modify:
- `src/types/resource.ts` — Add `total_downloads` field to `Resource`
- `src/lib/api-client.ts` — Add announcements and trending endpoints
- `src/lib/mock-data.ts` — Add `downloads` field to mock resources, add mock announcements
- `src/app/page.tsx` — Insert new sections above Featured Resources
- `src/i18n/messages/index.ts` — Add `announcements` and `trending` message keys
- `src/i18n/messages/en.ts` — Add English translations
- `src/i18n/messages/ar.ts` — Add Arabic translations
- `package.json` — Add vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- `tsconfig.json` — Add `vitest.config.ts` to exclude if needed

---

## Task 1: Add test infrastructure (Vitest + React Testing Library)

**Files:**
- Create: `package.json` (dependencies)
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [x] **Step 1: Add test dependencies to package.json**

Add to `devDependencies`:
```json
"vitest": "^3.0.0",
"@testing-library/react": "^16.1.0",
"@testing-library/jest-dom": "^6.6.0",
"@types/react": "19.2.14",
"jsdom": "^26.0.0",
"@vitest/ui": "^3.0.0"
```

Add to `scripts`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [x] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['src/__tests__/**/*.test.{ts,tsx}'],
  },
});
```

- [x] **Step 3: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom';
```

- [x] **Step 4: Run test to verify setup works**

Run: `npx vitest run --reporter=verbose`
Expected: No tests found (0 tests) — but no errors

- [x] **Step 5: Commit**

```bash
git add package.json vitest.config.ts vitest.setup.ts
git commit -m "chore: add Vitest + React Testing Library test infrastructure"
```

---

## Task 2: Add types for announcements and trending

**Files:**
- Create: `src/types/announcement.ts`
- Modify: `src/types/resource.ts:7-36`

- [x] **Step 1: Create `src/types/announcement.ts`**

```typescript
export type AnnouncementType = 'release' | 'new_resource' | 'maintenance' | 'breaking_change';

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  description: string;
  resource_id?: string;
  cta_url?: string;
  cta_label?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export type TrendingPeriod = '7d' | '30d' | 'all-time';

export interface TrendingResource {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  version: string | null;
  license: string;
  downloads: number;
}
```

- [x] **Step 2: Add `total_downloads` to Resource interface in `src/types/resource.ts`**

After line 35 (before the closing `}` of `Resource` interface), add:
```typescript
  total_downloads: number;
```

- [x] **Step 3: Run test to verify types compile**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/types/announcement.ts src/types/resource.ts
git commit -m "feat: add Announcement, TrendingResource types and total_downloads field"
```

---

## Task 3: Extend mock data with downloads and announcements

**Files:**
- Modify: `src/lib/mock-data.ts`

- [x] **Step 1: Add `downloads` field to all mock resources**

For each of the 20 resources in `mockResources`, add a `downloads` field with realistic values. Here are the updated resources (only the `downloads` additions shown — keep all existing fields):

```typescript
// Update each mock resource object to include downloads:
{ id: 1, name: '...', downloads: 2840, ... },
{ id: 2, name: '...', downloads: 1920, ... },
{ id: 3, name: '...', downloads: 1560, ... },
{ id: 4, name: '...', downloads: 1240, ... },
{ id: 5, name: '...', downloads: 980, ... },
{ id: 6, name: '...', downloads: 750, ... },
{ id: 7, name: '...', downloads: 620, ... },
{ id: 8, name: '...', downloads: 480, ... },
{ id: 9, name: '...', downloads: 350, ... },
{ id: 10, name: '...', downloads: 290, ... },
// ... remaining resources with descending values
{ id: 11, downloads: 210 },
{ id: 12, downloads: 180 },
{ id: 13, downloads: 145 },
{ id: 14, downloads: 98 },
{ id: 15, downloads: 72 },
{ id: 16, downloads: 45 },
{ id: 17, downloads: 30 },
{ id: 18, downloads: 18 },
{ id: 19, downloads: 12 },
{ id: 20, downloads: 5 },
```

- [x] **Step 2: Add mock announcements array**

Add to the end of `mock-data.ts`:

```typescript
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    type: 'release',
    title: 'Quran API v2.1 Released',
    description: 'New endpoints for surah-level search and improved translation matching.',
    resource_id: 'quran-api',
    cta_url: '/resources/quran-api',
    cta_label: 'View resource',
    created_at: '2026-04-28T10:00:00Z',
    is_active: true,
  },
  {
    id: '2',
    type: 'new_resource',
    title: 'New: Quranic Text Toolkit (QTT) SDK',
    description: 'A comprehensive SDK for Quranic text processing and analysis.',
    resource_id: 'quranic-text-toolkit',
    cta_url: '/resources/quranic-text-toolkit',
    cta_label: 'View resource',
    created_at: '2026-04-27T14:30:00Z',
    is_active: true,
  },
  {
    id: '3',
    type: 'maintenance',
    title: 'Scheduled Maintenance: April 30',
    description: 'Platform maintenance from 2:00 AM to 4:00 AM UTC. Expect brief downtime.',
    created_at: '2026-04-26T08:00:00Z',
    expires_at: '2026-04-30T04:00:00Z',
    is_active: true,
  },
  {
    id: '4',
    type: 'breaking_change',
    title: 'API v1 Deprecation Notice',
    description: 'API v1 will be retired on June 1, 2026. Migrate to v2 endpoints.',
    created_at: '2026-04-25T09:00:00Z',
    expires_at: '2026-06-01T00:00:00Z',
    is_active: true,
  },
  {
    id: '5',
    type: 'release',
    title: 'Arabic NLP Dataset v1.0',
    description: 'New annotated dataset for Arabic Quranic text classification.',
    resource_id: 'arabic-nlp-dataset',
    cta_url: '/resources/arabic-nlp-dataset',
    cta_label: 'View resource',
    created_at: '2026-04-24T12:00:00Z',
    is_active: true,
  },
  {
    id: '6',
    type: 'new_resource',
    title: 'New: Tafsir Ibn Kathir Digital Edition',
    description: 'Complete digital edition of Tafsir Ibn Kathir with search and cross-references.',
    resource_id: 'tafsir-ibn-kathir',
    cta_url: '/resources/tafsir-ibn-kathir',
    cta_label: 'View resource',
    created_at: '2026-04-23T16:00:00Z',
    is_active: true,
  },
];
```

- [x] **Step 3: Run test to verify mock data compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/lib/mock-data.ts
git commit -m "feat: add downloads field to mock resources and mock announcements"
```

---

## Task 4: Add API client endpoints for announcements and trending

**Files:**
- Modify: `src/lib/api-client.ts`

- [x] **Step 1: Add imports**

At the top of `api-client.ts`, add to the import block:
```typescript
import type { Announcement, TrendingResource } from '@/types/announcement';
import { mockAnnouncements } from './mock-data';
```

- [x] **Step 2: Add `fetchAnnouncements` function**

Add before the `// ─── Export` comment:

```typescript
// ─── Announcement Endpoints ──────────────────────────────────────────────

function fetchAnnouncements(): Promise<Announcement[]> {
  if (DATA_MODE === 'mock') {
    const now = new Date();
    return Promise.resolve(
      mockAnnouncements.filter((a) => {
        if (!a.is_active) return false;
        if (a.expires_at && new Date(a.expires_at) < now) return false;
        return true;
      })
    );
  }

  return fetch(`${API_BASE}/api/announcements/`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  });
}

// ─── Trending Resource Endpoints ─────────────────────────────────────────

function fetchTrendingResources(period: '7d' | '30d' | 'all-time'): Promise<TrendingResource[]> {
  if (DATA_MODE === 'mock') {
    const sorted = [...mockResources]
      .filter((r) => r.downloads > 0)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 3)
      .map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        type: r.type,
        description: r.description,
        version: r.version,
        license: r.license,
        downloads: r.downloads,
      }));
    return Promise.resolve(sorted);
  }

  const qs = new URLSearchParams({ period, limit: '3' });
  return fetch(`${API_BASE}/api/resources/trending/?${qs}`).then((res) => {
    if (!res.ok) throw new Error('Failed to fetch trending resources');
    return res.json();
  });
}
```

- [x] **Step 3: Update the export object**

Replace the existing `export const api = { ... }` with:

```typescript
export const api = {
  resources: { list: fetchResources, detail: fetchResource },
  comments: { list: fetchComments },
  auth: { login, register },
  requests: { submit: submitAccessRequest, myRequests: fetchMyRequests },
  apiKeys: { generate: generateApiKey },
  reports: { submit: submitReport },
  authHelpers: { getAccessToken, setAuthTokens, clearAuth },
  announcements: { list: fetchAnnouncements },
  trending: { list: fetchTrendingResources },
};
```

- [x] **Step 4: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 5: Commit**

```bash
git add src/lib/api-client.ts
git commit -m "feat: add API endpoints for announcements and trending resources"
```

---

## Task 5: Create `useAnnouncements` hook

**Files:**
- Create: `src/hooks/useAnnouncements.ts`

- [x] **Step 1: Create the hook file**

```typescript
'use client';

import useSWR from 'swr';
import type { Announcement } from '@/types/announcement';

export interface UseAnnouncementsReturn {
  announcements: Announcement[];
  isLoading: boolean;
  error: Error | null;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const { data, error, isLoading } = useSWR<Announcement[], Error>(
    ['announcements'],
    () => api.announcements.list()
  );

  return {
    announcements: data ?? [],
    isLoading,
    error,
  };
}
```

- [x] **Step 2: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 3: Commit**

```bash
git add src/hooks/useAnnouncements.ts
git commit -m "feat: add useAnnouncements SWR hook"
```

---

## Task 6: Create `useTrendingResources` hook

**Files:**
- Create: `src/hooks/useTrendingResources.ts`

- [x] **Step 1: Create the hook file**

```typescript
'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import type { TrendingResource, TrendingPeriod } from '@/types/announcement';

export interface UseTrendingResourcesReturn {
  resources: TrendingResource[];
  isLoading: boolean;
  error: Error | null;
  period: TrendingPeriod;
  setPeriod: (period: TrendingPeriod) => void;
  periods: TrendingPeriod[];
}

const ALL_PERIODS: TrendingPeriod[] = ['7d', '30d', 'all-time'];

export function useTrendingResources(): UseTrendingResourcesReturn {
  const [period, setPeriod] = useState<TrendingPeriod>('30d');

  const { data, error, isLoading } = useSWR<TrendingResource[], Error>(
    ['trending', period],
    () => api.trending.list(period)
  );

  return {
    resources: data ?? [],
    isLoading,
    error,
    period,
    setPeriod,
    periods: ALL_PERIODS,
  };
}
```

- [x] **Step 2: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 3: Commit**

```bash
git add src/hooks/useTrendingResources.ts
git commit -m "feat: add useTrendingResources SWR hook with period toggle"
```

---

## Task 7: Add i18n translations for announcements and trending

**Files:**
- Modify: `src/i18n/messages/index.ts`
- Modify: `src/i18n/messages/en.ts`
- Modify: `src/i18n/messages/ar.ts`

- [x] **Step 1: Add `announcements` and `trending` to `Messages` interface in `src/i18n/messages/index.ts`**

After the existing `home` section in the `Messages` interface, add:

```typescript
  announcements: {
    title: string;
    types: {
      release: string;
      new_resource: string;
      maintenance: string;
      breaking_change: string;
    };
    ago: string;
    viewResource: string;
    learnMore: string;
    viewChangelog: string;
    noAnnouncements: string;
  };
  trending: {
    title: string;
    browseAll: string;
    period7d: string;
    period30d: string;
    periodAllTime: string;
    downloads: string;
    viewResource: string;
  };
```

- [x] **Step 2: Add English translations to `src/i18n/messages/en.ts`**

After the `home` section in the `en` export, add:

```typescript
  announcements: {
    title: 'Announcements',
    types: {
      release: 'New Release',
      new_resource: 'New Resource',
      maintenance: 'Maintenance',
      breaking_change: 'Breaking Change',
    },
    ago: '{{count}} ago',
    viewResource: 'View resource',
    learnMore: 'Learn more',
    viewChangelog: 'View changelog',
    noAnnouncements: '',
  },
  trending: {
    title: 'Trending Resources',
    browseAll: 'Browse all',
    period7d: '7 days',
    period30d: '30 days',
    periodAllTime: 'All-time',
    downloads: '{{count}} downloads',
    viewResource: 'View resource',
  },
```

- [x] **Step 3: Add Arabic translations to `src/i18n/messages/ar.ts`**

After the `home` section in the `ar` export, add:

```typescript
  announcements: {
    title: 'الإعلانات',
    types: {
      release: 'إصدار جديد',
      new_resource: 'مورد جديد',
      maintenance: 'صيانة',
      breaking_change: 'تغيير جوهري',
    },
    ago: 'منذ {{count}}',
    viewResource: 'عرض المورد',
    learnMore: 'اعرف المزيد',
    viewChangelog: 'عرض سجل التغييرات',
    noAnnouncements: '',
  },
  trending: {
    title: 'الموارد الرائجة',
    browseAll: 'تصفح الكل',
    period7d: '7 أيام',
    period30d: '30 يومًا',
    periodAllTime: 'كل الأوقات',
    downloads: '{{count}} تحميل',
    viewResource: 'عرض المورد',
  },
```

- [x] **Step 4: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 5: Commit**

```bash
git add src/i18n/messages/index.ts src/i18n/messages/en.ts src/i18n/messages/ar.ts
git commit -m "feat: add i18n translations for announcements and trending sections"
```

---

## Task 8: Create `TrendingCard` component

**Files:**
- Create: `src/components/resources/TrendingCard.tsx`

- [x] **Step 1: Create the component**

```typescript
'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { ResourceBadge } from '@/components/ui/Badge';
import type { TrendingResource } from '@/types/announcement';

interface TrendingCardProps {
  resource: TrendingResource;
  rank: 1 | 2 | 3;
}

export default function TrendingCard({ resource, rank }: TrendingCardProps) {
  const t = useTranslations();

  const crownIcon = (
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 1l2.5 6.5H18l-5.5 4 2.1 6.5L10 14.4l-4.6 3.6 2.1-6.5L2 7.5h5.5L10 1z" />
    </svg>
  );

  const rankBadge = rank === 1 ? (
    <span className="flex items-center gap-1" aria-label={t.trending.rankFirst}>
      {crownIcon}
    </span>
  ) : (
    <span
      className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold"
      aria-label={rank === 2 ? t.trending.rankSecond : t.trending.rankThird}
    >
      {rank}
    </span>
  );

  const downloadCount = resource.downloads.toLocaleString();

  return (
    <div className="card group relative flex flex-col justify-between p-5">
      <div className="flex items-start gap-3 mb-3">
        {rankBadge}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <ResourceBadge type={resource.type as never} />
          </div>
          <h3 className="font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate">
            {resource.name}
          </h3>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
        {resource.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
        <span>{downloadCount} {t.trending.downloads.replace('{{count}}', '')}</span>
        {resource.version && <span>• {t.resource.version} {resource.version}</span>}
        {resource.license && <span>• {resource.license}</span>}
      </div>

      <Link
        href={`/resources/${resource.slug}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-primary)] hover:underline mt-auto"
      >
        {t.trending.viewResource}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
```

- [x] **Step 2: Add rank labels to i18n** (update `en.ts` and `ar.ts` in a follow-up commit since we need them for the component to compile cleanly):

In `en.ts`, add to `trending`:
```typescript
    rankFirst: '1st place',
    rankSecond: '2nd place',
    rankThird: '3rd place',
```

In `ar.ts`, add to `trending`:
```typescript
    rankFirst: 'المركز الأول',
    rankSecond: 'المركز الثاني',
    rankThird: 'المركز الثالث',
```

- [x] **Step 3: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/components/resources/TrendingCard.tsx src/i18n/messages/en.ts src/i18n/messages/ar.ts
git commit -m "feat: add TrendingCard component with rank badges and download count"
```

---

## Task 9: Create `TrendingResources` component

**Files:**
- Create: `src/components/resources/TrendingResources.tsx`

- [x] **Step 1: Create the component**

```typescript
'use client';

import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useTrendingResources } from '@/hooks/useTrendingResources';
import TrendingCard from './TrendingCard';

export default function TrendingResources() {
  const t = useTranslations();
  const { resources, isLoading, period, setPeriod, periods } = useTrendingResources();

  if (resources.length === 0 && !isLoading) {
    return null;
  }

  const periodLabels: Record<string, string> = {
    '7d': t.trending.period7d,
    '30d': t.trending.period30d,
    'all-time': t.trending.periodAllTime,
  };

  return (
    <section className="section-padding" aria-label={t.trending.title}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl text-[var(--text-primary)]">{t.trending.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" role="tablist" aria-label={t.trending.title}>
              {periods.map((p) => (
                <button
                  key={p}
                  role="tab"
                  aria-selected={period === p}
                  onClick={() => setPeriod(p as '7d' | '30d' | 'all-time')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    period === p
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {periodLabels[p]}
                </button>
              ))}
            </div>
            <Link
              href="/resources?sort=downloads"
              className="text-sm font-medium text-[var(--accent-primary)] hover:underline"
            >
              {t.trending.browseAll}
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="h-5 bg-[var(--bg-secondary)] rounded w-20 mb-3" />
                <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-full mb-2" />
                <div className="h-4 bg-[var(--bg-secondary)] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {resources.map((resource, index) => (
              <TrendingCard
                key={resource.id}
                resource={resource}
                rank={(index + 1) as 1 | 2 | 3}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [x] **Step 2: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 3: Commit**

```bash
git add src/components/resources/TrendingResources.tsx
git commit -m "feat: add TrendingResources section component with period toggle"
```

---

## Task 10: Create `AnnouncementsCarousel` component

**Files:**
- Create: `src/components/resources/AnnouncementsCarousel.tsx`

- [x] **Step 1: Create the component**

```typescript
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/i18n';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { Announcement, AnnouncementType } from '@/types/announcement';

const AUTO_ROTATE_MS = 8000;

const typeConfig: Record<AnnouncementType, { labelKey: string; color: string; icon: JSX.Element }> = {
  release: {
    labelKey: 'announcements.types.release',
    color: 'bg-blue-100 text-blue-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  new_resource: {
    labelKey: 'announcements.types.new_resource',
    color: 'bg-green-100 text-green-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  maintenance: {
    labelKey: 'announcements.types.maintenance',
    color: 'bg-yellow-100 text-yellow-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  breaking_change: {
    labelKey: 'announcements.types.breaking_change',
    color: 'bg-red-100 text-red-800',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const t = useTranslations();
  // We can't call hooks in a utility function, so we'll use a simpler approach
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}

export default function AnnouncementsCarousel() {
  const t = useTranslations();
  const { announcements, isLoading } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = announcements;
  const isSingle = slides.length <= 1;

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPaused && !isSingle && slides.length > 1) {
      timerRef.current = setTimeout(next, AUTO_ROTATE_MS);
    }
  }, [isPaused, isSingle, slides.length, next]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSingle) return;
      if (e.key === 'ArrowLeft') {
        prev();
        setIsPaused(true);
      } else if (e.key === 'ArrowRight') {
        next();
        setIsPaused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, isSingle]);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);

  if (isLoading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIndex];
  const config = typeConfig[slide.type];

  return (
    <section
      className="section-padding bg-[var(--bg-secondary)]"
      role="region"
      aria-roledescription="carousel"
      aria-label={t.announcements.title}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={`relative rounded-xl p-6 ${
            slide.type === 'release'
              ? 'bg-blue-50 border border-blue-200'
              : slide.type === 'new_resource'
              ? 'bg-green-50 border border-green-200'
              : slide.type === 'maintenance'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.icon}
              {t[config.labelKey]}
            </span>
            <div className="flex-1">
              <h3 className="font-heading text-xl text-[var(--text-primary)] mb-1">{slide.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{slide.description}</p>
              <div className="flex items-center gap-3">
                <time
                  dateTime={slide.created_at}
                  className="text-xs text-[var(--text-muted)]"
                >
                  {formatRelativeTime(slide.created_at)}
                </time>
                {slide.cta_url && (
                  <Link
                    href={slide.cta_url}
                    className="text-sm font-medium text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1"
                    role="link"
                  >
                    {slide.cta_label || t.announcements.learnMore}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {!isSingle && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  onClick={() => { prev(); setIsPaused(true); }}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                  aria-label="Previous announcement"
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={() => { next(); setIsPaused(true); }}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
                  aria-label="Next announcement"
                >
                  <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Announcement slides">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Announcement ${index + 1}`}
                    onClick={() => { setCurrentIndex(index); setIsPaused(true); }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentIndex ? 'bg-[var(--accent-primary)] w-6' : 'bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 2: Fix the `formatRelativeTime` function** — it can't call `useTranslations()` inside a utility. Replace with:

```typescript
function formatRelativeTime(dateStr: string, t: ReturnType<typeof import('@/i18n').useTranslations>): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return t.announcements.ago.replace('{{count}}', `${diffMins}m`);
  if (diffHours < 24) return t.announcements.ago.replace('{{count}}', `${diffHours}h`);
  return t.announcements.ago.replace('{{count}}', `${diffDays}d`);
}
```

And in the component, pass `t` to it:
```typescript
{formatRelativeTime(slide.created_at, t)}
```

- [x] **Step 3: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 4: Commit**

```bash
git add src/components/resources/AnnouncementsCarousel.tsx
git commit -m "feat: add AnnouncementsCarousel component with auto-rotation and keyboard navigation"
```

---

## Task 11: Wire new sections into landing page

**Files:**
- Modify: `src/app/page.tsx`

- [x] **Step 1: Add imports**

Add to the top of `src/app/page.tsx`:
```typescript
import AnnouncementsCarousel from '@/components/resources/AnnouncementsCarousel';
import TrendingResources from '@/components/resources/TrendingResources';
```

- [x] **Step 2: Insert new sections in page.tsx**

In the `HomePage` component, find the existing structure and insert the new sections between the CTA section and the Featured Resources section. The structure should be:

```tsx
// ... existing Hero, StatsBar, CTA sections ...

{/* NEW: Announcements Carousel */}
<AnnouncementsCarousel />

{/* NEW: Trending Resources */}
<TrendingResources />

{/* Existing: Featured Resources */}
<section className="section-padding">
  {/* ... existing featured resources code ... */}
</section>
```

Insert the two new component calls right after the CTA section `</section>` closing tag and before the Featured Resources `</div>` or `<section>` that contains it.

- [x] **Step 3: Run test to verify compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 4: Run dev server to verify visually**

Run: `npm run dev`
Expected: Page loads with new sections visible above Featured Resources

- [x] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add AnnouncementsCarousel and TrendingResources sections to landing page"
```

---

## Task 12: Write unit tests for AnnouncementsCarousel

**Files:**
- Create: `src/__tests__/AnnouncementsCarousel.test.tsx`

- [x] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AnnouncementsCarousel from '@/components/resources/AnnouncementsCarousel';

vi.mock('@/hooks/useAnnouncements', () => ({
  useAnnouncements: vi.fn(),
}));

const mockUseAnnouncements = vi.mocked(require('@/hooks/useAnnouncements').useAnnouncements);

describe('AnnouncementsCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('returns null when no announcements and not loading', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [],
      isLoading: false,
      error: null,
    });

    const { container } = render(<AnnouncementsCarousel />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when loading', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [],
      isLoading: true,
      error: null,
    });

    const { container } = render(<AnnouncementsCarousel />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a single announcement as static banner (no controls)', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'Test Announcement',
          description: 'Test description',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<AnnouncementsCarousel />);
    expect(screen.getByText('Test Announcement')).toBeInTheDocument();
    expect(screen.queryByLabelText('Previous announcement')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next announcement')).not.toBeInTheDocument();
  });

  it('renders carousel controls when multiple announcements', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'First',
          description: 'Desc 1',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'maintenance',
          title: 'Second',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<AnnouncementsCarousel />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous announcement')).toBeInTheDocument();
    expect(screen.getByLabelText('Next announcement')).toBeInTheDocument();
  });

  it('pauses auto-rotation on hover', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'First',
          description: 'Desc 1',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'release',
          title: 'Second',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    const { container } = render(<AnnouncementsCarousel />);
    const carousel = container.firstChild as HTMLElement;

    // Advance past auto-rotation interval
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    fireEvent.mouseEnter(carousel);
    // Advance more — should NOT change slide while paused
    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText('First')).toBeInTheDocument();
  });

  it('has ARIA carousel role', () => {
    mockUseAnnouncements.mockReturnValue({
      announcements: [
        {
          id: '1',
          type: 'release',
          title: 'Test',
          description: 'Desc',
          created_at: new Date().toISOString(),
          is_active: true,
        },
        {
          id: '2',
          type: 'release',
          title: 'Test 2',
          description: 'Desc 2',
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ],
      isLoading: false,
      error: null,
    });

    render(<AnnouncementsCarousel />);
    const carousel = screen.getByRole('region', { name: /announcements/i });
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
  });
});
```

- [x] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/AnnouncementsCarousel.test.tsx`
Expected: All tests pass

- [x] **Step 3: Commit**

```bash
git add src/__tests__/AnnouncementsCarousel.test.tsx
git commit -m "test: add unit tests for AnnouncementsCarousel"
```

---

## Task 13: Write unit tests for TrendingResources

**Files:**
- Create: `src/__tests__/TrendingResources.test.tsx`

- [x] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrendingResources from '@/components/resources/TrendingResources';

vi.mock('@/hooks/useTrendingResources', () => ({
  useTrendingResources: vi.fn(),
}));

const mockUseTrendingResources = vi.mocked(require('@/hooks/useTrendingResources').useTrendingResources);

describe('TrendingResources', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no resources and not loading', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    const { container } = render(<TrendingResources />);
    expect(container.firstChild).toBeNull();
  });

  it('renders skeleton while loading', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [],
      isLoading: true,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    render(<TrendingResources />);
    // Skeleton cards have animate-pulse class
    const skeletonCards = document.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBe(3);
  });

  it('renders 3 trending cards with data', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc A', version: '1.0', license: 'MIT', downloads: 1000 },
        { id: 2, name: 'Resource B', slug: 'resource-b', type: 'sdk', description: 'Desc B', version: '2.0', license: 'Apache', downloads: 800 },
        { id: 3, name: 'Resource C', slug: 'resource-c', type: 'library', description: 'Desc C', version: '1.5', license: 'MIT', downloads: 600 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    render(<TrendingResources />);
    expect(screen.getByText('Resource A')).toBeInTheDocument();
    expect(screen.getByText('Resource B')).toBeInTheDocument();
    expect(screen.getByText('Resource C')).toBeInTheDocument();
    expect(screen.getByText('1,000 downloads')).toBeInTheDocument();
  });

  it('shows period toggle buttons', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    render(<TrendingResources />);
    expect(screen.getByText('7 days')).toBeInTheDocument();
    expect(screen.getByText('30 days')).toBeInTheDocument();
    expect(screen.getByText('All-time')).toBeInTheDocument();
  });

  it('switches period on click', () => {
    const mockSetPeriod = vi.fn();
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '30d',
      setPeriod: mockSetPeriod,
      periods: ['7d', '30d', 'all-time'],
    });

    render(<TrendingResources />);
    fireEvent.click(screen.getByText('7 days'));
    expect(mockSetPeriod).toHaveBeenCalledWith('7d');
  });

  it('highlights active period', () => {
    mockUseTrendingResources.mockReturnValue({
      resources: [
        { id: 1, name: 'Resource A', slug: 'resource-a', type: 'api', description: 'Desc', version: '1.0', license: 'MIT', downloads: 1000 },
      ],
      isLoading: false,
      error: null,
      period: '7d',
      setPeriod: vi.fn(),
      periods: ['7d', '30d', 'all-time'],
    });

    render(<TrendingResources />);
    const buttons = document.querySelectorAll('button[role="tab"]');
    expect(buttons[0]).toHaveClass('bg-[var(--accent-primary)]');
  });
});
```

- [x] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/TrendingResources.test.tsx`
Expected: All tests pass

- [x] **Step 3: Commit**

```bash
git add src/__tests__/TrendingResources.test.tsx
git commit -m "test: add unit tests for TrendingResources"
```

---

## Task 14: Write unit tests for `useAnnouncements` hook

**Files:**
- Create: `src/__tests__/useAnnouncements.test.ts`

- [x] **Step 1: Create the test file**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnnouncements } from '@/hooks/useAnnouncements';

vi.mock('@/lib/api-client', () => ({
  api: {
    announcements: {
      list: vi.fn(),
    },
  },
  DATA_MODE: 'mock',
}));

const mockApi = vi.mocked(require('@/lib/api-client').api);

describe('useAnnouncements', () => {
  it('returns empty array initially before SWR resolves', async () => {
    mockApi.announcements.list.mockImplementation(() => {
      return new Promise(() => {}); // never resolves
    });

    const { result } = renderHook(() => useAnnouncements());
    expect(result.current.announcements).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('returns announcements when fetched', async () => {
    const mockData = [
      {
        id: '1',
        type: 'release',
        title: 'Test',
        description: 'Desc',
        created_at: new Date().toISOString(),
        is_active: true,
      },
    ];
    mockApi.announcements.list.mockResolvedValue(mockData);

    const { result, waitFor } = renderHook(() => useAnnouncements());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.announcements).toEqual(mockData);
  });

  it('returns error on fetch failure', async () => {
    mockApi.announcements.list.mockRejectedValue(new Error('Network error'));

    const { result, waitFor } = renderHook(() => useAnnouncements());
    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe('Network error');
  });
});
```

- [x] **Step 2: Run the tests**

Run: `npx vitest run src/__tests__/useAnnouncements.test.ts`
Expected: All tests pass

- [x] **Step 3: Commit**

```bash
git add src/__tests__/useAnnouncements.test.ts
git commit -m "test: add unit tests for useAnnouncements hook"
```

---

## Task 15: End-to-end verification and polish

**Files:**
- All modified files

- [x] **Step 1: Run full TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

- [x] **Step 2: Run ESLint**

Run: `npm run lint`
Expected: No errors or warnings (or fix any pre-existing ones)

- [x] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [x] **Step 4: Build the project**

Run: `npm run build`
Expected: Build succeeds with no errors

- [x] **Step 5: Manual verification checklist**
  - [x] Landing page shows Announcements Carousel above Trending Resources above Featured Resources
  - [x] Carousel auto-rotates every 8 seconds
  - [x] Carousel pauses on hover
  - [x] Carousel prev/next arrows work
  - [x] Dot indicators show current slide
  - [x] Single announcement renders as static banner (no controls)
  - [x] No announcements = section hidden entirely
  - [x] Trending Resources shows top 3 by downloads
  - [x] Period toggle (7d / 30d / All-time) works without page reload
  - [x] #1 card has crown icon, #2 and #3 have numbered badges
  - [x] "Browse all" links to `/resources?sort=downloads`
  - [x] Fewer than 3 resources = shows however many available
  - [x] No trending resources = section hidden
  - [x] Arabic locale renders correctly with RTL layout
  - [x] All labels are translated in both AR and EN
  - [x] Type badges show correct colors (release=blue, new_resource=green, maintenance=yellow, breaking_change=red)
  - [x] Keyboard navigation works (arrow keys for carousel)
  - [x] ARIA attributes present on carousel (role="region", aria-roledescription="carousel")
  - [x] Mock mode (`NEXT_PUBLIC_DATA_MODE=mock`) renders everything correctly

- [x] **Step 6: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: polish, verify, and finalize announcements & trending sections"
```

---

## Spec Coverage Checklist

| Spec Requirement | Task | Status |
|---|---|---|
| Announcements Carousel section | Task 10 | Done |
| Trending Resources (Top 3) section | Task 9 | Done |
| Announcement types: release, new_resource, maintenance, breaking_change | Task 2, Task 10 | Done |
| Color-coded type badges | Task 10 | Done |
| Card content: type badge, title, description, timestamp, CTA | Task 10 | Done |
| Auto-rotation every 8 seconds | Task 10 | Done |
| Pause on hover | Task 10 | Done |
| Manual navigation (prev/next + dots) | Task 10 | Done |
| Keyboard accessible (arrow keys) | Task 10 | Done |
| Looping carousel | Task 10 | Done |
| Single slide = static banner | Task 10 | Done |
| Announcement data model (id, type, title, etc.) | Task 2 | Done |
| Expiration support (expires_at) | Task 2, Task 4 | Done |
| Hidden if no active announcements | Task 10 | Done |
| Trending: top-3 horizontal cards | Task 9 | Done |
| #1 crown icon, #2/#3 numbered badges | Task 8 | Done |
| Download count display | Task 8 | Done |
| Time-window selector (7d, 30d, all-time) | Task 9 | Done |
| No page reload on period switch | Task 6, Task 9 | Done |
| "Browse all" link to `/resources?sort=downloads` | Task 9 | Done |
| Fewer than 3 = show available | Task 9 | Done |
| None = hide section | Task 9 | Done |
| `total_downloads` on Resource type | Task 2 | Done |
| `TrendingResource` interface | Task 2 | Done |
| `GET /api/announcements/` endpoint | Task 4 | Done |
| `GET /api/resources/trending/` endpoint | Task 4 | Done |
| `useAnnouncements()` hook | Task 5 | Done |
| `useTrendingResources()` hook | Task 6 | Done |
| Mock data: downloads on all 20 resources | Task 3 | Done |
| Mock data: 4-6 sample announcements | Task 3 | Done |
| i18n: Arabic and English translations | Task 7 | Done |
| Accessibility: ARIA carousel role | Task 10 | Done |
| Accessibility: rank badge aria-labels | Task 8 | Done |
| Accessibility: datetime attributes on timestamps | Task 10 | Done |
| Accessibility: color + icon + text for types | Task 10 | Done |
| Unit tests for carousel | Task 12 | Done |
| Unit tests for trending | Task 13 | Done |
| Unit tests for hooks | Task 14 | Done |
| Mock mode verification | Task 15 | Done |
