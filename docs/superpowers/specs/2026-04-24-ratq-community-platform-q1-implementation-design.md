# RATQ Community Platform — Q1 Implementation Design

**Date:** 2026-04-24
**Status:** Approved
**Scope:** Q1 MVP only (Months 1–3 per strategic roadmap)

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Next.js 14+ Static Frontend (Dockerized)                           │
│  ISR pages, TypeScript, Tailwind CSS, RTL/Arabic-first              │
│  Deployed on: AWS or GCP                                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ REST API (HTTPS)
┌──────────────────────────────▼──────────────────────────────────────┐
│  Django Backend (Dockerized)                                          │
│  • Django REST Framework — JSON API for the frontend                │
│  • Django Admin — content moderation + initial data seeding         │
│  • Django Allauth — email/password + social (Google, GitHub)        │
│  • Celery + Redis — background tasks (notifications, email)         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│  PostgreSQL (managed — AWS RDS or GCP Cloud SQL)                     │
└──────────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- Truly static frontend: `next build` produces static HTML. ISR used for resource detail pages so content updates propagate without full rebuilds.
- Headless Django backend: DRF serves all data to the frontend. Django Admin serves as the CMS/content management layer.
- Public catalog, gated auth: the entire resource catalog is publicly accessible. Authentication is required only for submitting access requests and for the publisher dashboard.

---

## 2. Tech Stack

