# Session 4: Deployment + Polish + Documentation

**Source:** `docs/superpowers/specs/2026-04-24-ratq-community-platform-q1-implementation-design.md`
**Scope:** Q1 — Session 4 of 4
**Dependencies:** Sessions 1-3 complete (full-stack application functional locally)
**Exit criteria:** Site deploys cleanly to staging, all critical flows pass smoke tests, admin documentation is complete.

---

## Scope

Production deployment, security hardening, CI/CD automation, and documentation. This is the "launch readiness" session.

---

## Step-by-Step Build Order

### 1. Docker Compose Production Configuration

**Files:**
- `docker-compose.prod.yml` — production overlay:
  - Frontend (Next.js static build, nginx serving static files)
  - Backend (Django + gunicorn, not manage.py runserver)
  - PostgreSQL (persistent volume)
  - Redis (Celery broker)
  - Nginx (reverse proxy, SSL termination, CORS)
- `backend/Dockerfile.prod` — slim Python image, production gunicorn config
- `frontend/Dockerfile.prod` — multi-stage: build Next.js, serve with nginx
- `nginx/nginx.conf` — reverse proxy config:
  - `/api/` → backend:8000
  - `/*` → frontend:3000 (static files)
  - SSL configuration (Let's Encrypt)
  - CORS headers for frontend origin
  - Static asset caching headers

**Key decisions:**
- Nginx handles all HTTPS, proxies to backend and serves frontend
- Backend runs gunicorn with 4 workers (configurable via env)
- Frontend static files served directly by nginx (no Node server in production)
- PostgreSQL data persisted in Docker volume

### 2. Environment Configuration

**Files:**
- `backend/.env.production.example` — production env vars
- `frontend/.env.production.example` — production env vars
- `backend/ratq/settings.py` — env-based config for all production settings

**Env vars needed:**
```
# Backend
DATABASE_URL=postgresql://user:pass@db:5432/ratq
REDIS_URL=redis://redis:6379/0
SECRET_KEY=<generated>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ORIGINS=https://yourdomain.com
DEBUG=false
AWS_REGION=...  # if using S3 for media
AWS_S3_BUCKET=...  # if using S3
```

```
# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Security Hardening

**Files:**
- `backend/ratq/settings.py` — security settings
- `backend/requirements/prod.txt` — add security packages

**Security measures:**
- DRF throttling: rate limit all endpoints (100 req/min anonymous, 500 req/min authenticated)
- API key hashing: SHA-256 (already implemented in data model, verify in code)
- CORS: strict origin whitelist
- CSRF: enabled for Django session auth
- Helmet-like headers: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security
- SQL injection prevention: Django ORM only (no raw queries)
- XSS prevention: React auto-escapes, Django template auto-escaping
- Password policy: minimum length, complexity (via Allauth)
- Session management: JWT token expiry (access: 15min, refresh: 7days)

### 4. CI/CD Pipeline

**Files:**
- `.github/workflows/ci.yml` — continuous integration
- `.github/workflows/cd-staging.yml` — deploy to staging on main push
- `.github/workflows/cd-prod.yml` — deploy to production (manual trigger)

**CI workflow:**
```
On PR to main:
1. Backend: lint (flake8/black/isort), type check (mypy), test (pytest)
2. Frontend: lint (eslint), build (next build)
3. Docker: build both images, validate
4. Security: dependency audit (pip audit, npm audit)
```

**CD staging workflow:**
```
On merge to main:
1. Build Docker images
2. Push to container registry (ECR/GCR)
3. Deploy to staging environment
4. Run smoke tests against staging
5. Notify on success/failure
```

**CD production workflow:**
```
Manual trigger:
1. Build Docker images
2. Push to container registry
3. Deploy to production (rolling update)
4. Health check verification
5. Notify on success/failure
```

### 5. Smoke Tests

**Files:**
- `tests/smoke/` — Playwright test suite
- `tests/smoke/test_home.spec.ts` — Home page loads
- `tests/smoke/test_catalog.spec.ts` — Catalog page loads, search works
- `tests/smoke/test_resource_detail.spec.ts` — Detail page loads, comments load
- `tests/smoke/test_auth.spec.ts` — Register, login, access protected routes
- `tests/smoke/test_access_request.spec.ts` — Submit request, view as publisher

**Key decisions:**
- Playwright for E2E tests (headless Chromium/Firefox)
- Tests run against staging environment in CI
- Tests are fast: < 30 seconds total
- Failures block production deployment

### 6. Admin Documentation

**Files:**
- `docs/admin-guide.md` — Admin/SOP documentation

**Contents:**
- **Getting started:** local setup, staging setup, production deploy
- **Adding resources:** how to create/edit/archive resources via Django Admin
- **Managing access requests:** how to handle requests via Admin (fallback if dashboard is down)
- **Managing users:** how to assign publisher role, ban users, reset passwords
- **Handling reports:** reviewing and acting on user reports
- **API key management:** generating and revoking keys via Admin
- **Monitoring:** how to check logs, uptime, error rates
- **Backup & recovery:** database backup procedures, restore process
- **Environment variables:** what each var does, how to change them

### 7. Project README

**Files:**
- `README.md` — at project root

**Contents:**
- Project overview
- Tech stack
- Local development setup (docker compose up)
- Seeding data
- Running tests
- Production deployment steps
- Environment variables reference
- Contributing guidelines

### 8. Final Polish

**Files:**
- Error pages: `frontend/src/app/not-found.tsx`, `frontend/src/app/error.tsx`
- Loading states: ensure all pages have proper loading skeletons
- Favicon and metadata: Open Graph tags, site icons
- Performance: image optimization, font loading, code splitting verification

---

## Build Order Summary

1. Docker Compose production config → local production-like environment works
2. Environment configuration → all env vars documented and working
3. Security hardening → throttling, CORS, CSRF, rate limits in place
4. CI/CD pipeline → automated build, test, deploy to staging
5. Smoke tests → critical flows verified automatically
6. Admin documentation → SOP guide complete
7. Project README → setup and deploy instructions complete
8. Final polish → error pages, metadata, performance checks

**Total: ~8 steps, infrastructure and documentation focus.**

---

## Deployment Architecture

```
                    ┌──────────────┐
                    │   Nginx      │
                    │  (SSL/HTTPS) │
                    └───┬─────┬────┘
                        │     │
              /api/*    │     │    /*
              ▼         │     │    ▼
        ┌──────────┐    │    ┌─────────────┐
        │  Django  │    │    │   Next.js   │
        │  + gunicorn│   │    │  (static)   │
        │   :8000   │    │    │  :3000      │
        └─────┬────┘    │    └──────┬──────┘
              │          │          │
              ▼          │          ▼
        ┌──────────┐    │    ┌──────────┐
        │PostgreSQL│    │    │  Redis   │
        │  :5432   │    │    │  :6379   │
        └──────────┘    │    └──────────┘
```

---

## Rollback Plan

If deployment fails:
1. CI/CD pipeline halts on failed health check
2. Previous image tag remains in production
3. One-command rollback: `docker compose pull ratq:previous-tag && docker compose up -d`
4. Database migrations are forward-only; if broken, revert code tag + run `python manage.py migrate <app_name>:previous_migration`

---

## Launch Checklist

- [ ] All 4 sessions complete
- [ ] Smoke tests pass on staging
- [ ] Admin documentation reviewed
- [ ] Environment variables configured for production
- [ ] SSL certificate installed
- [ ] Database backups scheduled (daily)
- [ ] Monitoring/alerting configured
- [ ] Seed data populated for production
- [ ] At least one publisher account created
- [ ] Domain DNS configured
- [ ] Rollback procedure tested
