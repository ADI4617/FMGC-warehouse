# Changelog

## [2026-08-21]

### Added:
- Initial /docs context system (CONTEXT, REQUIREMENTS, ARCHITECTURE, DECISIONS, BUSINESS_RULES, SECURITY, ERROR_HANDLING, VALIDATION, DATABASE, TESTING, DEPLOYMENT)
- Backend project scaffolding begun

## [2026-08-21] — Backend Complete

### Added
- All 11 repositories (user, product, batch, customer, supplier, sale, purchase, collection, stockMovement, auditLog, predictiveInsight, tenant)
- All 15 services (auth, staff, product, batch, customer, supplier, sale, purchase, collection, inventory, dashboard, report, tenant, audit, ai)
- All 15 controllers
- All 15 route files registered under /api/v1/
- app.ts with helmet, cors, rate limiting, health check, centralized error handling
- server.ts with bootstrap, DB init, seed, graceful shutdown
- backend/.env (local dev config)
- All business rules BR-001 through BR-019 implemented

### Fixed
- JWT SignOptions expiresIn type compatibility with @types/jsonwebtoken (StringValue import)

### Known
- better-sqlite3 native binary requires C++ build tools or Node LTS v22 to run
