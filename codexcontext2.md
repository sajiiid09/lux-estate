# LuxEstate Codex Context 2

This document summarizes the LuxEstate project state (backend + tests) by combining prior context from `codexcontext1.md` with updates implemented during recent chat iterations.

## Stack & Configuration
- **Backend:** Django 5.2 with DRF, SimpleJWT, django-filter; apps include users, properties, bookings, payments, and core helpers. SQLite is used for tests; PostgreSQL is configured via `DATABASE_URL` in `.env`.【F:lux_estate/settings.py†L38-L124】【F:.env†L1-L9】
- **Cache/Logging:** Default cache uses locmem; logging is configured with console handler and per-app loggers for bookings, payments, and properties.【F:lux_estate/settings.py†L122-L205】
- **URLs:** Project routes mount auth, properties, bookings, and payments APIs under the `/api/` prefix, plus Django admin.【F:lux_estate/urls.py†L20-L27】

## Domain & Services
- **Properties:** Categories form a parent/child tree; properties carry price, availability, and status. DFS-based helpers compute category subtrees and recommend properties, caching results and logging cache hits/misses.【F:properties/services.py†L1-L66】
- **Bookings:** Concurrency-safe `create_booking` locks the property row (`select_for_update`), validates status/availability, calculates totals, marks the property unavailable, and logs each step.【F:bookings/services.py†L12-L52】
- **Payments:** Strategy pattern provides Stripe and bKash stubs returning initiated statuses and fake transaction IDs.【F:payments/strategies.py†L11-L79】 Payment orchestration selects a provider strategy, blocks already-paid bookings, creates/updates `Payment` rows, and marks bookings paid on success; Stripe/bKash webhook handlers update payment/booking status inside atomic transactions with logging.【F:payments/services.py†L10-L92】【F:payments/services.py†L94-L150】

## Serialization & APIs
- Booking serializers/views expose create/list/detail endpoints scoped to the authenticated user; payment serializers/views handle payment initiation plus Stripe/bKash webhook endpoints.【F:bookings/urls.py†L1-L6】【F:payments/urls.py†L1-L7】
- Properties API offers category listing, property listing/detail by slug, and recommended properties per category subtree.【F:properties/urls.py†L1-L10】

## Tests
- **Properties:** DFS/recommendation tests build a category tree, verify subtree IDs, cache behavior, and exclusion of unavailable properties.【F:properties/tests/test_services.py†L6-L71】
- **Bookings:** Service tests cover successful creation, inactive/unavailable cases, and double-booking prevention via ValidationErrors.【F:bookings/tests/test_services.py†L18-L63】
- **Payments:** Strategy tests assert initiated responses and factory mapping; service tests cover initiation success, already-paid/unsupported providers, and Stripe webhook success/failure transitions.【F:payments/tests/test_strategies.py†L7-L36】【F:payments/tests/test_services.py†L11-L95】

## Operational Notes
- Current repo snapshot lacks the `frontend/` directory that earlier context referenced; only backend apps and docs are present.【56df1b†L1-L3】
- Network access to the upstream GitHub repository remains blocked (CONNECT 403), so synchronization relies on local changes rather than `git fetch`/`pull`.
