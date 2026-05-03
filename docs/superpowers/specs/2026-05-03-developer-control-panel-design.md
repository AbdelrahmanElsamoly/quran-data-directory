# Developer Control Panel — Design Spec

**Date:** 2026-05-03
**Status:** Approved
**Role:** Developer (consumer of resources + publisher of own resources)

---

## Overview

This project implements the **Developer Control Panel** — a web application for developers to manage their resources, access other developers' resources, and interact with the platform. The publisher control panel is a separate project.

The app is a Next.js 16 (App Router) application with React 19, Tailwind CSS, SWR for data fetching, and RTL Arabic UI.

---

## Route Structure

```
/src/app/developer/
  layout.tsx                          — shared layout: sidebar + topbar (RTL)
  page.tsx                            — Overview (dashboard home)
  resources/
    page.tsx                          — My Published Resources (list)
    [slug]/
      page.tsx                        — Resource detail with tabs
      access/
        page.tsx                      — Manage access for this resource
  access/
    page.tsx                          — My Access (resources I have access to)
  requests/
    page.tsx                          — Access Requests (outgoing to publishers)
  reports/
    page.tsx                          — My Reports (reports I filed)
  comments/
    page.tsx                          — Comments & Discussions
  notifications/
    page.tsx                          — Notifications
  settings/
    page.tsx                          — Profile + account settings
```

### Sidebar Navigation (order)

1. Overview
2. My Resources
3. My Access
4. Access Requests
5. Reports
6. Comments & Discussions
7. Notifications
8. Settings

---

## Page Specifications

### 1. Overview (`/developer/`)

**Stats cards (4):**
- Resources Published — count
- Resources Accessed — count
- Active API Keys — count
- Pending Requests — count (pending access requests + pending reports)

**Quick actions:**
- "Add New Resource" → resource creation flow
- "Browse Resources" → public resource catalog

**Recent activity feed:**
- Latest access request status changes
- Latest notifications (approvals, denials, replies)
- Latest report updates

**My Resources quick view:**
- Table of recently published resources with status and link to full view

### 2. My Resources (`/developer/resources/`)

**List view — table with filters:**
- Columns: Resource name, Type, Status, Version, Downloads, Actions
- Filters: Status (all/published/draft/archived), Type, Search by name
- Actions: View, Edit, Delete (draft only), Manage Access (API resources)

**Detail view (`/developer/resources/[slug]/`):**
- Resource header: name, type, description, version, status badge
- Tabs:
  - **Overview** — resource details, preview fields, links
  - **Access Management** — (API only) invite by email, approve/deny access requests
  - **Reports Received** — reports filed by consumers
  - **Analytics** — downloads, API key usage

**Access Management (API resources):**
- Invite by Email: form to invite a specific developer (email + scope), generates API key
- Access Requests: list of incoming requests with Approve/Deny + notes

### 3. My Access (`/developer/access/`)

**List view — table with filters:**
- Columns: Resource name, Type, Access Status, API Keys count, Actions
- Filters: Type, Access Status (active/expired/revoked), Search
- Actions: Manage (per resource)

**Per-resource detail:**
- Resource info
- API keys: view (masked), copy, create, revoke
- Usage stats (if available)
- Link to public resource page

### 4. Access Requests (`/developer/requests/`)

- Table of outgoing access requests sent to publishers
- Columns: Resource name, Status (pending/approved/denied), Submitted date, Publisher response
- Status badges: pending (yellow), approved (green), denied (red)
- Row click → full details + publisher's response notes

### 5. Reports (`/developer/reports/`)

- Table of reports filed against resources
- Columns: Resource name, Reason, Status (open/resolved/closed), Filed date, Publisher response
- Filters: Status, Reason, Date range
- Row click → detail view with report details, status timeline, publisher's response

### 6. Comments & Discussions (`/developer/comments/`)

**Sub-tabs:**
1. **My Comments** — comments on resources (resource name, snippet, date)
2. **Discussions** — threads participated in (topic, latest activity, unread count)

### 7. Notifications (`/developer/notifications/`)

**Tabs:** All / Unread

**Notification types with icons:**
- 🔑 Access request approved/denied
- 💬 Comment/reply on resource or discussion
- 📋 Report status changed
- ⚡ Activity on published resource
- ✅ Access revocation confirmed

Each item: icon, message, resource name, timestamp, read indicator. Click navigates to relevant page. Mark as read + "Mark all as read".

### 8. Settings (`/developer/settings/`)

- Profile: display name, email (read-only), avatar
- Account: password change
- Notification preferences: toggle email per type

---

## Architecture

### Layout
- `/src/app/developer/layout.tsx` — shared layout reusing existing `Sidebar` component and topbar pattern
- Sidebar items filtered for developer-relevant sections only
- Same RTL Arabic UI, Tailwind CSS, CSS variables

### Data Fetching
- SWR for all API calls (already in dependencies)
- New hooks: `useDeveloperResources`, `useDeveloperAccess`, `useDeveloperRequests`, `useDeveloperReports`, `useDeveloperComments`, `useNotifications`
- Mutations use SWR `mutate()` for optimistic updates
- Notifications polled via SWR with refresh interval

### Components
- Reused: `Card`, `RequestCard`, table patterns, skeleton loaders
- New: `ApiKeyCard`, `ReportCard`, `NotificationItem`, `AccessTable`, `ResourceTabView`

### Error Handling
- Loading: skeleton loaders (existing pattern)
- Empty states: friendly messages per section
- Error states: retry button with error message
- Destructive actions: confirmation dialogs (delete resource, revoke key, revoke access)

---

## Type Extensions Needed

Existing types in `src/types/resource.ts` are sufficient. No new types required — existing types cover:
- `Resource`, `ResourceType`, `ResourceStatus`
- `Comment`
- `AccessRequest`, `RequestStatus`
- `Report`, `ReportReason`, `ReportStatus`
- `APIKey`
- `User`, `UserRole`
- `PaginatedResponse`, `SortOption`

---

## What's Out of Scope

- Publisher control panel (separate project)
- Resource creation flow (to be implemented separately)
- Admin functions
- Two-factor authentication (mentioned as future)
