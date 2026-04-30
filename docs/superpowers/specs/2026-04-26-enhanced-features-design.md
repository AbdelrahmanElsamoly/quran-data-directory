# Enhanced Features — Design

**Date:** 2026-04-26
**Scope:** Session 5a (Reports + Stats + Versioning) and Session 5b (Preview + Announcements)
**Pattern:** Frontend-first with mock data, same approach as Session 2. Backend implemented in a later session.

---

## Session 5a: Reports + Stats + Versioning

### Build Order

1. Enhanced Reports (backend model + API + frontend form)
2. Resource Stats (backend tracking + frontend stat cards)
3. Versioning (backend model + API + frontend accordion)

### Feature 1: Enhanced Reports

**Reasons** (6 categories):
- Inaccurate/Misleading
- Inappropriate
- Broken Links
- Outdated
- Copyright
- Other

**Status workflow** (4 states):
`submitted` → `under_review` → `resolved` / `dismissed`

**Comment access:** Reporter + admins + resource publishers can comment on reports about their resources.

**Model changes (`apps/reports/models.py`):**
- Add `reason` CharField with 6 choices
- New `ReportComment` model: ForeignKey to Report, author, body, is_internal flag, created_at
- Add `status` CharField with 4 choices

**API changes:**
- `POST /api/v1/reports/` — accepts `reason` (required) + `comment`
- `GET /api/v1/reports/{id}/comments/` — list comments
- `POST /api/v1/reports/{id}/comments/` — add comment (authenticated, restricted by role)

**Frontend:**
- `src/components/resources/ReportForm.tsx` — reason radio buttons + textarea, navigates to `/resources/[slug]/report/`
- `src/components/reports/ReportThread.tsx` — shows report status + comment thread (gated)
- Update mock data to include `reason` and `comments` on reports

### Feature 2: Resource Stats

**Metrics:** Downloads count + Views count. Exact numbers, visible to everyone.

**Model changes (`apps/resources/models.py`):**
- Add `download_count` IntegerField (default 0)
- Add `view_count` IntegerField (default 0)

**API changes:**
- Include `download_count`, `view_count` in `GET /api/v1/resources/{slug}/` detail response
- `POST /api/v1/resources/{slug}/track-view/` — increment view (lightweight, no auth)
- `POST /api/v1/resources/{slug}/track-download/` — increment download (after access approval)

**Frontend:**
- `src/components/resources/ResourceStats.tsx` — three stat cards (downloads, views, growth %)
- `src/lib/tracking.ts` — fire-and-forget view tracking via `navigator.sendBeacon()`
- Update mock data to include `download_count`, `view_count`
- Update `useResources` hook to include stats fields

### Feature 3: Versioning

**Version strings:** Freeform (no semver enforcement). Publishers write whatever they want.

**Model changes (`apps/resources/models.py`):**
- New `ResourceVersion` model: resource FK, version (string), release_notes (text), download_url, is_latest, published_at, file_size, changelog_url, created_at
- Signal: when new version created with `is_latest=true`, unmark previous latest

**API changes:**
- `GET /api/v1/resources/{slug}/versions/` — list all versions, ordered by published_at DESC
- `GET /api/v1/resources/{slug}/versions/latest/` — latest version shortcut
- `POST /api/v1/resources/{slug}/versions/` — create version (publisher only)
- `PATCH /api/v1/resources/versions/{id}/` — update (publisher only)
- `DELETE /api/v1/resources/versions/{id}/` — delete (publisher only)
- Include `latest_version` nested object in resource detail response

**Frontend:**
- `src/components/resources/VersionHistory.tsx` — collapsible accordion, each version shows version badge, date, file size, release notes preview, download link. Latest version highlighted with badge.
- `src/components/resources/LatestVersionBadge.tsx` — compact version indicator near resource name
- `src/lib/version-tracking.ts` — localStorage tracking of last-seen version per resource, shows "updated" indicator on resource card
- Update mock data to include `versions` array and `latest_version` on resources
- New hook: `src/hooks/useResourceVersions.ts`

---

## Session 5b: Preview + Announcements

### Build Order

1. Content Preview (type-specific preview components)
2. Announcements (new pages + home page section)

### Feature 4: Content Preview

**Who populates:** Publishers fill structured preview data in dashboard. System renders the preview automatically.

**Preview types and rendering:**

