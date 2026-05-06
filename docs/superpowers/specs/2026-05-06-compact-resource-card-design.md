---
date: 2026-05-06
status: approved
---

# Compact ResourceCard

## Goal

Reduce the vertical height of `ResourceCard` so grid listings (ResourceGrid, TrendingResources) display more items per screen without sacrificing scannability.

## Scope

- **In scope:** `ResourceCard.tsx`, `ResourceGrid.tsx`, `TrendingResources.tsx`, `ResourceCard.test.tsx`
- **Out of scope:** `RelatedResources.tsx` (keeps its own inline `RelatedResourceCard`)

## Design

### Structure Changes

| Aspect | Before | After |
|--------|--------|-------|
| Padding | `p-5` (20px) | `p-3` (12px) |
| Description | 180-char truncation, unlimited lines | `line-clamp-2` (2 lines max) |
| Footer | `border-t` divider, two-column layout (metadata left, actions right) | Single inline row, no divider |
| "Details →" link | Separate link in footer | Removed — entire card is clickable |
| Card click target | Name link + "Details" link | Whole card wraps in `<Link>` |
| Rank bar | `bg-[var(--accent-primary)]`, full-width top bar | Unchanged |
| GitHub link | Separate `<a>` in footer | Kept as separate `<a>` inside card (opens new tab) |

### Layout

```
┌─────────────────────────────────┐
│ #1  (rank bar, when present)    │  ← unchanged
├─────────────────────────────────┤
│ [Dataset]  Uthmani Quran Corpus │  ← badge + name on same line
│                                 │
│ Comprehensive dataset of the    │  ← 2-line clamp
│ Uthmani script with full text…  │
│                                 │
│ 12.4k ↓ • MIT • v2.1  ⌂        │  ← inline metadata row
└─────────────────────────────────┘
```

### Metadata Row

Single line at the bottom, space-between or gap-separated:

- `downloadCount` (when present) — formatted with `toLocaleString()`
- `license` (when present)
- `version` (when present) — subtle pill badge
- `github_url` icon (when present) — separate `<a>` link

Separators (`•`) appear conditionally between text items.

### Props Interface

No changes to the public API:

```ts
interface ResourceCardProps {
  resource: Resource;
  rank?: number;
  downloadCount?: number;
}
```

## Consumer Impact

- **ResourceGrid** — No code changes. Cards become more compact automatically.
- **TrendingResources** — No code changes. Rank bar and download count preserved.
- **RelatedResources** — Not affected. Uses its own `RelatedResourceCard`.

## Accessibility

- Whole-card click via `<Link>` wrapping content (screen readers announce as link)
- Rank bar keeps `aria-label="Rank N"`
- GitHub link remains a distinct `<a>` element (not swallowed by card link)
- RTL: metadata row flows naturally; GitHub icon has no directional arrow

## Testing

- Update `ResourceCard.test.tsx` assertions:
  - Remove "Details" link assertion
  - Assert inline metadata row structure
  - Assert whole-card `<Link>` with correct `href`
  - Assert `line-clamp-2` on description
  - Rank bar tests unchanged
