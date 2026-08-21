# Security

## Authentication
- JWT access tokens with configurable expiry (default 24h).
- Passwords hashed using bcryptjs with salt rounds = 12.

## Authorization
- All protected routes require valid JWT via `Authorization: Bearer <token>`.
- RBAC middleware checks user role against allowed roles for each route.
- TenantId extracted from JWT payload — never from request body/query.

## Input Validation
- All request bodies validated via Zod schemas before reaching controllers.
- Rejects unknown/extra fields.

## Rate Limiting
- Global rate limit: 100 requests per 15 minutes per IP.
- Auth routes: 10 requests per 15 minutes per IP.

## CORS
- Configurable allowed origins via environment variable.

## Headers
- Helmet middleware for security headers.

## Sensitive Data
- Never return: password, passwordHash in any API response.
- Never log: passwords, tokens, API keys.

## Environment Secrets
- All secrets via environment variables (.env).
- .env never committed to git.

## Object-Level Authorization
- TenantId scoping prevents cross-tenant access at the repository layer.

## Error Responses
- Never expose stack traces in production.
- Generic "Internal Server Error" for unhandled exceptions.
