# Session 5: Enhanced Features — Reports, Preview, Stats, Announcements & Versioning

**Scope:** Post-Q1 enhancements (or late-Q1 if capacity allows)
**Dependencies:** Session 1 (backend foundation), Session 2 (frontend catalog & detail pages)
**Exit criteria:** Users can report resources with reasons + comments, view rich previews, see usage stats, browse announcements, and inspect version history on resource pages.

---

## Feature Overview

| # | Feature | Backend Work | Frontend Work | Session Placement |
|---|---------|-------------|--------------|-------------------|
| 1 | Enhanced reporting (reasons + comments) | Moderate | Moderate | Session 5 (or Session 3) |
| 2 | Resource content preview | Minimal | Moderate | Session 5 |
| 3 | Resource stats (downloads, views) | Moderate | Low-Moderate | Session 5 |
| 4 | Announcements section | Low | Moderate | Session 5 |
| 5 | Versioning display | Moderate | Moderate | Session 5 |

---

## Feature 1: Enhanced Reporting (Reasons + Comments)

### Context
The existing `Report` model (Session 1, `apps/reports`) supports basic reporting. This feature adds structured reason categories and threaded comments on reports for moderation follow-up.

### Backend Changes

**Model updates — `apps/reports/models.py`:**

```python
# Add to existing Report model
REPORT_REASON_CHOICES = [
    ('inaccurate', 'Inaccurate/Misleading Content'),
    ('inappropriate', 'Inappropriate Content'),
    ('broken_link', 'Broken/Invalid Links'),
    ('outdated', 'Outdated/Abandoned'),
    ('copyright', 'Copyright Infringement'),
    ('spam', 'Spam/Scam'),
    ('other', 'Other'),
]

reason = CharField(choices=REPORT_REASON_CHOICES, max_length=20)
# existing `comment` field stays — it becomes the initial report description

# New: moderation conversation thread
class ReportComment(models.Model):
    report = ForeignKey('Report', on_delete=CASCADE, related_name='comments')
    author = ForeignKey('accounts.CustomUser', on_delete=CASCADE)
    body = TextField()
    is_internal = BooleanField(default=False)  # publisher/admin internal notes
    created_at = DateTimeField(auto_now_add=True)
```

**API changes:**
- `POST /api/v1/reports/` — accepts `reason` field (required) + optional `comment`
- `GET /api/v1/reports/{id}/comments/` — list moderation comments
- `POST /api/v1/reports/{id}/comments/` — add comment (authenticated)
- Admin API: `GET /api/v1/admin/reports/` — filtered by reason, status, priority

**Serializer updates:**
- `ReportSerializer` — include `reason` display label, comment count
- `ReportCommentSerializer` — new

**Admin updates:**
- `apps/reports/admin.py` — filter by reason, show comment thread inline

### Frontend Changes

**New/updated components:**

- `src/components/resources/ReportForm.tsx` — replaces current report form
  - Dropdown/radio for reason selection (with icons)
  - Textarea for additional details
  - Submission feedback + confirmation

- `src/components/reports/ReportThread.tsx` — on resource detail page (gated)
  - Shows user's own reports with status + comment thread
  - "Add comment" input per report
  - Internal notes visible to publishers/admins only

**Route updates:**
- `src/app/resources/[slug]/report/` — enhanced report form (same route, new UI)
- `src/app/dashboard/reports/page.tsx` — new publisher/admin view to manage reports

**Data layer:**
- `src/hooks/useReports.ts` — `useReport(slug)`, `useReportComments(reportId)`, `useCreateReport()`
- Update `api-client.ts` — new endpoints

### Placement Decision
This is the **only feature from the list** that arguably belongs in Q1. Per the strategic doc, "user reporting system" is a **Must Have** for Q1. If Session 3's scope is already full, fold this into Session 5. If Session 3 hasn't started yet, integrate it there instead.

---

## Feature 2: Resource Content Preview

### Context
Resource detail pages should show a preview of the content. Preview type varies by resource type:

| Resource Type | Preview Strategy |
|--------------|-----------------|
| **Library** (GitHub-hosted) | GitHub README preview, file tree snippet, package.json preview |
| **SDK** | SDK documentation snippet, code example preview, installation command |
| **Dataset** | Sample data preview (JSON table), schema visualization, row count |
| **API** | API endpoint list, sample request/response, OpenAPI spec embed |
| **Tafsir/Translation** | Sample verse rendering, side-by-side comparison, PDF viewer inline |

