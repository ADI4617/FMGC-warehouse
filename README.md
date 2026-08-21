# FMCG Distro — AI-Powered Distribution Management System

Enterprise FMCG distribution platform with FEFO inventory tracking, AI invoice OCR scanning, POS billing, collections management, audit logging, and role-based access control.

---

## Project Structure

```text
FMGC-warehouse-main/
├── frontend/             # React 19 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # 28 UI components and modals
│   │   ├── context/      # AppContext state & live backend sync
│   │   ├── services/     # REST API client
│   │   ├── data/         # Initial seed dataset
│   │   └── types/        # TypeScript interfaces
│   └── package.json
│
├── backend/              # Node.js + Express + SQLite REST API
│   ├── src/
│   │   ├── config/       # Database (node:sqlite), logger, env, seed
│   │   ├── models/       # Domain interfaces (INR ₹)
│   │   ├── repositories/ # Tenant-isolated SQLite queries
│   │   ├── services/     # Business logic & transaction orchestration
│   │   ├── controllers/  # REST request/response handlers
│   │   ├── routes/       # API v1 router
│   │   ├── middlewares/  # JWT auth, RBAC, Zod validator, Error handler
│   │   └── server.ts     # Express server bootstrap
│   └── package.json
│
└── docs/                 # Persistent AI context & technical specifications
```

---

## Running Locally

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
- Backend runs on `http://localhost:3001`
- Health check: `http://localhost:3001/api/v1/health`
- Database automatically initializes and seeds with INR (₹) demo data.

### 2. Start the Frontend App
```bash
cd frontend
npm install
npm run dev
```
- Frontend runs on `http://localhost:3000`

---

## Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `rajesh.k@apexfmcg.com` | `password123` |
| **Owner** | `sarah.j@apexfmcg.com` | `password123` |
| **Warehouse** | `amit.s@apexfmcg.com` | `password123` |
| **Sales Staff** | `priya.p@apexfmcg.com` | `password123` |
| **Collection Staff** | `sneha.j@apexfmcg.com` | `password123` |
| **Manager** | `vikram.s@apexfmcg.com` | `password123` |

---

## Key Features
- **Currency**: Standardized to Indian Rupee (INR ₹) across all database models, seed data, and UI views.
- **FEFO Inventory**: Real-time batch tracking, near-expiry alerts, promotional markdown clearance, write-offs, and return-to-supplier (RTS).
- **POS Billing & Invoices**: Fast retail invoicing with automatic FEFO batch selection and customer credit ledger tracking.
- **Payment Collections**: Route collection recording with receipt generation and automatic reduction of overdue balances.
- **Audit Governance**: Immutable action logging for critical operations and elevated permissions.
