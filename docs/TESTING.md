# Testing Strategy

## Unit Tests
- AuthService: password hashing, JWT generation, token verification
- InventoryService: stock adjustment logic, FEFO deduction, write-off, expiry discount
- SalesService: invoice generation, stock deduction, customer balance update
- PurchaseService: stock addition, batch creation

## Integration Tests
- Auth API: POST /auth/login, POST /auth/signup
- Product CRUD API: GET, POST, PUT, DELETE
- Sales API: POST /sales, GET /sales
- Inventory API: POST /inventory/adjust
- Collections API: POST /collections
- RBAC: verify role-restricted endpoints return 403 for unauthorized roles

## Auth & Security Tests
- Invalid token returns 401
- Expired token returns 401
- Missing token returns 401
- Cross-tenant access returns 404 (data not found)

## Tools
- Test runner: Vitest (fast, TS-native)
- HTTP testing: Supertest
- Assertions: Vitest built-in expect