### Backend Changes

**Model updates — `apps/resources/models.py`:**

```python
# Add to existing Resource model
preview_content = JSONField(null=True, blank=True)
# Structure varies by type:
# library/sdk: { "readme_url": "...", "example_code": "...", "install_command": "..." }
# dataset: { "sample_data": [...], "schema": {...}, "row_count": 1234 }
# api: { "openapi_url": "...", "endpoints": [{"method": "GET", "path": "/v1/..."}] }
# tafsir: { "sample_verse": {"surah": 1, "ayah": 1, "text": "..."}, "pdf_preview_url": "..." }

preview_type = CharField(max_length=20, null=True, blank=True)
# Auto-set based on resource type + presence of preview_content
```

**API changes:**
- `GET /api/v1/resources/{slug}/` — includes `preview_content` in detail response (not in list response to keep it lightweight)
- New optional field in `ResourceDetailSerializer`

**Admin updates:**
- `apps/resources/admin.py` — rich text/JSON editor for `preview_content`
- Helper dropdown to select preview template by resource type

### Frontend Changes

**New components:**

- `src/components/resources/ContentPreview.tsx` — main preview container
  - Dispatches to type-specific preview sub-components based on `resource.type`

- `src/components/resources/previews/LibraryPreview.tsx` — GitHub README embed or rendered markdown
- `src/components/resources/previews/SDKPreview.tsx` — code examples + install command (copy button)
- `src/components/resources/previews/DatasetPreview.tsx` — sample data table with pagination
- `src/components/resources/previews/APIPreview.tsx` — endpoint list with method badges, sample curl/response
- `src/components/resources/previews/TafsirPreview.tsx` — verse display with Arabic typography, optional PDF viewer

