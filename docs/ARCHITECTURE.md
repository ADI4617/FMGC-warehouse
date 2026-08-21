# Architecture

## Data Flow
```
Frontend (React SPA)
      ↓ HTTP/JSON
API Routes (/api/v1/*)
      ↓
Middleware (Auth → RBAC → Validation → Rate Limit)
      ↓
Controllers (Request/Response, HTTP status)
      ↓
Services (Business logic, transactions, orchestration)
      ↓
Repositories (SQL queries, tenant isolation)
      ↓
SQLite Database (better-sqlite3, synchronous)
```

## Layer Responsibilities

### Routes
HTTP method + endpoint + middleware chain + controller mapping. No logic.

### Controllers
Parse request, call service, return HTTP response. No business logic.

### Services
Business rules, validation beyond schema, transactions, cross-entity orchestration.

### Repositories
Pure data access. All queries scoped by `tenantId`. No business rules.

### Middleware
Auth (JWT verification), RBAC (role check), Validator (Zod schema), Error handler.

## Database
SQLite via better-sqlite3 (synchronous, single-file, zero-config). Repository pattern enables future migration to PostgreSQL.

## AI Integration
Server-side Gemini API calls via `@google/genai`. Used for:
1. Invoice OCR: Image → structured item extraction.
2. Chat assistant: Natural language → structured query → data response.
3. Optimizer: Inventory analysis → reorder/clearance recommendations.

## External Services
- Google Gemini API (AI features)
- No other external dependencies required.

## Deployment
Single Node.js process. SQLite file stored locally. Suitable for Cloud Run / VPS / Docker.
