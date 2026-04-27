# Resource Detail Page: Report & Preview Features

**Date:** 2026-04-27
**Status:** Design approved
**Project:** Next.js 16 + React 19 + SWR + Tailwind CSS + bilingual (Arabic RTL / English LTR)

---

## Overview

Two features to be added to the resource detail page (`/src/app/resources/[slug]/ResourceDetailClient.tsx`):

1. **Report feature** — Allow authenticated users to report a resource via a modal dialog
2. **Preview section** — Show type-specific previews (API, SDK, dataset, audio, PDF, JSON) above the description

---

## Architecture

```
src/components/resources/
  ├── ReportButton.tsx          # Inline report button (flag icon)
  ├── ReportModal.tsx           # Modal dialog for report submission
  ├── ResourcePreview.tsx       # Preview section (collapsible, above description)
  └── preview/
        ├── ApiPreview.tsx      # API: docs + interactive test
        ├── SdkPreview.tsx      # SDK: install command + code samples
        ├── DatasetPreview.tsx  # Dataset: sample table + stats
        ├── AudioPreview.tsx    # Audio: waveform + player
        ├── PdfPreview.tsx      # PDF: thumbnail + text excerpt
        └── JsonPreview.tsx     # JSON: formatted tree viewer

src/hooks/
  ├── useReport.ts              # Report submission + validation
  └── usePreview.ts             # Preview data fetching (hybrid: publisher + auto-fetch)
```

Both features are isolated units. The `ResourceDetailClient` composes them together.

---

## Feature 1: Report

### Purpose
Allow users to flag resources for moderation. Reports are hidden from public view and only visible to resource publishers and admins in their dashboard.

### Components

#### `ReportButton.tsx`
- Small inline button with flag icon and "Report" label
- Placed in the sidebar, near the AccessRequestButton
- Tooltip on hover: "Report this resource"
- If user is logged in → opens `ReportModal`
- If user is not logged in → redirects to `/login?redirect=/resources/[slug]`

#### `ReportModal.tsx`
- Modal dialog (centered, backdrop blur)
- Fields:
  - Reason: dropdown with 6 options (required)
  - Details: textarea, optional, 500 char limit
- Buttons: Submit (primary), Cancel (secondary)
- On submit: calls `useReport` hook, closes modal, shows toast

### Data Model

Extended `ReportReason` type in `src/types/resource.ts`:

```typescript
type ReportReason = 'inaccurate' | 'inappropriate' | 'infringing' | 'spam' | 'outdated' | 'broken-link';
```

Existing types (no changes needed):
- `Report` — already defined with `id, reporter_name, resource_slug, reason, details, status, created_at`
- `ReportStatus` — already defined as `'open' | 'resolved' | 'closed'`

### Data Flow

1. User clicks `ReportButton`
2. If logged in → `ReportModal` opens
3. User selects reason (required) + optional details → clicks Submit
4. `useReport.submitReport()` calls `api.reports.submit({ resource: slug, reason, details })`
5. On success: modal closes, toast "Report submitted successfully" appears
6. On error: toast shows error message

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Network failure | Toast: "Failed to submit report. Please try again." |
| Auth expired | Redirect to `/login?redirect=/resources/[slug]` |
| Duplicate report (same user, same resource) | Toast: "You've already reported this resource." |
| Invalid form (empty reason) | Inline validation error on dropdown |

### i18n Keys

New keys under `report.*`:
- `report.button` — "Report"
- `report.modal.title` — "Report this resource"
- `report.reason.label` — "Reason"
- `report.reason.inaccurate` — "Inaccurate"
- `report.reason.inappropriate` — "Inappropriate"
- `report.reason.infringing` — "Infringing"
- `report.reason.spam` — "Spam"
- `report.reason.outdated` — "Outdated"
- `report.reason.broken-link` — "Broken link"
- `report.details.label` — "Details (optional)"
- `report.submit` — "Submit Report"
- `report.cancel` — "Cancel"
- `report.success` — "Report submitted successfully"
- `report.error` — "Failed to submit report"
- `report.duplicate` — "You've already reported this resource"

---

## Feature 2: Preview Section

### Purpose
Show type-specific previews of resources above the description section, helping users understand what each resource offers before requesting access.

### Component: `ResourcePreview.tsx`

- Full-width section placed **above the description card** in `ResourceDetailClient`
- Collapsible by default (chevron toggle, collapsed on first visit, stored in localStorage)
- Section header: "Preview"
- Type-specific preview content rendered by the appropriate sub-component
- Loading state: skeleton placeholder
- Empty state: "Preview not available for this resource"
- **Hidden entirely** for `library` and `tafsir` types (no preview data)

