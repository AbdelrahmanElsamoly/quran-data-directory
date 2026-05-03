# Unify Trending and Featured Cards via ResourceCard Extension

## Overview

Extend `ResourceCard` with optional `rank` and `downloadCount` props so both the Trending Resources and Featured Resources sections use the same component. This eliminates visual drift between the two card implementations.

## Changes

### ResourceCard.tsx

Add two optional props to `ResourceCardProps`:

```typescript
interface ResourceCardProps {
  resource: Resource;
  rank?: number;           // If provided, show #N badge at top-left
  downloadCount?: number;  // If provided, show in bottom bar
}
```

**Rank badge behavior:**
- Rendered only when `rank` prop is provided
- Positioned absolutely at top-left of the card (`top-3 left-3`, RTL-aware with `right-3`)
- Style: `w-7 h-7 rounded-full bg-[var(--accent-primary)] text-white text-sm font-bold`
- Text: `#${rank}`
- Card container gets `relative` positioning; main content gets `pt-8` to avoid overlap

**Download count behavior:**
- Rendered only when `downloadCount` prop is provided
- Appears in the bottom bar as the first item in the left metadata group
- Format: `{downloadCount.toLocaleString()} downloads`
- Style: `text-xs text-[var(--text-muted)]`
- Separated from adjacent items with `•` bullet

### TrendingResources.tsx

- Replace `TrendingCard` usage with `ResourceCard`
- Map each `TrendingResource` to a partial `Resource` object
- Pass `rank` and `downloadCount={resource.downloads}` props
- Remove `TrendingCard` import

### TrendingCard.tsx

- Delete this file (functionality absorbed into ResourceCard)

### TrendingResource type (types/announcement.ts)

- No changes needed — `TrendingResource` is already a compatible subset of `Resource` for the fields we use

## Data Mapping

| TrendingResource field | Resource field | Notes |
|------------------------|----------------|-------|
| `id` | `id` | Direct |
| `name` | `name` | Direct |
| `slug` | `slug` | Direct |
| `type` | `type` | Direct (type cast to `ResourceType`) |
| `description` | `description` | Direct |
| `version` | `version` | Direct |
| `license` | `license` | Direct |
| `downloads` | (prop) | Passed as `downloadCount` |
| — | `github_url` | Not available, defaults to `null` |
| — | `itqan_badge` | Not available, defaults to `false` |
| — | `github_stats` | Not available, defaults to `null` |

## Visual Result

Both sections share identical card styling. The only differences:
- Trending cards: `#N` rank badge at top-left, download count in bottom bar
- Featured cards: GitHub icon (when `github_url` exists), Itqan verified badge (when `itqan_badge` is true)

## Files Changed

- `src/components/resources/ResourceCard.tsx` — Add `rank` and `downloadCount` props
- `src/components/resources/TrendingResources.tsx` — Use `ResourceCard` instead of `TrendingCard`
- `src/components/resources/TrendingCard.tsx` — Delete