| Resource Type | Preview Rendering |
|--------------|-------------------|
| Library | Rendered markdown (README-style) + file tree snippet |
| SDK | Code example block + install command with copy button |
| Dataset | Sample data table (first N rows) + schema preview |
| API | Endpoint list with method badges + sample request/response |
| Audio | Audio player widget + track listing / metadata |
| PDF | PDF viewer embed + metadata |
| JSON | Syntax-highlighted collapsible tree viewer |

**No preview available:** If `preview_content` is null/empty, show "Preview not available" message. No screenshot upload.

**Model changes (`apps/resources/models.py`):**
- Add `preview_content` JSONField (null, blank)
- Add `preview_type` CharField (auto-set based on resource type + content presence)

**API changes:**
- Include `preview_content` in detail response only (not list response)

**Frontend:**
- `src/components/resources/ContentPreview.tsx` — main container, dispatches to type-specific sub-components
- `src/components/resources/previews/LibraryPreview.tsx` — markdown rendering
- `src/components/resources/previews/SDKPreview.tsx` — code block + install command
- `src/components/resources/previews/DatasetPreview.tsx` — data table + schema
- `src/components/resources/previews/APIPreview.tsx` — endpoint list + sample response
- `src/components/resources/previews/AudioPreview.tsx` — audio player + metadata
- `src/components/resources/previews/PDFPreview.tsx` — PDF embed
- `src/components/resources/previews/JSONPreview.tsx` — collapsible JSON tree
- Update mock data to include `preview_content` on sample resources
- Layout: preview section below resource description, above related resources. Collapsible on mobile.

### Feature 5: Announcements

**Who creates:** Admins only.

**Announcement types:**
- New Resource
- Resource Updated
- Platform News
- Maintenance
- Community Update

**Model changes (`apps/announcements/models.py` — new app):**
- `title` CharField (200 chars)
- `slug` SlugField (unique)
- `body` TextField (markdown)
- `announcement_type` CharField with 5 choices
- `resource` ForeignKey to Resource (nullable, links announcement to a specific resource)
- `is_pinned` BooleanField (default false)
- `published_at` DateTimeField
- `created_by` ForeignKey to User
- `created_at` / `updated_at` timestamps

**API changes:**
- `GET /api/v1/announcements/` — list with `?type=X&limit=N` filters
- `GET /api/v1/announcements/{slug}/` — detail
- `POST /api/v1/announcements/` — create (admin only)

**Frontend:**
- `src/app/announcements/page.tsx` — listing page with filter tabs (All, New Resource, Updated, Platform, Maintenance, Community)
- `src/app/announcements/[slug]/page.tsx` — detail page
- `src/components/announcements/AnnouncementCard.tsx` — card with type badge, title, excerpt, date
- `src/components/announcements/AnnouncementFeed.tsx` — full listing with filter tabs
- Pinned announcements shown at top with visual distinction (highlighted card)
- Home page: add "Latest Announcements" section below "Featured Resources" (shows last 3)
- Update mock data to include `announcements` array
- New hook: `src/hooks/useAnnouncements.ts`

---

## Layout Changes on Resource Detail Page

Current layout: two-column (resource info left, sidebar right)

**New layout order (desktop, LTR sidebar):**
```
┌─────────────────────┬──────────────┐
│ Resource Name       │ Type Badge   │
│ (with version badge)│ License      │
├─────────────────────│ Itqan Badge  │
│ Description         │              │
├─────────────────────│ Links        │
│ Content Preview     │              │
│ (collapsible on     │ "Request     │
│  mobile)            │  Access" CTA │
├─────────────────────│              │
│ Resource Stats      │ "Report"     │
│ (3 stat cards)      │ link         │
├─────────────────────│              │
│ Version History     │              │
│ (accordion)         │              │
├─────────────────────│              │
│ Related Resources   │              │
└─────────────────────┴──────────────┘
```

**RTL layout:** mirrored — sidebar on left, main content on right (handled by Tailwind RTL plugin).

---

## Mock Data Updates

All mock data updates go in `src/lib/mock-data.ts`:

1. **Resources** — add fields: `download_count`, `view_count`, `preview_content`, `versions`, `latest_version`
2. **Reports** — add fields: `reason`, `status`, `comments` array
3. **Announcements** — new top-level array `announcements` with 5-6 sample items

---

## Open Questions

None. All decisions captured above.
