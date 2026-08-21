# FMCG Distro — Project Context

## Project
**FMCG Distro** — AI-Powered Enterprise FMCG Distribution Management System

## Purpose
Multi-tenant SaaS platform for FMCG distributors to manage warehouse inventory (FEFO), sales/POS billing, purchase inward with AI invoice OCR, customer receivables & collections, staff RBAC, audit trail, and AI-driven supply chain optimization.

## Target Users
FMCG distribution business owners, warehouse managers, sales staff, collection agents, and platform administrators.

## Core Modules
Dashboard, Sales/POS, Purchase/Inward, Inventory/FEFO/Batches, Customers, Suppliers, Collections, Reports, AI Center (Chat + Optimizer + Invoice Scanner), Staff & Roles, Audit Logs, Settings, Platform Admin.

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS 4 + Lucide Icons + Motion
- **Backend**: Node.js + Express + TypeScript + SQLite (better-sqlite3) + Zod + JWT (jsonwebtoken) + bcryptjs
- **AI**: Google Gemini API (@google/genai)

## Architecture
Layered: Routes → Controllers → Services → Repositories → SQLite Database.

## Authentication
JWT access tokens. Password hashing via bcryptjs. Login returns token + user profile.

## Authorization
7 roles: Owner, Admin, Manager, Warehouse, Sales Staff, Collection Staff, Viewer. Module-level + action-level RBAC. Elevated action confirmation workflow.

## Multi-Tenancy
All entities scoped by `tenantId`. Tenant isolation enforced at repository layer. TenantId derived from authenticated JWT — never from client payload.

## Status
Phase: Backend Implementation — Starting from scratch.