- `src/components/resources/PreviewFallback.tsx` — when no preview_content is available
  - Shows a "screenshot" upload area (for resources where structured preview isn't feasible)
  - Fallback message: "Preview not available"

**Layout changes:**
- Resource detail page: add `ContentPreview` section below the description, above related resources
- On mobile: collapsible preview section
- For resources with no preview: show a subtle placeholder, not a broken area

**Data layer:**
- No new hooks needed — `preview_content` comes in the existing `useResource(slug)` response
- If `preview_content` is null, render fallback

### Design Note
For resources where a structured preview is not feasible (e.g., a proprietary library with no public docs), the publisher should be able to upload a screenshot/image as a fallback preview. Add to the Resource model:

```python
preview_screenshot = ImageField(null=True, blank=True, upload_to='resource_previews/')
```

---

## Feature 3: Resource Stats (Downloads, Views, Usage)

### Context
Public-facing stats build trust and help developers choose resources. Per the strategic doc (Q2), this includes download count, view count, and trend data.

### Backend Changes

**Model updates — `apps/resources/models.py`:**

```python
# Add to existing Resource model
download_count = IntegerField(default=0)
view_count = IntegerField(default=0)

# New model for trend tracking
class ResourceStats(models.Model):
    resource = ForeignKey('resources.Resource', on_delete=CASCADE, related_name='stats')
    date = DateField()
    downloads = IntegerField(default=0)
    views = IntegerField(default=0)
    unique_users = IntegerField(default=0)
```

**API changes:**
- `GET /api/v1/resources/{slug}/` — include `download_count`, `view_count` in detail response
- `GET /api/v1/resources/{slug}/stats/` — daily stats for the last 30 days (for charts)
- `GET /api/v1/resources/{slug}/stats/summary/` — aggregated totals + growth percentages

**New endpoint for tracking:**
- `POST /api/v1/resources/{slug}/track-view/` — increment view count (lightweight, no auth)
- `POST /api/v1/resources/{slug}/track-download/` — increment download count (after access approval or public download)

**Celery task:**
- Daily aggregation job that summarizes daily activity into `ResourceStats` records
- Prevents heavy queries on the detail page

**Serializer updates:**
- `ResourceDetailSerializer` — add `download_count`, `view_count`, `growth_rate` (computed)
- `ResourceStatsSerializer` — new

**Admin updates:**
- `apps/resources/admin.py` — stats dashboard with charts (use Django admin's built-in or a lightweight chart library)

### Frontend Changes

**New components:**

- `src/components/resources/ResourceStats.tsx` — stats display on detail page
  - Three stat cards: downloads, views, growth (↑/↓ with percentage)
  - Clean, minimal design matching the existing card style

- `src/components/resources/StatsChart.tsx` — optional trend chart (Q2 polish)
  - Line chart showing daily views/downloads over 30 days
  - Uses a lightweight charting library (e.g., Recharts or Chart.js)
  - Server-side rendered static data (no client-side fetching needed for Q1)

**Layout changes:**
- Resource detail page: add `ResourceStats` section below the metadata block, above the description
- Stats shown as horizontal row of 3 cards on desktop, stacked on mobile

**Data layer:**
- Update `useResource(slug)` hook — includes `download_count`, `view_count` from the detail response
- `src/hooks/useResourceStats.ts` — new hook for trend data: `useResourceStats(slug)`

**Client-side tracking:**
- `src/lib/tracking.ts` — lightweight view tracking
  - Uses `navigator.sendBeacon()` for fire-and-forget view counting
  - Debounced to prevent excessive calls on long page views
  - Download tracking fires on button click / redirect event

---

## Feature 4: Announcements Section

### Context
A public-facing announcements feed on the home page and a dedicated `/announcements` listing page. Announcements are created by admins/publishers to signal new resources, updates, or platform news.

### Backend Changes

**New model — `apps/announcements/models.py`:**

```python
class Announcement(models.Model):
    class AnnouncementType(models.TextChoices):
        NEW_RESOURCE = 'new_resource', 'New Resource'
        UPDATE = 'update', 'Resource Update'
        PLATFORM = 'platform', 'Platform News'
        MAINTENANCE = 'maintenance', 'Maintenance'

    title = CharField(max_length=200)
    slug = SlugField(max_length=220, unique=True)
    body = TextField()  # supports markdown
    announcement_type = CharField(choices=AnnouncementType.choices, max_length=20)
    resource = ForeignKey('resources.Resource', on_delete=SET_NULL, null=True, blank=True, related_name='announcements')
    # links to a specific resource if the announcement is about one
    is_pinned = BooleanField(default=False)  # pin to top of feed
    published_at = DateTimeField()
    created_by = ForeignKey('accounts.CustomUser', on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**API changes:**
- `GET /api/v1/announcements/` — list with filters: `?type=update&limit=5`
- `GET /api/v1/announcements/{slug}/` — detail
- `POST /api/v1/announcements/` — create (admin/publisher only)
- Admin CRUD at `/api/v1/admin/announcements/`

**Serializers:**
- `AnnouncementSerializer` — list response (title, type badge, published_at, resource link)
- `AnnouncementDetailSerializer` — full body with markdown rendering

**Admin:**
- `apps/announcements/admin.py` — rich admin interface with type filters, pin toggle, markdown preview

### Frontend Changes

**New/updated pages:**

- `src/app/announcements/page.tsx` — announcements listing page
  - Filter tabs by type (All, New Resource, Update, Platform, Maintenance)
  - Chronological feed with type badges
  - Pinned announcements at top with visual distinction (highlighted card)
  - Pagination (10 per page)

- `src/app/announcements/[slug]/page.tsx` — announcement detail page

**Updated pages:**

- `src/app/page.tsx` (Home) — add "Latest Announcements" section below "Featured Resources"
  - Shows last 3 announcements
  - "View all" link to `/announcements`

**New components:**

- `src/components/announcements/AnnouncementCard.tsx` — card with type badge, title, excerpt, date
- `src/components/announcements/AnnouncementFeed.tsx` — full listing with filters
- `src/components/announcements/AnnouncementFilterTabs.tsx` — type filter tabs

**Data layer:**
- `src/hooks/useAnnouncements.ts` — `useAnnouncements(filters)`, `useAnnouncement(slug)`
- Update `api-client.ts` — new announcement endpoints

**Dashboard:**
- `src/app/dashboard/announcements/page.tsx` — create/edit announcements (publisher/admin)
- `src/components/dashboard/AnnouncementForm.tsx` — form with title, body (markdown), type selector, resource link, pin toggle

---

## Feature 5: Versioning Display

### Context
Resources should show their version history. Publishers manage versions; users view them on the detail page. This aligns with the Q2 strategic goal of "Resource versioning & release notes."

### Backend Changes

**New model — `apps/resources/models.py`:**

```python
class ResourceVersion(models.Model):
    resource = ForeignKey('resources.Resource', on_delete=CASCADE, related_name='versions')
    version = CharField(max_length=50)  # semver: "1.2.3"
    release_notes = TextField(blank=True)  # markdown
    download_url = URLField()  # direct download or docs link
    is_latest = BooleanField(default=False)
    published_at = DateTimeField()
    file_size = IntegerField(null=True, blank=True)  # bytes
    changelog_url = URLField(null=True, blank=True)
    created_at = DateTimeField(auto_now_add=True)
```

**Model signals — `apps/resources/models.py`:**

```python
# When a new version is created, unmark the previous "latest"
@receiver(post_save, sender=ResourceVersion)
def unmark_previous_latest(sender, instance, created, **kwargs):
    if created and instance.is_latest:
        ResourceVersion.objects.filter(
            resource=instance.resource,
            is_latest=True
        ).update(is_latest=False)
```

**API changes:**
- `GET /api/v1/resources/{slug}/versions/` — list all versions, ordered by `published_at DESC`
- `GET /api/v1/resources/{slug}/versions/latest/` — latest version shortcut
- `POST /api/v1/resources/{slug}/versions/` — create version (publisher only)
- `PATCH /api/v1/resources/versions/{id}/` — update version (publisher only)
- `DELETE /api/v1/resources/versions/{id}/` — delete version (publisher only)

**Serializer updates:**
- `ResourceDetailSerializer` — add `latest_version` field (nested, from `versions.filter(is_latest=True).first()`)
- `ResourceVersionSerializer` — new

**Admin:**
- `apps/resources/admin.py` — inline version management on the Resource admin page
- "Add Version" button with semver validation

### Frontend Changes

**New components:**

- `src/components/resources/VersionHistory.tsx` — version list on detail page
  - Collapsible accordion or table format
  - Each row: version badge, release date, file size, release notes preview, download link
  - Latest version highlighted with a "Latest" badge
  - "View full release notes" expandable section per version

- `src/components/resources/LatestVersionBadge.tsx` — compact version indicator near the resource name
  - Shows "v1.2.3" with a subtle update indicator if different from last visited

**Layout changes:**
- Resource detail page: add `VersionHistory` section below the preview (or below stats if no preview)
- On mobile: full-width accordion; on desktop: table with 4 columns

**Dashboard:**
- `src/app/dashboard/resources/[slug]/versions/page.tsx` — version management per resource
- `src/components/dashboard/VersionForm.tsx` — create/edit version form
  - Semver input with auto-increment suggestion
  - Release notes textarea (markdown)
  - Download URL, file size (auto-detected if file upload)
  - Changelog URL

**Data layer:**
- `src/hooks/useResourceVersions.ts` — `useResourceVersions(slug)`, `useLatestVersion(slug)`
- Update `api-client.ts` — version endpoints

**Client-side version tracking:**
- `src/lib/version-tracking.ts` — lightweight localStorage tracking
  - Stores last-seen version per resource slug
  - Used to show an "updated" indicator on the resource card if the version changed since last visit
  - `GET /api/v1/resources/{slug}/` includes `latest_version` for comparison

---

## Build Order

1. **Feature 1 (Enhanced Reports)** — Highest priority if Q1. Modifies existing `apps/reports` app, minimal new infrastructure.
2. **Feature 3 (Resource Stats)** — Backend tracking endpoints + simple stat cards on detail page. Low frontend complexity.
3. **Feature 5 (Versioning)** — New model + CRUD API + version history UI on detail page. Medium effort, clear value.
4. **Feature 2 (Content Preview)** — Most frontend-heavy. Type-specific preview components. Can be iterated progressively (start with 2 resource types, add more later).
5. **Feature 4 (Announcements)** — New app, new pages, new dashboard section. Good standalone feature but lowest urgency.

---

## Integration with Existing Sessions

### If folded into Session 3
- Feature 1 (Reports) — integrate here. Session 3 already touches auth + moderation-adjacent workflows.
- Everything else stays in Session 5.

### If folded into Session 4
- Features 3 (Stats) and 5 (Versioning) — fit naturally with "polish" work.
- Features 2 (Preview) and 4 (Announcements) — better as a dedicated session.

### As a standalone Session 5
- Recommended if Sessions 1–4 are already scoped and committed.
- Can be split into two smaller sessions if needed:
  - **Session 5a:** Features 1, 3, 5 (backend-heavy, moderate frontend)
  - **Session 5b:** Features 2, 4 (frontend-heavy, new pages)

---

## File Impact Summary

### Backend (Django)
| File | Change |
|------|--------|
| `apps/reports/models.py` | Add `reason` field, `ReportComment` model |
| `apps/reports/serializers.py` | New `ReportCommentSerializer` |
| `apps/reports/views.py` | Comment endpoints, reason filtering |
| `apps/resources/models.py` | Add `preview_content`, `preview_type`, `download_count`, `view_count`, `ResourceVersion` model, signals |
| `apps/resources/serializers.py` | Add preview fields, stats, version nesting |
| `apps/resources/views.py` | View/download tracking endpoints, version CRUD |
| `apps/announcements/models.py` | **New file** — Announcement model |
| `apps/announcements/serializers.py` | **New file** |
| `apps/announcements/views.py` | **New file** — CRUD + listing |
| `apps/announcements/urls.py` | **New file** |
| `apps/announcements/admin.py` | **New file** |
| `ratq/settings.py` | Add Celery config (for stats aggregation), new app registrations |

### Frontend (Next.js)
| File | Change |
|------|--------|
| `src/lib/api-client.ts` | New endpoints for reports, stats, versions, announcements |
| `src/lib/mock-data.ts` | Add preview data, stats, versions, announcements to mock resources |
| `src/hooks/useReports.ts` | New or updated |
| `src/hooks/useResourceStats.ts` | **New file** |
| `src/hooks/useResourceVersions.ts` | **New file** |
| `src/hooks/useAnnouncements.ts` | **New file** |
| `src/app/page.tsx` | Add announcements section |
| `src/app/resources/[slug]/page.tsx` | Add preview, stats, version history sections |
| `src/app/announcements/page.tsx` | **New file** |
| `src/app/announcements/[slug]/page.tsx` | **New file** |
| `src/app/dashboard/announcements/page.tsx` | **New file** |
| `src/app/dashboard/reports/page.tsx` | **New file** |
| `src/components/resources/ContentPreview.tsx` | **New file** |
| `src/components/resources/previews/*.tsx` | **New files** (5 type-specific previews) |
| `src/components/resources/ResourceStats.tsx` | **New file** |
| `src/components/resources/StatsChart.tsx` | **New file** |
| `src/components/resources/VersionHistory.tsx` | **New file** |
| `src/components/resources/LatestVersionBadge.tsx` | **New file** |
| `src/components/reports/ReportThread.tsx` | **New file** |
| `src/components/announcements/AnnouncementCard.tsx` | **New file** |
| `src/components/announcements/AnnouncementFeed.tsx` | **New file** |
| `src/components/announcements/AnnouncementFilterTabs.tsx` | **New file** |
| `src/components/dashboard/AnnouncementForm.tsx` | **New file** |
| `src/components/dashboard/VersionForm.tsx` | **New file** |
| `src/lib/tracking.ts` | **New file** — view/download tracking |
| `src/lib/version-tracking.ts` | **New file** — localStorage version comparison |

---

## Dependencies Between Features

```
Feature 1 (Reports)  — independent
Feature 3 (Stats)    — independent (but benefits from Feature 5's download infrastructure)
Feature 5 (Versioning) — provides `download_url` per version (feeds into Feature 3's download tracking)
Feature 2 (Preview)  — independent
Feature 4 (Announcements) — can optionally link to a Resource (Feature 5's resource)
```

Feature 5 (Versioning) and Feature 3 (Stats) have a natural synergy: version-specific download URLs make it possible to track downloads per version in the future.

---

## Open Questions

1. **Report comments — who can comment?** Only the reporter + admins/publishers? Or any authenticated user?
2. **Preview content — who populates it?** Manual entry by publishers in the dashboard? Or auto-generated from GitHub/PyPI/npm metadata?
3. **Stats privacy — are view/download counts public to everyone?** Strategic doc says "Public & publisher-facing." Should there be a "soft" count (e.g., "100+ downloads") vs exact numbers?
4. **Announcements — can publishers create their own, or is it admin-only?** If publishers can create, should there be approval workflow?
5. **Versioning — semver enforcement?** Should the backend enforce semantic versioning rules, or accept any string?
