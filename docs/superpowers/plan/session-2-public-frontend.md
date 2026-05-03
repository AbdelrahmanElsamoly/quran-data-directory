# Session 2: Public Frontend — Catalog & Resource Pages

**Source:** `docs/superpowers/specs/2026-04-24-ratq-community-platform-q1-implementation-design.md`
**Scope:** Q1 — Session 2 of 4
**Dependencies:** NONE — fully isolated. Uses a mock data layer that mirrors the API contract defined in the spec.
**Exit criteria:** `next build` produces a static HTML site, all pages render correctly, search + filters work against mock data.

---

## Project Structure

```
frontend/
├── Dockerfile
├── public/
│   └── fonts/                 # Custom Arabic font files
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout, RTL, Arabic font, next-intl setup
│   │   ├── page.tsx           # Home page
│   │   ├── resources/
│   │   │   ├── page.tsx       # Catalog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Resource detail page
│   │   ├── login/
│   │   │   └── page.tsx       # Login page (gated routes)
│   │   ├── register/
│   │   │   └── page.tsx       # Register page (gated routes)
│   │   ├── resources/
│   │   │   └── [slug]/
│   │   │       ├── request/
│   │   │       │   └── page.tsx  # Access request form
│   │   │       └── report/
│   │   │           └── page.tsx  # Report form
│   │   └── dashboard/
│   │       ├── page.tsx       # Publisher dashboard
│   │       └── resources/
│   │           └── page.tsx   # Publisher resource CRUD
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Nav, logo, language toggle
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx    # Dashboard sidebar
│   │   ├── resources/
│   │   │   ├── ResourceCard.tsx    # Grid/card component
│   │   │   ├── ResourceGrid.tsx    # Grid layout
│   │   │   ├── ResourceFilters.tsx # Filter sidebar
│   │   │   ├── SearchBar.tsx       # Search input
│   │   │   └── RelatedResources.tsx
│   │   ├── ui/                 # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── dashboard/
│   │       ├── RequestCard.tsx
│   │       └── ResourceForm.tsx
│   ├── lib/
│   │   ├── api.ts              # API client (fetch wrapper, base URL from env)
│   │   ├── auth.ts             # Session management, token helpers
│   │   └── utils.ts            # Shared utilities
│   ├── hooks/
│   │   ├── useResources.ts     # SWR/React Query hooks for resource data
│   │   ├── useAuth.ts          # Auth state hook
│   │   └── useFilters.ts       # Filter state management
│   ├── styles/
│   │   └── globals.css         # Tailwind directives, CSS variables, RTL overrides
│   └── i18n/
│       ├── request.ts          # next-intl locale detection
│       └── messages/
│           ├── ar.ts           # Arabic translations
│           └── en.ts           # English translations
├── next.config.ts              # ISR config, API rewrites, images config
├── tailwind.config.ts          # RTL plugin, custom theme
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Step-by-Step Build Order

### 1. Project Setup + RTL Foundation

**Files:**
- `frontend/package.json` — Next.js 14+, TypeScript, Tailwind, next-intl, SWR or @tanstack/react-query
- `frontend/tailwind.config.ts` — RTL plugin enabled, custom theme (fonts, colors)
- `frontend/src/styles/globals.css` — Tailwind directives, CSS variables for theming, base RTL direction
- `frontend/src/app/layout.tsx` — Root layout with `dir="rtl"`, Arabic font (e.g., Amiri or Noto Sans Arabic for body + a distinctive display font), next-intl provider

**Key decisions:**
- Font: Amiri (body, Arabic serif) + a complementary display font for headings (avoid Inter, Space Grotesk, and other generic choices)
- RTL is the default direction — English is LTR overlay
- Tailwind RTL plugin handles `ml/mr` → `margin-right/left` flipping automatically

### 2. API Abstraction Layer + Mock Data + Data Hooks

**Files:**
- `frontend/src/lib/api-client.ts` — Abstract data layer with two modes:
  - **Mock mode (default):** In-memory mock data matching the API contract defined in the spec. Returns typed data with realistic fields (slugs, types, licenses, etc.)
  - **Real mode:** Fetch wrapper that calls the Django backend at `NEXT_PUBLIC_API_URL`
  - Switched via `NEXT_PUBLIC_DATA_MODE=mock|api` env var
- `frontend/src/lib/mock-data.ts` — 20+ sample resource objects matching the Django data model exactly (same field names, types, and structure as the DRF API would return). Includes:
  - All 5 resource types (library, sdk, dataset, api, tafsir)
  - Mixed licenses, itqan badge states, and statuses
  - Sample comments on resources
- `frontend/src/hooks/useResources.ts` — SWR hooks: `useResources()` (list with filters), `useResource(slug)` (detail), `useResourceComments(slug)`. Hooks are agnostic — they call the `api-client` which handles mock vs real transparently.
- `frontend/src/lib/utils.ts` — slug helpers, date formatting, filter building

**Key decisions:**
- SWR for data fetching (lightweight, built-in revalidation)
- Mock data **exactly mirrors the API contract** — same field names, same structure. This means when Session 3 swaps `DATA_MODE=api`, zero frontend code changes are needed
- Error states: loading skeletons, empty states, error banners (test these by temporarily switching to real API mode while Session 1 is incomplete)

### 3. Home Page

**Route:** `src/app/page.tsx`

**Components needed:**
- `SearchBar` — prominent hero search
- `ResourceGrid` — featured resources (API: `/api/v1/resources/?itqan_badge=true` or latest)

**Key decisions:**
- Hero section: platform name, tagline, large search input
- Below hero: "Featured Resources" section (3-6 cards, itqan-badge resources)
- Static text, all data from API via server-side fetch (static generation + ISR)

### 4. Catalog Page

**Route:** `src/app/resources/page.tsx`

**Components:**
- `ResourceFilters` — sidebar with filters:
  - Type: checkboxes (Library, SDK, Dataset, API, Tafsir/Translation)
  - License: text filter or dropdown
  - Itqan Badge: toggle
- `ResourceGrid` — responsive grid of `ResourceCard`
- `Pagination` — handle paginated results

**Key decisions:**
- URL-based filter state (e.g., `/resources?type=library&license=MIT&badge=true`)
- Filters update SWR query params, triggers revalidation
- Server-side rendered with ISR (revalidate every 5 minutes)
- `ResourceCard`: name, type badge, license, itqan badge indicator, description excerpt, github link if present

### 5. Resource Detail Page

**Route:** `src/app/resources/[slug]/page.tsx`

**Components:**
- `ResourceCard` (full version) — all metadata
- `RelatedResources` — 3-4 similar resources (same type)
- `CommentSection` — list comments + add comment form
- `AccessRequestButton` — "Request Access" CTA (auth-gated)

**Key decisions:**
- Layout: two-column on desktop (resource info left, sidebar right)
- Metadata: type badge, license, itqan badge, links (docs, github)
- Description: rendered markdown or plain text
- ISR revalidate: 10 minutes for detail pages
- If slug not found: 404 page

### 6. Authentication Pages (UI Only)

**Routes:**
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

**Components:**
- `LoginForm` — email, password, social login buttons (Google, GitHub)
- `RegisterForm` — email, password, display name, role (developer/publisher)

**Key decisions:**
- Forms submit to backend Allauth endpoints
- Redirect on success: login → dashboard or origin, register → login confirmation
- Error messages from backend validation
- Protected route middleware for `/dashboard` routes

### 7. Dashboard Pages (UI Only — logic wired in Session 3)

**Routes:**
- `src/app/dashboard/page.tsx` — publisher dashboard overview
- `src/app/dashboard/resources/page.tsx` — resource management (list + create/edit)

**Components:**
- Dashboard layout with sidebar
- `RequestCard` — access request preview
- `ResourceForm` — create/edit resource form

**Key decisions:**
- UI built with dummy data placeholders initially, wired to real API in Session 3
- Dashboard is a client component (SPA behavior), not static

---

## Build Order Summary

1. Project setup + RTL config → dev server runs with Arabic layout
2. Mock data + API abstraction → data fetching infrastructure ready (zero backend needed)
3. Home page → public landing works
4. Catalog page → search + filters + pagination functional
5. Resource detail page → full resource view with comments
6. Auth pages (UI) → login/register forms styled
7. Dashboard (UI) → layout and forms scaffolded

**Total: ~7 steps, all frontend. Fully independent of Session 1.**

### Bridge to Session 3

When Session 3 is ready to wire real backend data:
- Change `NEXT_PUBLIC_DATA_MODE` from `mock` to `api`
- Set `NEXT_PUBLIC_API_URL` to the backend URL
- The `api-client.ts` adapter handles everything — **no component changes needed**
- All hooks (`useResources`, etc.) work identically in both modes

---

## Design Notes

- **Arabic-first typography**: Amiri for body text, distinctive display font for headings
- **RTL default**: all spacing, alignment, and layout flows right-to-left by default
- **Color palette**: earthy, warm tones — deep teal/indigo primary, warm sand/cream backgrounds, gold accents for itqan badges
- **Minimalist aesthetic**: generous whitespace, clean grid, content-focused
- **Responsive**: mobile-first, catalog grid collapses to single column on small screens
- **Loading states**: skeleton loaders for all list and detail views
