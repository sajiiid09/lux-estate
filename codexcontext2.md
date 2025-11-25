# LuxEstate Codex Context 2

This file consolidates prior context (see `codexcontext1.md`) with all updates and observations from the most recent chat so new environments can pick up quickly.

## Repository Snapshot
- Backend-focused Django project (no `frontend/` directory present in current tree, though earlier context referenced a static landing page).
- Network access to the upstream GitHub repo remains blocked (`CONNECT` 403), so syncing relies on local changes rather than `git fetch`/`pull`.

## Stack & Configuration
- **Backend:** Django 5.2 with DRF, SimpleJWT, django-filter; core apps: users, properties, bookings, payments.
- **Env/DB:** `.env` loaded via `django-environ`; PostgreSQL configured via `DATABASE_URL` (SQLite used in tests); cache defaults to locmem.
- **Logging:** Console handler with per-app loggers (`bookings`, `payments`, `properties`); services/strategies log key actions.
- **URLs:** `/api/auth/`, `/api/properties/`, `/api/bookings/`, `/api/payments/` plus Django admin.

## Domain Features
- **Properties:** Category tree (parent/children) with DFS helpers to gather subtree property IDs and recommended properties; results cached and logged. Properties track price, availability, and status.
- **Bookings:** `create_booking` uses `transaction.atomic()` and `select_for_update()` to lock the property, validates status/availability, calculates total, marks the property unavailable, and logs the flow.
- **Payments:** Strategy pattern with Stripe and bKash stubs returning initiated status + fake transaction IDs. Orchestration picks the strategy, blocks already-paid bookings, upserts `Payment` records, and marks bookings paid on success. Stripe/bKash webhook handlers update payment/booking status inside atomic transactions.

## APIs & Serialization
- **Auth:** Register/login/refresh/me via SimpleJWT views.
- **Properties:** Category list; property list/detail by slug; recommended properties per category subtree.
- **Bookings:** Authenticated create/list/detail endpoints scoped to the requesting user using booking serializers.
- **Payments:** Authenticated payment initiation plus Stripe and bKash webhook endpoints; serializers drive initiation and response formatting.

## Tests (Current Coverage)
- **Properties:** DFS/recommendation tests build category trees, verify subtree IDs, caching behavior, and exclusion of unavailable properties.
- **Bookings:** Service tests cover successful creation, inactive/unavailable properties, and double-booking prevention via ValidationErrors.
- **Payments:** Strategy tests validate Stripe/bKash responses and factory mapping; service tests cover initiation success, already-paid/unsupported providers, and Stripe webhook success/failure transitions updating booking/payment status.

## Open Notes & Decisions
- bKash remains stubbed; Stripe flows are the primary functional path.
- Follow chat-provided instructions (AGENTS files are not in use for guidance in this environment).
