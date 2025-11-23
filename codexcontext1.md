# LuxEstate Codex Context

This document captures the current state of the LuxEstate Django + static frontend project to help future contributors continue in a new environment.

## Technology Stack
- **Backend:** Django 5.2 with DRF, SimpleJWT, django-filter, django-redis, and PostgreSQL via `django-environ`/`psycopg2-binary`.【F:requirements.txt†L1-L11】【F:lux_estate/settings.py†L13-L166】
- **Frontend:** Static HTML/CSS/JS landing page under `frontend/` (no build tools).【F:frontend/index.html†L1-L186】【F:frontend/scripts/main.js†L1-L8】

## Environment & Configuration
- `.env` expected at project root; sample values define `SECRET_KEY`, `DEBUG`, PostgreSQL `DATABASE_URL`, DB credentials, and `REDIS_URL`.【F:.env†L1-L9】
- Settings load env vars via `environ.Env.read_env(BASE_DIR / '.env')` and configure PostgreSQL through `env.db()`.【F:lux_estate/settings.py†L16-L124】
- Redis cache is default backend using `django_redis.cache.RedisCache` with location from `REDIS_URL`.【F:lux_estate/settings.py†L115-L124】

## Django Apps & Core Models
- **users:** Custom `User` extends `AbstractUser`; auth endpoints for register/login/refresh/me provided via DRF + SimpleJWT.【F:users/models.py†L1-L6】【F:users/urls.py†L1-L10】【F:users/views.py†L1-L14】
- **properties:** `Category` with slug + parent/children tree; `Property` with pricing, availability, status choices; slug auto-generation on save.【F:properties/models.py†L1-L38】
- **bookings:** `Booking` model links user→property, stores total, status enum, timestamps; `calculate_total` returns property price.【F:bookings/models.py†L1-L22】
- **payments:** `Payment` model with provider/status enums, one-to-one with `Booking`, timestamps, optional transaction data.【F:payments/models.py†L1-L20】
- **core:** Placeholder for root API include (no notable code changes captured here).

## API Surface (Implemented)
- **Auth:** `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/` routed via project URLs and DRF JWT views.【F:lux_estate/urls.py†L18-L24】【F:users/urls.py†L1-L10】
- **Properties & Categories (read-only):**
  - `/api/categories/` list categories.
  - `/api/properties/` list properties with filters `category` and `status` (DjangoFilterBackend).
  - `/api/properties/<slug:slug>/` retrieve property by slug.
  - `/api/properties/recommended/?category_id=<id>` returns properties in a category subtree using cached DFS lookup.【F:properties/urls.py†L1-L10】【F:properties/views.py†L10-L42】【F:properties/services.py†L1-L44】

## Caching & Recommendations
- Category subtree property IDs cached for 5 minutes using `django.core.cache.cache` to speed recommended property lookups; DFS traverses children via `related_name='children'`.【F:properties/services.py†L1-L44】

## Frontend Snapshot
- Landing page (`frontend/index.html`) includes sticky navbar, hero with CTA, filter strip, featured properties grid, about section, and contact CTA; placeholders for imagery/content and responsive layout via CSS grid/flex. Mobile nav toggled by `frontend/scripts/main.js`.【F:frontend/index.html†L1-L186】【F:frontend/scripts/main.js†L1-L8】
- Styles live in `frontend/styles.css` (luxury-inspired palette, responsive breakpoints).【F:frontend/styles.css†L1-L416】

## Known Gaps / TODOs
- **Booking APIs not implemented:** No service layer, serializers, DRF views, or URL routing exist; `bookings` directory lacks `services.py`, `serializers.py`, and `urls.py`, and `bookings/views.py` remains a stub. Booking requests currently 404 and lack concurrency safeguards (`select_for_update`, `transaction.atomic`).【9b059a†L1-L2】【F:bookings/views.py†L1-L3】
- **Core API coverage:** No endpoints yet for payments or other business flows beyond read-only properties/categories and auth.
- **Deployment:** ALLOWED_HOSTS empty; adjust for production. Ensure PostgreSQL/Redis services available per `.env` values.

## Quick Start (local)
1. `python -m venv venv && source venv/bin/activate`
2. `pip install -r requirements.txt`
3. Create and populate `.env` (see sample) with PostgreSQL + Redis values.
4. `python manage.py migrate` then `python manage.py createsuperuser`
5. `python manage.py runserver` (APIs at `/api/...` as above); static frontend served directly from `frontend/` if opened in browser.

## Suggested Next Steps
- Implement transactional booking creation service (`transaction.atomic`, `select_for_update`) plus serializers/views/URLs secured to `request.user`.
- Add payment initiation/confirmation flows and expose booking/payment APIs with proper permissions.
- Expand validation, tests (unit + integration), and API documentation (OpenAPI/Swagger) for auth, properties, bookings, and payments.
- Harden production settings (ALLOWED_HOSTS, CORS, HTTPS, SECRET_KEY handling) and add CI checks for linting/tests.
