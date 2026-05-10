# Trusted By Section Redesign

## Overview

Redesign the "Trusted By" section on the resource detail page to be more elegant and refined. The current implementation uses a grid of bordered cards with a dashed "+N" placeholder. The new design replaces this with a compact, centered row of round avatars with smooth expand/collapse behavior.

## Current State

- **TrustedBySection** wrapper: heading + count subtitle + ConsumerGrid
- **ConsumerGrid**: 3-column grid, 6 visible consumers, dashed "+N" expand button
- **ConsumerCard**: Bordered card with gradient avatar (logo or initials), name, category
- Cards are clickable if a website URL is present

## Design Decisions

| Decision | Choice |
|---|---|
| Layout pattern | Compact centered row with smooth expand |
| Heading | "TRUSTED BY" (uppercase, tracked out) |
| Subtitle | "Trusted by N applications" |
| Featured consumers | 3 in a centered row |
| Avatar shape | Round (50% border-radius) |
| Avatar size (featured) | 52px |
| Avatar size (expanded) | 38px |
| Expand trigger | "Show all N →" link with dashed underline |
| Expanded state | Wrapping row of smaller avatars + names |
| Interactions | All avatars are clickable links to consumer websites |
| Hover effect | Subtle scale + ring highlight |
| Animation | Smooth fade-in (300ms ease) for expanded consumers |
| Responsive | Wraps naturally; featured avatars scale to 44px on small screens |

## Component Structure

### New Components

**TrustedBySection** (updated)
- Props: `consumers: Consumer[]`
- State: `expanded: boolean`
- Renders: heading, subtitle, 3 featured consumers, expand/collapse trigger, expanded list

**ConsumerAvatar** (new, extracted from ConsumerCard)
- Props: `consumer: Consumer`, `size: 'featured' | 'expanded'`
- Renders: round avatar (logo or initials fallback) wrapped in a link if `website_url` is present
- Hover: scale + ring highlight animation

### Behavior

1. **Initial render:** Show 3 featured consumers in a centered row. Each avatar is 52px with a gradient background and subtle shadow. Below, show the "Show all N →" link.
2. **On expand:** Fade in the remaining consumers in a wrapping row with 38px avatars and names. The trigger changes to "Show less".
3. **On collapse:** Fade out the expanded consumers. Trigger reverts to "Show all N →".
4. **Click on avatar:** Opens the consumer's `website_url` in a new tab (if present).
5. **No consumers:** Section is hidden (null return), same as current behavior.

### Responsive Breakpoints

| Breakpoint | Featured avatar | Expanded avatar | Layout |
|---|---|---|---|
| `≥ 768px` | 52px | 38px | Centered row |
| `< 768px` | 44px | 32px | Centered row, tighter gaps |

## i18n Changes

Update `src/i18n/messages/en.ts` and `src/i18n/messages/ar.ts`:

| Key | Current Value | New Value |
|---|---|---|
| `resource.detail.trustedBy` | "Used By" | "Trusted By" |
| `resource.detail.trustedByCount` | "Trusted by {{count}} applications" | "Trusted by {{count}} applications" (unchanged) |
| `resource.detail.showMore` | "Show more" | (unused, remove) |
| `resource.detail.showLess` | "Show less" | (keep, used for collapse) |

## ConsumerGrid Component

The `ConsumerGrid` component will be **removed** as its functionality is absorbed into the updated `TrustedBySection`. The `ConsumerCard` component may be kept if used elsewhere, otherwise removed.

## Files to Modify

1. `src/components/resources/TrustedBySection.tsx` — Complete redesign
2. `src/i18n/messages/en.ts` — Update heading text
3. `src/i18n/messages/ar.ts` — Update heading text
4. `src/components/resources/ConsumerGrid.tsx` — Remove (or keep if used elsewhere)
5. `src/components/resources/ConsumerCard.tsx` — Remove (or keep if used elsewhere)

## Files to Add

1. `src/components/resources/ConsumerAvatar.tsx` — New avatar component

## Testing

- Update `src/__tests__/TrustedBySection.test.tsx` to test the new expand/collapse behavior
- Add tests for the new `ConsumerAvatar` component
- Verify RTL layout works correctly (Arabic locale)