### Type-Specific Previews

| Resource Type | Publisher Fields | Auto-Fetch Fallback | Display |
|--------------|-----------------|---------------------|---------|
| **API** | `api_endpoint`, `api_docs`, `api_test_url` | GitHub README, Swagger URL from `documentation_url` | Code block with endpoint + "Try it" button |
| **SDK** | `sdk_install_command`, `sdk_examples` | GitHub README code blocks, `package.json`/`pubspec.yaml` from `github_url` | Install command block + code sample tabs |
| **Dataset** | `dataset_sample_data`, `dataset_stats` | CSV/JSON file from `github_url` | Data table (first 10 rows) + stats cards (rows, columns, size) |
| **Audio** | `audio_url`, `audio_thumbnail` | N/A (must be publisher-provided) | Audio player with controls + thumbnail |
| **PDF** | `pdf_url`, `pdf_excerpt` | N/A (must be publisher-provided) | PDF cover thumbnail + first 200 chars excerpt |
| **JSON** | `json_content` | N/A (must be publisher-provided) | Syntax-highlighted JSON tree viewer |

### Data Flow (Hybrid)

1. `usePreview(slug, resourceType)` hook is called in `ResourcePreview`
2. First checks publisher-provided fields on the `Resource` object
3. If publisher fields are empty, attempts auto-fetch from `github_url` or `documentation_url`
4. Renders the appropriate preview sub-component with whatever data is available
5. If no data at all → shows "Preview not available for this resource"

### Preview Sub-Components

Each sub-component is a self-contained `'use client'` component receiving preview data as props:

- `ApiPreview` — Shows endpoint, docs link, interactive "Try it" button (sends a test request to `api_endpoint`)
- `SdkPreview` — Shows install command (copy-to-clipboard), code examples in tabs
- `DatasetPreview` — Shows sample data table, stats cards (row count, column count, file size)
- `AudioPreview` — Shows audio player with controls, thumbnail image
- `PdfPreview` — Shows PDF cover/thumbnail, excerpt text
- `JsonPreview` — Shows formatted JSON tree with collapsible nodes

### Resource Model Extensions

New optional fields on the `Resource` interface in `src/types/resource.ts`:

```typescript
interface Resource {
  // ... existing fields ...
  api_endpoint?: string | null;
  api_docs?: string | null;
  api_test_url?: string | null;
  sdk_install_command?: string | null;
  sdk_examples?: string | null;
  dataset_sample_data?: string | null;
  dataset_stats?: string | null;
  audio_url?: string | null;
  audio_thumbnail?: string | null;
  pdf_url?: string | null;
  pdf_excerpt?: string | null;
  json_content?: string | null;
}
```

### i18n Keys

New keys under `preview.*`:
- `preview.title` — "Preview"
- `preview.unavailable` — "Preview not available for this resource"
- `preview.collapse` — "Collapse preview"
- `preview.expand` — "Expand preview"
- `preview.api.endpoint` — "Endpoint"
- `preview.api.try_it` — "Try it"
- `preview.sdk.install` — "Install"
- `preview.sdk.copied` — "Copied!"
- `preview.dataset.rows` — "Rows"
- `preview.dataset.columns` — "Columns"
- `preview.dataset.size` — "Size"
- `preview.json.format` — "Formatted JSON"

---

## Integration Points

### `ResourceDetailClient.tsx` Changes

1. Import `ReportButton` and `ResourcePreview`
2. Place `ResourcePreview` above the description card (conditional: only for types that support preview)
3. Place `ReportButton` in the sidebar near the AccessRequestButton

### `page.tsx` (Server Component) Changes

- Fetch extended resource data including preview fields from the API
- No changes to ISR/revalidate settings

### `api-client.ts` Changes

- `submitReport` already exists — no changes needed
- `fetchResource` already returns full resource object — preview fields will be included automatically when backend adds them

### `useResources.ts` Changes

- No changes needed — `useResource` hook already returns the full `Resource` object

---

## Non-Goals (Out of Scope)

- Report management UI (viewing/editing reports) — handled in publisher/admin dashboard
- Report notifications — handled separately
- Preview data editing UI — handled in resource form (dashboard)
- Real-time preview updates — static preview at time of page load

---

## Testing Considerations

- Report modal: test login redirect, form validation, submission success/error
- Preview section: test each resource type, empty states, loading states, collapse/expand
- RTL support: verify all new components render correctly in Arabic mode
- i18n: verify all new keys exist in both `en.ts` and `ar.ts`
