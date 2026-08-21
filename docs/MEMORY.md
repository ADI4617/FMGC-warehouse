# PROJECT MEMORY

## Current State
- Backend Status: Production-Ready & Active (`http://localhost:3001`)
- Frontend Status: Separated into `/frontend` & Verified (`http://localhost:3000`)
- Current Phase: Connected & Verified

## Completed
- Safe backup checkpoint created at `_backup_checkpoint/`
- Full React 19 Frontend isolated into `frontend/` (all 28 components, styles, types preserved)
- Currency updated to INR (₹) across database, models, seed, and UI
- Backend built with Node.js, Express, `node:sqlite`, JWT auth, RBAC, and Zod validation
- REST APIs implemented for: Auth, Staff, Products, Batches, Sales, Purchases, Collections, Customers, Suppliers, Dashboard KPIs, Audit Logs, Tenant Settings
- Frontend API client created (`frontend/src/services/api.ts`) and integrated into `AppContext.tsx` with offline fallback
- Frontend build verified with 0 errors
- Backend server verified with live health check and authenticated queries

## Architecture & Layout
```text
FMGC-warehouse-main/
├── frontend/             (React 19 + TypeScript + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/   (28 UI components & modals)
│   │   ├── context/      (AppContext state & API sync)
│   │   ├── services/     (REST API client)
│   │   ├── data/         (Mock & initial dataset)
│   │   └── types/        (TypeScript definitions)
│   └── package.json
│
├── backend/              (Node.js Express + SQLite API)
│   ├── src/
│   │   ├── config/       (Database schema, logger, env, seed)
│   │   ├── models/       (Domain interfaces)
│   │   ├── repositories/ (SQLite data access with tenant isolation)
│   │   ├── services/     (Business logic & transactions)
│   │   ├── controllers/  (REST request/response handlers)
│   │   ├── routes/       (API v1 router)
│   │   ├── middlewares/  (Auth, RBAC, Zod validator, Error handler)
│   │   └── server.ts     (Bootstrap & listening)
│   └── package.json
│
├── docs/                 (AI persistent context & specs)
└── _backup_checkpoint/   (Safe clone of original structure)
```

## Important Decisions
- Zero-native build dependency SQLite via `node:sqlite` DatabaseSync (DEC-001)
- Currency standardized to Indian Rupee (INR ₹) across all layers (DEC-008)
- Multi-tenancy and RBAC enforced at repository and route middleware layers

## Known Issues
- None

## Important Files
- `frontend/src/services/api.ts` — Frontend API client
- `frontend/src/context/AppContext.tsx` — State provider with live backend sync
- `backend/src/config/database.ts` — SQLite schema and connection
- `backend/src/routes/api.ts` — API v1 routes
- `backend/src/server.ts` — Backend entry point
