# Decisions Log

## DEC-001
**Decision**: Use SQLite (better-sqlite3) as the database.
**Why**: Zero-config, single-file, synchronous API suitable for the current scale. Repository pattern allows future migration to PostgreSQL.
**Alternatives**: PostgreSQL (overkill for initial deployment), MongoDB (schema-less not ideal for relational FMCG data).
**Impact**: Simpler deployment, no database server needed.
**Date**: 2026-08-21

## DEC-002
**Decision**: Use JWT access tokens for authentication (no refresh tokens initially).
**Why**: Frontend is an SPA that stores auth state. JWT is stateless and compatible.
**Alternatives**: Session cookies (requires server-side session store), OAuth2 (unnecessary complexity).
**Impact**: Stateless auth, token expiry handles session management.
**Date**: 2026-08-21

## DEC-003
**Decision**: Use Zod for input validation.
**Why**: TypeScript-native, composable, excellent error messages, integrates well with Express middleware.
**Alternatives**: Joi (not TS-native), express-validator (less composable).
**Impact**: Type-safe validation schemas, shared types between validation and TS interfaces.
**Date**: 2026-08-21

## DEC-004
**Decision**: Layered architecture (Routes → Controllers → Services → Repositories).
**Why**: Clear separation of concerns, testable, maintainable.
**Alternatives**: Fat controllers (harder to test), CQRS (over-engineered for this scale).
**Impact**: More files but cleaner code organization.
**Date**: 2026-08-21

## DEC-005
**Decision**: Tenant isolation enforced at repository layer. TenantId derived from JWT, never from client payload.
**Why**: Security — prevents cross-tenant data access.
**Alternatives**: Separate databases per tenant (complex), schema-level isolation (SQLite limitation).
**Impact**: All repository queries include `WHERE tenant_id = ?`.
**Date**: 2026-08-21

## DEC-006
**Decision**: Seed the database with the same demo data from frontend's initialData.ts.
**Why**: Ensures frontend-backend compatibility during development and demo.
**Alternatives**: Empty database (poor demo experience).
**Impact**: Seed script mirrors frontend mock data.
**Date**: 2026-08-21

## DEC-007
**Decision**: AI features use Gemini API server-side.
**Why**: Existing frontend metadata specifies `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. API key must stay server-side.
**Alternatives**: Client-side API calls (insecure, exposes API key).
**Impact**: AI routes proxy through backend to Gemini.
**Date**: 2026-08-21
