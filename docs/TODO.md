# TODO

## Project Progress
- [x] Create safe backup checkpoint (`_backup_checkpoint/`)
- [x] Relocate and isolate frontend into `/frontend`
- [x] Preserve all 28 UI components, styling, animations, and screens
- [x] Set currency to INR (₹) across database, seed data, and UI
- [x] Build backend architecture (Config, Middlewares, Utilities, Repositories, Services, Controllers, Routes)
- [x] Setup SQLite database with auto-migrations and seed script (`node:sqlite`)
- [x] Implement JWT Authentication & RBAC guards
- [x] Implement REST APIs for Products, Batches, Sales, Purchases, Collections, Customers, Suppliers, Dashboard, Staff, Audit Logs, Tenant
- [x] Create frontend REST API client (`frontend/src/services/api.ts`)
- [x] Connect frontend `AppContext` with live backend synchronization & offline fallback
- [x] Verify frontend build (`npm run build` passed with 0 errors)
- [x] Verify backend server (`GET /api/v1/health` and `POST /api/v1/auth/login` passed)