| Layer          | Technology                                           |
|----------------|------------------------------------------------------|
| Frontend       | Next.js 14+ (App Router), TypeScript, Tailwind CSS   |
| i18n / RTL     | next-intl (frontend), Django i18n (backend)          |
| Backend        | Django 5.x, Django REST Framework                    |
| Auth           | Django Allauth (email/password + Google, GitHub)     |
| Background     | Celery 5.x + Redis                                   |
| Database       | PostgreSQL                                           |
| Deployment     | Docker Compose, Nginx reverse proxy                  |
| CI/CD          | GitHub Actions                                       |
| Hosting        | AWS or GCP (user's choice of specific services)      |

---

## 3. Data Model

### 3.1 Resource

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| id                  | AutoField    | Primary key                                 |
| name                | CharField    | Resource display name                        |
| slug                | SlugField    | URL-friendly identifier (unique)             |
| type                | CharField    | `library`, `sdk`, `dataset`, `api`, `tafsir` |
| description         | TextField    | Rich text description                         |
| documentation_url   | URLField     | Optional                                     |
| github_url          | URLField     | Optional                                     |
| license             | CharField    | e.g., `MIT`, `GPL-3.0`, `custom`             |
| itqan_badge         | BooleanField | Quality verification badge                   |
| status              | CharField    | `draft`, `published`, `archived`             |
| created_at          | DateTimeField| Auto-set on creation                         |
| updated_at          | DateTimeField| Auto-updated on save                         |

### 3.2 AccessRequest

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| id                  | AutoField    | Primary key                                 |
| applicant           | ForeignKey   | User (on_delete=models.PROTECT)              |
| resource            | ForeignKey   | Resource (on_delete=models.CASCADE)          |
| status              | CharField    | `pending`, `approved`, `denied`              |
| message             | TextField    | Applicant's justification                    |
| publisher_notes     | TextField    | Publisher's internal notes                   |
| created_at          | DateTimeField| Auto-set                                    |
| updated_at          | DateTimeField| Auto-updated                                |

### 3.3 APIKey

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| id                  | AutoField    | Primary key                                 |
| owner               | ForeignKey   | User (on_delete=models.CASCADE)              |
| resource            | ForeignKey   | Resource (on_delete=models.CASCADE)          |
| key                 | CharField    | SHA-256 hashed key value (never stored plain)|
| scope               | CharField    | Permissions granted by this key              |
| expires_at          | DateTimeField| Null means no expiration (Q1)               |
| rotated             | BooleanField | Whether this key has been rotated out        |
| created_at          | DateTimeField| Auto-set                                    |
| last_used_at        | DateTimeField| Null if never used                           |

### 3.4 Report

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| id                  | AutoField    | Primary key                                 |
| reporter            | ForeignKey   | User (null allowed for unreported content)   |
| resource            | ForeignKey   | Resource (on_delete=models.CASCADE)          |
| reason              | CharField    | `inaccurate`, `inappropriate`, `infringing`  |
| details             | TextField    | Reporter's description                       |
| status              | CharField    | `open`, `resolved`, `closed`                 |
| created_at          | DateTimeField| Auto-set                                    |

### 3.5 Comment

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| id                  | AutoField    | Primary key                                 |
| author              | ForeignKey   | User (on_delete=models.CASCADE)              |
| resource            | ForeignKey   | Resource (on_delete=models.CASCADE)          |
| content             | TextField    | Comment text                                |
| created_at          | DateTimeField| Auto-set                                    |

### 3.6 User (Extended Django User)

| Field               | Type         | Description                                 |
|---------------------|--------------|---------------------------------------------|
| (all Django defaults) |          |                                             |
| role                | CharField    | `developer`, `publisher`, `admin`            |
| display_name        | CharField    | Public-facing name                          |
| created_at          | DateTimeField| Auto-set                                    |

---

## 4. Frontend Page Inventory (Q1)

| Page                | Route                      | Auth Required | Description                                    |
|---------------------|----------------------------|---------------|------------------------------------------------|
| Home                | `/`                        | No            | Hero, search bar, featured resources           |
| Catalog             | `/resources`               | No            | Grid/list view, filters (type, license, badge) |
| Resource Detail     | `/resources/[slug]`        | No            | Metadata, description, related resources       |
| Login               | `/login`                   | No            | Email/password + social login                  |
| Register            | `/register`                | No            | User registration                              |
| Submit Request      | `/resources/[slug]/request`| Yes           | Access request form                            |
| Publisher Dashboard | `/dashboard`               | Yes (publisher)| Access requests, resource management          |
| Publisher Resources | `/dashboard/resources`     | Yes (publisher)| CRUD for publisher's own resources           |
| Report Resource     | `/resources/[slug]/report` | Yes           | Report form                                    |

---

## 5. API Endpoint Inventory (Q1)

| Method | Endpoint                              | Auth    | Description                         |
|--------|---------------------------------------|---------|-------------------------------------|
| GET    | `/api/v1/resources/`                  | None    | List resources (with filters)       |
| GET    | `/api/v1/resources/{slug}/`           | None    | Resource detail                     |
| POST   | `/api/v1/resources/`                  | Admin   | Create resource (admin CMS)         |
| PUT    | `/api/v1/resources/{slug}/`           | Admin   | Update resource                     |
| POST   | `/api/v1/auth/login/`                 | None    | Login (Allauth)                     |
| POST   | `/api/v1/auth/register/`              | None    | Register (Allauth)                  |
| POST   | `/api/v1/access-requests/`            | User    | Submit access request               |
| GET    | `/api/v1/access-requests/`            | User    | User's own requests                 |
| PATCH  | `/api/v1/access-requests/{id}/`       | Publisher| Approve/deny request               |
| POST   | `/api/v1/api-keys/`                   | User    | Generate API key for a resource     |
| DELETE | `/api/v1/api-keys/{id}/`              | User    | Revoke API key                      |
| POST   | `/api/v1/reports/`                    | User    | Submit report                       |
| GET    | `/api/v1/comments/{resource_id}/`    | None    | List comments on a resource         |
| POST   | `/api/v1/comments/{resource_id}/`    | User    | Add comment                         |

---

## 6. Session Checkpoints

### Session 1: Backend Foundation + Data Seeding

**Goal:** Django project running, database schema in place, Django Admin functional, seed data populated.

**Deliverables:**
- Django project scaffold with Docker Compose (Django, PostgreSQL, Redis)
- All data model models defined + migrations
- DRF API skeleton with base endpoints for Resource listing + detail
- Django Admin configured with resource types, filters, and search
- Seed data script (Django management command) with 10–20 sample resources
- GitHub Actions CI: lint, test, build Docker image
- Django i18n configured for Arabic (RTL-ready)

**Exit criteria:** `docker compose up` starts the backend, admin panel accessible at `/admin`, sample resources visible, API returns resource list at `/api/resources/`.

### Session 2: Public Frontend — Catalog & Resource Pages

**Goal:** Static Next.js site with the public-facing resource catalog.

**Deliverables:**
- Next.js project scaffold with TypeScript + Tailwind + RTL config
- Home page: hero, featured resources, search bar
- Resource catalog page: grid/list view, filters (type, license, itqan badge), search
- Resource detail page: metadata, access request button, comments section, related resources
- API integration layer (fetch from Django backend)
- ISR (Incremental Static Regeneration) setup for resource pages
- Responsive design, Arabic-first typography

**Exit criteria:** `next build` produces a static HTML site, all pages render correctly, search + filters work against real API data.

### Session 3: Auth + Access Requests + Publisher Features

**Goal:** Authenticated flows for access requests and the publisher dashboard.

**Deliverables:**
- Next.js auth integration (Allauth endpoints, session management)
- Login/register pages, protected route middleware
- Access request form (developer → publisher approval flow)
- Publisher dashboard (Next.js SPA): view/manage own access requests, manage own resources
- Django: access request workflow endpoints, approval/denial API, publisher role enforcement
- API key generation endpoint (basic, non-expiring for Q1)
- Report content button on resource pages

**Exit criteria:** A developer can register, submit an access request for a resource. A publisher can log in, view requests for their resources, and approve/deny them.

### Session 4: Deployment + Polish + Documentation

**Goal:** Production-ready deployment, security hardening, and launch readiness.

**Deliverables:**
- Docker Compose production configuration (frontend + backend + postgres + redis + nginx)
- CI/CD pipeline (GitHub Actions): build, test, deploy on main branch push
- Nginx reverse proxy config (SSL termination, CORS, static asset caching)
- Environment-based config for Django + Next.js
- Security: CSRF, CORS, rate limiting, API key hashing
- Admin guide: how to add resources, manage reports, manage users
- README with local dev setup + production deploy instructions
- Smoke tests for critical user flows

**Exit criteria:** Site deploys cleanly to staging, all critical flows pass smoke tests, admin documentation is complete.

---

## 7. Out of Scope (Q2+ per strategic roadmap)

- Analytics dashboard
- Resource versioning & release notes
- AI-assisted catalog indexing and semantic search
- SDK registry and webhook integrations
- Flarum community data integration
- Advanced API key expiration and rotation
- Automated content seeding from the existing RATQ repository
- In-app real-time notifications (email-only for Q1)

---

## 8. Prerequisites to Complete Before Q1 Development

As stated in the strategic document, both must be resolved:

1. **No design/mockups exist** — Decision: skip formal design, iterate visually alongside early development. A simple wireframe/structure is defined in Section 4 (page inventory).
2. **Content/resource types not finalized** — Decision: include all 5 types at launch (libraries, SDKs, datasets, APIs, tafsir/translation references).

---

## 9. Architectural Notes & Decisions

### 9.1 Unified Authentication (from strategic doc)

**Decision:** Launch with per-session auth only (public catalog, gated auth for access requests + publisher dashboard). Plan to migrate toward a unified identity provider in Q2 or later. This creates technical debt of a potential future identity provider integration, but avoids the upfront cost and cross-project dependency risk noted in the strategic doc.

### 9.2 Success Metrics

The strategic doc lists TBD KPIs. For Q1, the only measurable target is: successful internal beta launch with seeded resources and functional access requests.
