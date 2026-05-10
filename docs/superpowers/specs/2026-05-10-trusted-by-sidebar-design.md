# Trusted By — Sidebar Placement Design

**Date:** 2026-05-10
**Status:** Design approved

## Problem

The "Trusted By" section currently lives in the main content column (`lg:col-span-2`) and shows only 3 featured consumer avatars centered in a row. This wastes significant horizontal space in a two-thirds column. The remaining consumers are hidden behind a "Show more" toggle that loads them underneath. Meanwhile, the sidebar (`lg:col-span-1`) has unused vertical space.

## Solution

Move the entire "Trusted By" section to the sidebar, placed at the top above the existing "Access Request" card. This:
- Frees up the main content column for resource details
- Uses the sidebar's vertical space efficiently
- Shows all consumers at once (no collapse toggle)

## Design

### Layout

The sidebar already uses a `sticky top-6 space-y-6` layout with cards stacked vertically. The "Trusted By" section becomes the first card in this stack.

### Visual Design

- **Container:** Card with border, rounded corners, white background, subtle shadow
- **Header:** "TRUSTED BY" in uppercase, tracked out, muted text color (same as current)
- **Subtitle:** "Trusted by N applications" below the header
- **Logos:** 8 circular logo badges (38px) in a flex-wrap centered row, each with a deterministic gradient background derived from the consumer's name
- **Hover state:** Hovered logo scales up (1.1x) with a border highlight; other logos dim to 50% opacity; a colored info card appears below showing the consumer name (bold) and category
- **Click:** Opens the consumer's `website_url` in a new tab (if available and starts with `http`)

### Component Structure

```
TrustedBySidebar (new component, moved from TrustedBySection)
├── heading: "TRUSTED BY" (uppercase, tracked out)
├── subtitle: "Trusted by N applications"
├── logo cloud: flex-wrap row of ConsumerAvatar (38px)
└── hover tooltip card: name + category (shown on hover)
```

### ConsumerAvatar Adjustments

The existing `ConsumerAvatar` component will receive a new `size="sidebar"` variant:
- Avatar: 38px circle (previously: `featured` = 52px, `expanded` = 36px)
- No name or category text below the avatar (names shown only on hover)
- Same gradient logic, same click behavior

### Hover Tooltip

A separate `SidebarHoverCard` component (or inline state within `TrustedBySidebar`) that:
- Appears below the logo cloud when a logo is hovered
- Shows consumer name (bold) and category (small text)
- Has a colored background matching the hovered logo's gradient tone
- Disappears when mouse leaves the logo

### Data Flow

No changes to the data layer. The `Consumer` type and `resource.consumers` array remain the same. The component simply restructures the rendering.

### RTL Support

The layout uses Tailwind's flexbox (`flex-wrap`, `justify-content: center`), which works correctly in both LTR and RTL layouts. No RTL-specific changes needed.

### i18n

No new i18n keys needed. Existing keys are reused:
- `t.resource.detail.trustedBy` — "Trusted By" / "موثوق من قبل"
- `t.resource.detail.trustedByCount` — "Trusted by N applications" / "موثوق من قبل N تطبيق"

## Files Changed

| File | Change |
|------|--------|
| `src/components/resources/TrustedBySection.tsx` | Renamed/refactored to sidebar variant; remove featured/expanded sizes; add hover tooltip |
| `src/components/resources/ConsumerAvatar.tsx` | Add `size="sidebar"` variant (38px, no text below) |
| `src/app/resources/[slug]/ResourceDetailClient.tsx` | Move `<TrustedBySection>` from main column to sidebar |

## Files Unchanged

- `src/types/resource.ts` — Consumer type unchanged
- `src/i18n/messages/*.ts` — No new keys
- `src/lib/mock-data.ts` — No data changes
- Tests in `TrustedBySection.test.tsx` — Will be updated to match new structure
