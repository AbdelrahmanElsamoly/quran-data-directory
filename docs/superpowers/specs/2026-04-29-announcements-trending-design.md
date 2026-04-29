# Announcements & Trending Resources — Landing Page Sections

**Date:** 2026-04-29
**Status:** Approved

## Overview

Add two new sections to the landing page (`/`) above the existing Featured Resources section:

1. **Announcements Carousel** — a full-width, auto-rotating banner displaying platform-wide announcements
2. **Trending Resources** — a top-3 ranked display of the most downloaded resources

## Page Structure (After)

```
Hero Section
Stats Bar
CTA Section
├── Announcements Carousel    ← NEW
├── Trending Resources (Top 3) ← NEW
└── Featured Resources        ← EXISTING
```

---

## Section 1: Announcements Carousel

### Purpose

Surface time-sensitive, platform-wide information to visitors without requiring them to navigate to individual resource pages or follow external channels.

### Announcement Types

| Type | Label | Trigger | Color | Icon |
|------|-------|---------|-------|------|
| `release` | "New Release" | Auto — resource version change | Blue | Release tag |
| `new_resource` | "New Resource" | Auto — new resource published | Green | Plus/add |
| `maintenance` | "Maintenance" | Manual — admin-created | Yellow | Wrench/tools |
| `breaking_change` | "Breaking Change" | Manual — admin-created | Red | Alert/warning |

- **Auto-generated** announcements are created by the backend when a resource's version changes or a new resource is published. They link to the relevant resource page.
- **Manual** announcements are created by admins via the dashboard for maintenance windows, platform-wide notices, or breaking changes.

### Card Content

Each carousel slide displays:

- **Type badge** (color-coded per table above)
- **Title** — e.g., "Quran API v2.1 Released", "Scheduled Maintenance: Dec 15–16"
- **Short description** — 1–2 lines of context
- **Timestamp** — relative (e.g., "2 days ago")
- **Optional CTA link** — e.g., "View changelog", "See resource", "Learn more"

### Carousel Behavior

- **Auto-rotation:** Advances every 8 seconds (disabled if only 1 slide)
- **Pause on hover:** Rotation stops when the user hovers over the carousel
- **Manual navigation:** Prev/next arrows + dot indicators (hidden if only 1 slide)
- **Keyboard accessible:** Arrow keys to navigate, Enter/Space to activate CTA
- **Looping:** Carousel loops back to the first slide after the last
- **Single slide:** If only 1 announcement exists, render as a static banner (no carousel controls)

### Data Model

```typescript
interface Announcement {
  id: string;
  type: 'release' | 'new_resource' | 'maintenance' | 'breaking_change';
  title: string;
  description: string;
  resource_id?: string;    // linked resource (for auto-generated announcements)
  cta_url?: string;        // optional link
  cta_label?: string;      // optional link text
  created_at: string;
  expires_at?: string;     // optional expiration
  is_active: boolean;
}
```

### Expiration

Announcements have an optional `expires_at` field. Expired announcements are hidden from the carousel but retained in the database. Admins can also manually deactivate announcements via `is_active: false`.

---

## Section 2: Trending Resources (Top 3)

### Purpose

Highlight the most popular resources based on community usage (downloads), giving visitors a quick way to discover what's widely adopted.

### Layout

A horizontal row of **3 large cards** with prominent rank indicators:

- **#1 card** — Slightly larger/taller than #2 and #3, with a crown icon badge
- **#2 and #3 cards** — Equal size, with numbered rank badges

Each card displays:

- **Rank badge** (crown for #1, numbered for #2/#3)
- **Resource type badge** (reuses existing `Badge` component)
- **Resource name**
- **One-line description**
- **Download count** (e.g., "1,240 downloads")
- **Mini metadata** (version, license)
- **"View resource" link**

A **"Browse all"** link at the bottom-right navigates to `/resources?sort=downloads`.

### Time-Window Selector

A toggle/dropdown above the section lets the user filter by period:

- `7d` — Past 7 days
- `30d` — Past 30 days (default)
- `All-time` — Total downloads since launch

Switching the period updates the ranking without a full page reload.

### Distinction from Featured Resources

| | Trending | Featured |
|---|---|---|
| **Selection** | Community-driven (downloads) | Curated (`itqan_badge`) |
| **Layout** | Horizontal top-3, ranked | Standard grid |
| **Signal** | Popularity | Quality/verification |

### Data Model Addition

The backend must track downloads per resource with timestamps to support period-based ranking. The API response for `/api/resources/trending/` should return resources with a `downloads` count scoped to the requested period.

The `Resource` type gains a `total_downloads` field (all-time count) for display:

```typescript
interface Resource {
  // ... existing fields
  total_downloads: number;
}
```

The trending endpoint returns a lightweight projection:

```typescript
interface TrendingResource {
  id: string;
  name: string;
  slug: string;
  type: ResourceType;
  description: string;
  version: string;
  license: string;
  downloads: number;  // scoped to the requested period
}
```

### Empty State

- **Announcements:** If no active announcements exist, the carousel section is hidden entirely (no empty banner).
- **Trending:** If fewer than 3 resources have downloads, display however many are available (1 or 2). If none, hide the section.

---

## API Endpoints

### New Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/announcements/` | List active announcements | Public |
| `POST` | `/api/announcements/` | Create announcement | Admin |
| `PUT` | `/api/announcements/:id/` | Update/dismiss announcement | Admin |
| `GET` | `/api/resources/trending/?period=30d&limit=3` | Top resources by downloads | Public |

### Existing Endpoints (No Change)

- `GET /api/resources/` — Still used by Featured Resources, catalog, etc.

---

## Client-Side Changes

### New Hooks

- `useAnnouncements()` — Fetches active announcements via SWR (matches existing `useResources` pattern)
- `useTrendingResources(period: '7d' | '30d' | 'all-time')` — Fetches trending resources for the given period

### New Components

- `AnnouncementsCarousel` — Full-width carousel with auto-rotation, color-coded slides
- `TrendingResources` — Top-3 layout with rank badges and time-window toggle
- `TrendingCard` — Individual ranked resource card (distinct from `ResourceCard`)

### Type Additions

- `Announcement` interface
- `downloads` field on `Resource`
- `TrendingPeriod` type (`'7d' | '30d' | 'all-time'`)

### Mock Data

Extend `src/lib/mock-data.ts`:
- Add `downloads` field to all 20 mock resources
- Add 4–6 sample announcements covering all four types

### i18n

All labels, type names, timestamps, and CTAs require Arabic (`ar`) and English (`en`) translations.

---

## Testing

- **Unit tests:** Carousel auto-rotation (timing, pause-on-hover), time-window toggle state, ranking sort logic
- **Component tests:** Carousel keyboard navigation, ARIA attributes, screen-reader output for relative timestamps
- **Mock mode:** Verify both sections render correctly in `NEXT_PUBLIC_DATA_MODE=mock`

## Accessibility

- Carousel: `role="region"` with `aria-label`, `aria-roledescription="carousel"`, keyboard-navigable
- Rank badges: `aria-label` with ordinal ("1st place", "2nd place", "3rd place")
- Timestamps: `datetime` attribute for screen readers, relative text for visual users
- Color coding: Type badges use color + icon + text (not color alone)
