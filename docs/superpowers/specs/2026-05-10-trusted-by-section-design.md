# Trusted By Section — Design Spec

**Date:** 2026-05-10
**Status:** Approved
**Page:** Resource Detail (`/resources/[slug]`)

## Overview

A "Trusted By" section on the resource detail page that displays well-known apps and organizations consuming this resource. Functions as a social proof / trust signal for visitors evaluating the resource's real-world adoption.

## Decisions

| Decision | Choice |
|---|---|
| Purpose | Social proof and trust signal for visitors |
| Placement | Main content, below GitHub stats, above Comments |
| Visual format | Logo grid (3-column cards with icon, name, category) |
| Data source | Publisher-managed + Admin-curated (hybrid) |
| Empty state | Section hidden entirely when no data |
| Expand behavior | 6 cards (3×2) visible, click to expand all |
| Interactivity | Each card links to the consumer's website |

## Data Model

### New Interface: `Consumer`

```typescript
interface Consumer {
  name: string;           // Display name (e.g., "Quran.com")
  logo_url?: string;      // Optional logo image URL (SVG/PNG, ~96×96)
  website_url: string;    // URL to the consumer's website
  category?: string;      // Optional category label (e.g., "Mobile App", "Website", "Research")
}
```

### Updated `Resource` Interface

Add to existing `Resource` type in `src/types/resource.ts`:

```typescript
consumers?: Consumer[];
```

## Component Architecture

### `TrustedBySection`

- **Responsibility:** Section wrapper that conditionally renders based on data availability
- **Props:** `consumers: Consumer[]`
- **Behavior:** Returns `null` if `consumers` is empty or undefined — no empty state rendered
- **Placement:** Rendered in `ResourceDetailClient.tsx` between `GithubStatsCard` and `CommentSection`

### `ConsumerGrid`

- **Responsibility:** Renders the 3-column grid and manages expand/collapse state
- **State:** `expanded: boolean` — controls whether all cards or just the first 6 are shown
- **Default:** Collapsed (6 cards visible)
- **Expand trigger:** Click on the "+N" placeholder card at the end of the grid
- **Collapse trigger:** "Show less" button appears when expanded

### `ConsumerCard`

- **Responsibility:** Displays a single consumer as a clickable card
- **Props:** `consumer: Consumer`
- **Display:**
  - Icon area: logo image if `logo_url` is provided; otherwise, a colored circle with the consumer's initial(s)
  - Name: consumer `name` text
  - Category: optional `category` label in muted text
- **Interaction:** Entire card is clickable, opens `website_url` in a new tab (`target="_blank" rel="noopener noreferrer"`)

## Visual Design

### Grid Layout

- 3 columns on desktop (`lg:grid-cols-3`)
- 2 columns on tablet (`md:grid-cols-2`)
- 1 column on mobile (`grid-cols-1`)
- Card gap: `gap-3` (12px)

### Card Design

- Background: `bg-[var(--bg-card)]` with `border border-[var(--border-color)]`
- Border radius: `rounded-xl`
- Padding: `p-5`
- Hover: subtle border color change (`hover:border-[var(--accent-primary)]`)
- Cursor: `cursor-pointer` (interactive)

### Icon Area

- Size: `w-12 h-12` (48px)
- Border radius: `rounded-xl`
- If logo present: `<img>` with `object-cover`, rounded corners
- If no logo: colored circle with gradient, white text showing consumer initial(s)
- Gradient colors: rotate through a predefined palette based on index

### Typography

- Section title: `font-heading text-lg font-semibold`
- Consumer name: `font-medium text-sm`
- Category: `text-xs text-[var(--text-muted)]`

### "+N" Placeholder Card

- Dashed border to indicate "more available"
- Centered `+N` text in muted color
- Clickable to expand

### "Show Less" Button

- Appears only when expanded
- Centered below the grid
- Outlined style, small text

## i18n

### English (`src/i18n/messages/en.ts`)

```typescript
trustedBy: 'Used By',
trustedByCount: 'Trusted by {{count}} {{count, plural, one{application} other{applications}}}',
showMore: 'Show more',
showLess: 'Show less',
```

### Arabic (`src/i18n/messages/ar.ts`)

```typescript
trustedBy: 'يُستخدم بواسطة',
trustedByCount: 'موثوق من قبل {{count}} {{count, plural, one{تطبيق} other{تطبيق}}}',
showMore: 'عرض المزيد',
showLess: 'عرض أقل',
```

## Integration Points

### Resource Detail Page (`ResourceDetailClient.tsx`)

Insert the `TrustedBySection` component between the `GithubStatsCard` and `CommentSection` in the main content column:

```tsx
{/* GitHub Stats */}
{resource.github_url && (
  <GithubStatsCard githubUrl={resource.github_url} stats={resource.github_stats} />
)}

{/* Trusted By */}
{resource.consumers && resource.consumers.length > 0 && (
  <TrustedBySection consumers={resource.consumers} />
)}

{/* Comments */}
<CommentSection resourceId={resource.id} />
```

### Publisher Dashboard (future)

The resource edit form in the developer dashboard will need a sub-section for managing consumers. This is out of scope for this spec but the data model supports it.

## Error Handling

- Missing `logo_url`: gracefully fall back to initial avatar
- Invalid `website_url`: card is not clickable (no `href` rendered)
- Network failure loading logo image: fall back to initial avatar

## Testing Considerations

- Component renders `null` when `consumers` is empty
- Component renders grid when `consumers` has 1–6 items (no "+N" placeholder)
- Component renders 6 cards + "+N" when `consumers` has 7+ items
- Expand/collapse toggles correctly
- All cards are clickable with correct `href`
- RTL layout works correctly (grid direction, card alignment)
- Responsive breakpoints (1 col mobile, 2 col tablet, 3 col desktop)
