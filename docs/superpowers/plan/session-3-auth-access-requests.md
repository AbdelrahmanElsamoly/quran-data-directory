# Session 3: Auth + Access Requests + Publisher Features

**Source:** `docs/superpowers/specs/2026-04-24-ratq-community-platform-q1-implementation-design.md`
**Scope:** Q1 — Session 3 of 4
**Dependencies:** Session 1 complete (backend API running), Session 2 complete (frontend pages scaffolded with mock data)
**Exit criteria:** A developer can register, submit an access request for a resource. A publisher can log in, view requests for their resources, and approve/deny them.

---

## Scope

### Step 0: Mock → Real API Bridge (15 minutes)

Before any auth work, swap the frontend from mock data to the live backend:
- Change `NEXT_PUBLIC_DATA_MODE=mock` → `api` in `.env.local`
- Set `NEXT_PUBLIC_API_URL=http://localhost:8000` (or backend URL)
- The `api-client.ts` adapter from Session 2 handles the swap — zero component changes
- Verify catalog pages now show real data from Django (seeded in Session 1)

This session then wires up the backend auth logic to the frontend UI built in Session 2, and builds the publisher dashboard and access request workflows end-to-end.

---

## Step-by-Step Build Order

### 1. Backend: Django Allauth Integration

**Files:**
- `backend/apps/accounts/views.py` — Register view, login/logout views, social login callbacks
- `backend/ratq/settings.py` — Allauth configuration (email verification, social accounts: Google, GitHub)
- `backend/apps/accounts/urls.py` — Auth routes
- `backend/apps/accounts/serializers.py` — RegisterSerializer, LoginSerializer

**Key decisions:**
- `ACCOUNT_AUTHENTICATION_METHOD = "email"` (usernameless login)
- `ACCOUNT_EMAIL_REQUIRED = true`
- `ACCOUNT_EMAIL_VERIFICATION = "optional"` (Q1 — no forced email verification)
- Social providers: Google, GitHub (configurable via env vars)
- JWT tokens via `djangorestframework-simplejwt` — access + refresh tokens
- Frontend stores JWT in httpOnly cookie or localStorage (developer choice)

### 2. Frontend: Auth Integration

**Files:**
- `frontend/src/lib/auth.ts` — Token storage, refresh logic, auth state hook
- `frontend/src/hooks/useAuth.ts` — `useLogin()`, `useRegister()`, `useLogout()`, `useSession()`
- `frontend/src/app/login/page.tsx` — Wire `LoginForm` to real API
- `frontend/src/app/register/page.tsx` — Wire `RegisterForm` to real API
- `frontend/src/app/dashboard/*/page.tsx` — Protected route middleware

**Key decisions:**
- `useSession()` hook checks token validity on every page load
- Protected routes: if unauthenticated, redirect to `/login` with `?next=/dashboard`
- Social login buttons open backend auth endpoints
- After login: redirect to origin page or dashboard (based on role)
- Token expiry: auto-refresh using refresh token (SimpleJWT)

### 3. Backend: Access Request Workflow

**Files:**
- `backend/apps/requests/views.py` — Create request, list user requests, manage request (approve/deny)
- `backend/apps/requests/serializers.py` — CreateRequestSerializer, ManageRequestSerializer
- `backend/apps/requests/models.py` — Ensure `publisher_notes` field, status transition validation
- `backend/ratq/settings.py` — DRF permission classes

**Endpoints:**
```
POST   /api/v1/access-requests/           # Auth required — submit request
GET    /api/v1/access-requests/           # Auth required — list my requests
PATCH  /api/v1/access-requests/{id}/      # Publisher only — approve/deny
```

**Key decisions:**
- Permission: only the resource's publisher (or admin) can approve/deny
- Serializer validates: no duplicate pending requests for same resource
- Status transitions: `pending` → `approved` or `denied` (one-way)
- `publisher_notes` is write-only for publishers, hidden from applicant view

### 4. Frontend: Access Request Flow

**Files:**
- `frontend/src/app/resources/[slug]/request/page.tsx` — Access request form
- `frontend/src/components/auth/LoginForm.tsx` — Wire to real API (already done in step 2)
- `frontend/src/hooks/useResources.ts` — Add `useSubmitRequest()` hook

**Key decisions:**
- Form fields: message (textarea), resource slug from URL
- On submit: POST to API, show success toast, redirect to `/resources/[slug]`
- If already requested: show status badge ("Pending", "Approved", "Denied") on detail page
- Auth-gated: redirect to login if no session

### 5. Backend: Publisher Dashboard API

