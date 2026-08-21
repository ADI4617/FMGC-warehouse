# Business Rules

## BR-001
Only authenticated users can access any protected API endpoint.

## BR-002
All data entities are scoped by tenantId. A user can only access data belonging to their own tenant.

## BR-003
Owner and Admin roles have full access to all modules. Other roles have restricted access per the permission matrix.

## BR-004
Suspended or deactivated users cannot log in.

## BR-005
Stock adjustments must record a reason and create a stock movement entry.

## BR-006
Sales deduct stock using FEFO (First Expiry, First Out) priority — batches closest to expiry are sold first.

## BR-007
Credit sales increase the customer's outstanding balance.

## BR-008
Payment collections reduce the customer's outstanding and overdue balances.

## BR-009
Purchase confirmation adds stock to product quantities and creates batch entries.

## BR-010
AI Invoice Scanner extracted items must be confirmed before they affect inventory.

## BR-011
Expiry discount can only be applied to batches within the FEFO critical horizon.

## BR-012
Batch write-off moves quantity from sellable stock to damaged count.

## BR-013
Return-to-supplier removes batch from inventory and creates a stock movement.

## BR-014
All significant state changes must be recorded in the audit log with actor, timestamp, entity, action, and values.

## BR-015
Invoice numbers are auto-generated sequentially (TRX-XXXX for sales, PO-YYYY-XXX for purchases, RCP-XXXX for collections).

## BR-016
Customers have credit limits. Frontend may warn but backend does not hard-block sales exceeding credit limit (ASSUMPTION — no explicit PRD rule found).

## BR-017
Only Owner/Admin can manage staff (invite, suspend, deactivate, change roles).

## BR-018
Product deletion is a hard delete. No soft-delete specified in PRD. (ASSUMPTION)

## BR-019
Elevated actions (dangerous operations) are audit-logged with elevated action type and confirmation timestamp.
