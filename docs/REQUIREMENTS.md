# Requirements

## REQ-001
**Description**: Users can register (signup) a new business tenant and log in.
**Priority**: High
**Backend Impact**: Auth APIs (POST /auth/login, POST /auth/signup), User model, Tenant model, JWT issuance.
**Status**: Pending

## REQ-002
**Description**: Password reset flow via email.
**Priority**: Medium
**Backend Impact**: POST /auth/forgot-password endpoint. Placeholder (no real email).
**Status**: Pending

## REQ-003
**Description**: Role-based access control with 7 roles: Owner, Admin, Manager, Warehouse, Sales Staff, Collection Staff, Viewer.
**Priority**: High
**Backend Impact**: RBAC middleware, module-level permission checks, role definitions.
**Status**: Pending

## REQ-004
**Description**: Staff management — invite, update, suspend, reactivate, deactivate, change role.
**Priority**: High
**Backend Impact**: Staff CRUD APIs, invitation workflow, status transitions, audit logging.
**Status**: Pending

## REQ-005
**Description**: Product catalog CRUD with SKU, pricing (purchase/selling/MRP), GST, category, thresholds.
**Priority**: High
**Backend Impact**: Product model & CRUD APIs.
**Status**: Pending

## REQ-006
**Description**: Batch & expiry tracking with FEFO (First Expiry First Out) logic.
**Priority**: High
**Backend Impact**: Batch model, expiry discount, return-to-supplier, write-off APIs.
**Status**: Pending

## REQ-007
**Description**: Inventory management — stock adjustments, damage logging, stock movements ledger.
**Priority**: High
**Backend Impact**: StockMovement model, adjustment API, movement history query.
**Status**: Pending

## REQ-008
**Description**: Sales/POS — create sale invoices, deduct stock per FEFO, update customer outstanding.
**Priority**: High
**Backend Impact**: Sale transaction model, invoice number generation, stock deduction service.
**Status**: Pending

## REQ-009
**Description**: Purchase management — create POs, add stock on confirmation, create batches.
**Priority**: High
**Backend Impact**: Purchase transaction model, batch creation, stock addition.
**Status**: Pending

## REQ-010
**Description**: AI Invoice Scanner — OCR extraction of supplier invoices, SKU matching, manual resolution, confirmation to inventory.
**Priority**: High
**Backend Impact**: Gemini API integration for OCR, extracted invoice model, matching service.
**Status**: Pending

## REQ-011
**Description**: Customer management with credit limits, outstanding/overdue tracking, zone classification.
**Priority**: High
**Backend Impact**: Customer model & CRUD, balance updates on sale/collection.
**Status**: Pending

## REQ-012
**Description**: Supplier management with contact, GSTIN, payable balance, rating.
**Priority**: Medium
**Backend Impact**: Supplier model & CRUD.
**Status**: Pending

## REQ-013
**Description**: Payment collections — record payments against customer outstanding, issue receipt numbers.
**Priority**: High
**Backend Impact**: Collection model, customer balance reduction, receipt generation.
**Status**: Pending

## REQ-014
**Description**: Audit trail — immutable log of all significant actions with actor, timestamp, entity, old/new values.
**Priority**: High
**Backend Impact**: AuditLog model, automatic logging from services.
**Status**: Pending

## REQ-015
**Description**: Executive dashboard — KPIs (revenue, stock value, receivables, sales counts).
**Priority**: Medium
**Backend Impact**: Aggregation queries, dashboard API.
**Status**: Pending

## REQ-016
**Description**: AI Assistant chat — natural language queries about business data with structured responses.
**Priority**: Medium
**Backend Impact**: Gemini API integration, context-aware prompting with live data.
**Status**: Pending

## REQ-017
**Description**: Reports — sales summaries, inventory reports, collection reports.
**Priority**: Medium
**Backend Impact**: Report aggregation APIs.
**Status**: Pending

## REQ-018
**Description**: Tenant/organization settings — update business profile, AI thresholds.
**Priority**: Low
**Backend Impact**: Tenant update API.
**Status**: Pending

## REQ-019
**Description**: Permission matrix — configurable module-level permissions per role.
**Priority**: Medium
**Backend Impact**: Permission matrix model, CRUD API.
**Status**: Pending

## REQ-020
**Description**: Elevated action confirmation — dangerous operations require explicit confirmation with audit trail.
**Priority**: Medium
**Backend Impact**: Server-side audit logging of elevated actions (handled via existing audit service).
**Status**: Pending