**Files:**
- `backend/apps/requests/views.py` — `PublisherRequestListView` — list requests for publisher's resources
- `backend/apps/resources/views.py` — `PublisherResourceListView` — list publisher's resources
- `backend/apps/resources/views.py` — `PublisherResourceCreateView`, `PublisherResourceUpdateView`
- `backend/apps/requests/serializers.py` — ManageRequestSerializer (approve/deny)
- `backend/ratq/settings.py` — Custom permission class: `IsPublisherOfResource`

**Endpoints:**
```
GET    /api/v1/publisher/requests/        # Publisher dashboard — requests for my resources
PATCH  /api/v1/publisher/requests/{id}/   # Approve/deny a request
GET    /api/v1/publisher/resources/       # List my resources
POST   /api/v1/publisher/resources/       # Create resource (publisher)
PUT    /api/v1/publisher/resources/{slug}/# Update resource (publisher)
DELETE /api/v1/publisher/resources/{slug}/# Archive resource (publisher)
```

**Key decisions:**
- Custom permission: user's role must be `publisher` AND the resource's owner must be the user
- Admin can access all publisher endpoints
- Soft delete: `DELETE` sets status to `archived` instead of hard delete

### 6. Frontend: Publisher Dashboard

**Files:**
- `frontend/src/app/dashboard/page.tsx` — Overview: pending requests count, recent activity
- `frontend/src/app/dashboard/resources/page.tsx` — Resource management list + create button
- `frontend/src/components/dashboard/RequestCard.tsx` — Request details, approve/deny actions
- `frontend/src/components/dashboard/ResourceForm.tsx` — Create/edit resource form

**Key decisions:**
- Dashboard uses SWR hooks to fetch real data from publisher endpoints
- `RequestCard`: shows applicant name, date, message, approve/deny buttons
- `ResourceForm`: form fields match Resource model (name, type, description, links, license, badge)
- Action feedback: toast notifications on approve/deny/create/update
- Empty states: "No pending requests", "No resources yet — create one"

### 7. Backend: Report Submission

**Files:**
- `backend/apps/reports/views.py` — CreateReport view
- `backend/apps/reports/serializers.py` — ReportSerializer

**Endpoint:**
```
POST   /api/v1/reports/              # Auth required — submit report
```

**Key decisions:**
- Only authenticated users can submit reports
- Serializer validates: user cannot report their own resource (if applicable)
- Status auto-set to `open`, reporter linked to user

### 8. Frontend: Report Form + Resource Page Updates

**Files:**
- `frontend/src/app/resources/[slug]/report/page.tsx` — Report form
- `frontend/src/app/resources/[slug]/page.tsx` — Add "Report" button, show request status on detail page

**Key decisions:**
- Report form: reason (dropdown), details (textarea)
- On submit: show success message, disable report button for this user+resource
- On resource detail: show access request status if user is the applicant

---

## Build Order Summary

1. Backend Allauth integration → registration + social login works
2. Frontend auth wiring → login/register forms submit to API
3. Backend access request workflow → API endpoints live
4. Frontend access request form → full request flow works
5. Backend publisher dashboard API → CRUD for publisher resources + requests
6. Frontend publisher dashboard → interactive dashboard with real data
7. Backend report submission → API endpoint
8. Frontend report form + detail page updates → reporting + status badges

**Total: ~8 steps, full-stack (backend + frontend).**

---

## Data Flow: Access Request (End-to-End)

```
Developer (logged in)          Backend                    Publisher (logged in)
       │                           │                              │
       │ POST /api/access-requests │                              │
       │ { resource_id, message }  │                              │
       │──────────────────────────>│                              │
       │                           │ INSERT AccessRequest         │
       │                           │ (status=pending)             │
       │ 201 Created               │                              │
       │<──────────────────────────│                              │
       │ { request_id }            │                              │
       │                           │           GET                 │
       │                           │<─────────────────────────────│
       │                           │  /publisher/requests/        │
       │                           │─────────────────────────────>│
       │                           │           200 + pending      │
       │                           │           requests           │
       │                           │                              │
       │                           │  PATCH /publisher/requests/  │
       │                           │  { status: "approved" }      │
       │                           │<─────────────────────────────│
       │                           │ UPDATE status=approved       │
       │                           │                              │
       │                           │                              │
       │ GET /resources/{slug}     │                              │
       │ (shows "Approved" badge)  │                              │
       │<──────────────────────────│                              │
```

---

## Design Notes

- **Dashboard layout**: sidebar navigation (Requests, Resources) + main content area
- **Request card**: compact, shows key info at a glance, approve/deny buttons inline
- **Color coding**: pending (amber), approved (green), denied (red) — consistent badge system
- **Confirmation modals**: approve/deny actions show confirmation before committing
- **Toast notifications**: success/error feedback on all mutations
- **Role-based visibility**: developers see "Request Access", publishers see "Manage Requests"
