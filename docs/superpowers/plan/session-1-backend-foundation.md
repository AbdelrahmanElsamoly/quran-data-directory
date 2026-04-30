# Session 1: Backend Foundation + Data Seeding — Implementation Plan

**Source:** `docs/superpowers/specs/2026-04-24-ratq-community-platform-q1-implementation-design.md`
**Scope:** Q1 — Session 1 of 4
**Exit criteria:** `docker compose up` starts the backend, admin panel accessible at `/admin`, sample resources visible, API returns resource list at `/api/resources/`.

---

## Project Structure

```
backend/
├── Dockerfile
├── docker-compose.yml          # root-level, at project root
├── .dockerignore
├── .gitignore
├── .env.example
├── Makefile
├── README.md
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── manage.py
├── .pre-commit-config.yaml
├── ratq/                       # Django project config
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── storage.py
├── apps/
│   ├── __init__.py
│   ├── accounts/               # Custom user model + profile
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── resources/              # Resource catalog
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── requests/               # Access request workflow
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── api_keys/               # API key management
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   └── reports/                # Content reporting
│       ├── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── migrations/
├── seeds/
│   ├── __init__.py
│   └── seed_resources.py       # Management command
├── utils/
│   └── __init__.py
```

---

## Step-by-Step Build Order

### 1. Infrastructure Setup

**Files:**
- `backend/Dockerfile` — Python 3.12 image, copy requirements, install deps
- `docker-compose.yml` — services: django, postgres, redis
- `.env.example` — database credentials, secret key
- `requirements/base.txt`, `dev.txt`, `prod.txt`

**Django dependencies:**
- `django==5.1.x`
- `djangorestframework==3.15.x`
- `django-filter==24.x` (for API filtering)
- `djangorestframework-simplejwt==5.x` (JWT auth)
- `django-allauth[socialaccount]==65.x` (auth)
- `psycopg==3.2.x` (PostgreSQL adapter)
- `redis==5.x`
- `celery==5.4.x`
- `gunicorn==22.x` (production WSGI)
- `drf-spectacular==0.27.x` (OpenAPI schema)
- `django-environ==0.11.x` (env var management)
- `pre-commit`, `pytest-django`, `factory-boy` (dev)

### 2. User Model (`apps/accounts`)

**Model:** Extended Django User with `role` (developer/publisher/admin) and `display_name`.

**Files:**
- `apps/accounts/models.py` — `CustomUser` model (AbstractUser)
- `apps/accounts/serializers.py` — UserSerializer
- `apps/accounts/admin.py` — Admin registration
- `apps/accounts/urls.py` — routes for auth endpoints
- `apps/accounts/views.py` — register, login views

**Key decisions:**
- Use `AbstractUser` (not `AbstractBaseUser`) to preserve all Django defaults
- Role is CharField with choices, defaults to `developer`
- Allauth handles social login, we extend the profile

### 3. Resource Model (`apps/resources`)

**Model:** Core catalog entity with type, license, itqan_badge, status.

**Files:**
- `apps/resources/models.py` — `Resource` model
- `apps/resources/serializers.py` — ResourceSerializer (with read-only fields)
- `apps/resources/views.py` — ResourceListView, ResourceDetailView
- `apps/resources/urls.py` — `/api/v1/resources/`
- `apps/resources/admin.py` — Admin with filters (type, status, itqan_badge), search, list display
- `apps/resources/migrations/` — auto-generated

**Key decisions:**
- `type` is CharField with choices: library, sdk, dataset, api, tafsir
- `status` is CharField with choices: draft, published, archived
- `slug` auto-generated from name
- DRF filters: `?type=library&license=MIT&itqan_badge=true`

### 4. Access Request Model (`apps/requests`)

**Model:** Links user → resource with workflow states.

**Files:**
- `apps/requests/models.py` — `AccessRequest` model
- `apps/requests/serializers.py` — AccessRequestSerializer
- `apps/requests/views.py` — CreateAccessRequest, MyRequests, ManageRequest (publisher)
- `apps/requests/urls.py` — `/api/v1/access-requests/`
- `apps/requests/admin.py` — Admin with status filters
- `apps/requests/migrations/`

**Key decisions:**
- Only publishers can approve/deny requests for their own resources
- Status flow: pending → approved/denied
- Serializer validates: user cannot submit duplicate pending request for same resource

### 5. API Key Model (`apps/api_keys`)

**Model:** Hashed API keys scoped to resource.

**Files:**
- `apps/api_keys/models.py` — `APIKey` model
- `apps/api_keys/serializers.py` — APIKeySerializer (key hidden on read)
- `apps/api_keys/views.py` — GenerateAPIKey, ListUserKeys, RevokeAPIKey
- `apps/api_keys/urls.py` — `/api/v1/api-keys/`
- `apps/api_keys/migrations/`

**Key decisions:**
- Key is SHA-256 hashed on creation, never stored plain
- Q1: no expiration (expires_at = null)
- Key generation returns the plaintext key ONCE, then only hashed

### 6. Report Model (`apps/reports`)

**Model:** User-reported content issues.

**Files:**
- `apps/reports/models.py` — `Report` model
- `apps/reports/serializers.py` — ReportSerializer
- `apps/reports/views.py` — CreateReport
- `apps/reports/urls.py` — `/api/v1/reports/`
- `apps/reports/admin.py` — Admin with status/reason filters
- `apps/reports/migrations/`

### 7. Comment Model (included in resources)

**Decision:** Include `Comment` as a related model on `Resource` (not a separate app). Comments are always scoped to a resource.

**Files:**
- Add to `apps/resources/models.py` — `Comment` model (ForeignKey to Resource)
- Add to `apps/resources/serializers.py` — CommentSerializer, ResourceDetailSerializer (includes comments)
- Add to `apps/resources/views.py` — CommentListView, CommentCreateView
- Add to `apps/resources/urls.py` — `/api/v1/resources/{slug}/comments/`

### 8. Settings & URLs

**Files:**
- `ratq/settings.py` — Full Django settings with environ, i18n (Arabic-first)
- `ratq/urls.py` — Root URLs including all app routers
- `ratq/storage.py` — Custom user manager

**Key decisions:**
- `LANGUAGE_CODE = 'ar'` (Arabic first)
- `LANGUAGES = [('ar', 'Arabic'), ('en', 'English')]`
- `LOCALE_PATHS = [BASE_DIR / 'locale']`
- DRF config: pagination, filtering, authentication classes
- Allauth configured for email + social (Google, GitHub)
- CSRF trusted origins configured for Next.js frontend

### 9. Django Admin

**Files:**
- `apps/*/admin.py` for each app
- Register all models with list_display, list_filter, search_fields
- Resource admin: type filter, status filter, itqan_badge filter, search on name/description

### 10. Seed Data

**Files:**
- `seeds/seed_resources.py` — Django management command
- Generates 15–20 sample resources across all 5 types
- Creates sample users (developer, publisher, admin)
- Runs with: `python manage.py seed_resources`

### 11. CI/CD + i18n

**Files:**
- `.github/workflows/ci.yml` — lint, test, build
- `Makefile` — common commands (migrate, run, seed, test)
- `locale/` — Django i18n directory (empty, translations generated on demand)

---

## Build Order Summary (sequential)

1. Infrastructure (Docker, requirements, env) → `docker compose up` works
2. User model + auth endpoints → registration works
3. Resource model + API + admin → catalog endpoints + admin visible
4. Seed data → sample resources in DB
5. Access requests + API keys + reports + comments → full workflow
6. i18n + CI + Makefile → polished and automated
