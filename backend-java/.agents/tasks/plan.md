# FMGC Warehouse — Java 21 Spring Boot 3.x Backend Implementation Plan

## Source of Truth
All domain models, business logic, and API behaviour are derived from:
- `_backup_checkpoint/src/types/index.ts` — TypeScript interfaces (authoritative shape for every entity)
- `_backup_checkpoint/src/context/AppContext.tsx` — All business logic, transactions, numbering schemes, FEFO rules
- `_backup_checkpoint/src/data/initialData.ts` — Seed dataset for `data.sql`

The frontend is a pure React SPA that currently runs in-memory (localStorage). The Java backend will replace that in-memory store with a real REST API + SQLite database that this frontend (and any future frontend) can consume over HTTP on port 3001.

---

## 1. Directory Structure to Create

```
backend-java/
├── pom.xml
├── Dockerfile
├── .dockerignore
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── fmgc/
        │           └── warehouse/
        │               ├── FmgcWarehouseApplication.java          # Spring Boot entry point
        │               ├── config/
        │               │   ├── SecurityConfig.java                # Spring Security — JWT + RBAC
        │               │   ├── JwtConfig.java                     # JWT secret, expiry properties
        │               │   └── CorsConfig.java                    # Allow localhost:3000 + Vite dev
        │               ├── security/
        │               │   ├── JwtUtil.java                       # generate / validate tokens
        │               │   ├── JwtAuthFilter.java                 # OncePerRequestFilter
        │               │   └── UserDetailsServiceImpl.java        # loads User from DB
        │               ├── model/
        │               │   ├── BusinessTenant.java
        │               │   ├── User.java
        │               │   ├── RoleDefinition.java
        │               │   ├── RolePermissionRule.java
        │               │   ├── Product.java
        │               │   ├── Batch.java
        │               │   ├── Customer.java
        │               │   ├── Supplier.java
        │               │   ├── StockMovement.java
        │               │   ├── SaleTransaction.java
        │               │   ├── SaleItem.java                      # @Embedded list stored as JSON TEXT
        │               │   ├── PurchaseTransaction.java
        │               │   ├── PurchaseItem.java                  # @Embedded list stored as JSON TEXT
        │               │   ├── PaymentCollection.java
        │               │   ├── AuditLog.java
        │               │   ├── PredictiveInsight.java
        │               │   └── ExtractedInvoiceData.java          # items stored as JSON TEXT
        │               ├── repository/
        │               │   ├── TenantRepository.java
        │               │   ├── UserRepository.java
        │               │   ├── ProductRepository.java
        │               │   ├── BatchRepository.java
        │               │   ├── CustomerRepository.java
        │               │   ├── SupplierRepository.java
        │               │   ├── StockMovementRepository.java
        │               │   ├── SaleTransactionRepository.java
        │               │   ├── PurchaseTransactionRepository.java
        │               │   ├── PaymentCollectionRepository.java
        │               │   └── AuditLogRepository.java
        │               ├── service/
        │               │   ├── AuthService.java                   # login, signup, JWT issuance
        │               │   ├── TenantService.java
        │               │   ├── UserService.java                   # staff CRUD + role change
        │               │   ├── ProductService.java
        │               │   ├── BatchService.java                  # FEFO logic lives here
        │               │   ├── InventoryService.java              # stock adjustment, write-off, RTS
        │               │   ├── SaleService.java                   # createSale + FEFO batch deduction
        │               │   ├── PurchaseService.java               # createPurchase + inbound batch creation
        │               │   ├── CollectionService.java             # recordPayment + outstanding reduction
        │               │   ├── AuditService.java                  # addAuditLog helper (used by all services)
        │               │   └── DashboardService.java             # aggregate KPI queries
        │               ├── controller/
        │               │   ├── AuthController.java                # POST /api/v1/auth/login, /signup
        │               │   ├── TenantController.java              # GET/PUT /api/v1/tenant
        │               │   ├── UserController.java                # CRUD /api/v1/users
        │               │   ├── ProductController.java             # CRUD /api/v1/products
        │               │   ├── BatchController.java               # CRUD /api/v1/batches
        │               │   ├── InventoryController.java           # POST /api/v1/inventory/adjust, /write-off, /rts, /discount
        │               │   ├── SaleController.java                # CRUD /api/v1/sales
        │               │   ├── PurchaseController.java            # CRUD /api/v1/purchases
        │               │   ├── CollectionController.java          # CRUD /api/v1/collections
        │               │   ├── AuditLogController.java            # GET /api/v1/audit-logs
        │               │   ├── DashboardController.java           # GET /api/v1/dashboard
        │               │   └── HealthController.java              # GET /api/v1/health
        │               └── dto/
        │                   ├── LoginRequest.java
        │                   ├── LoginResponse.java
        │                   ├── SignupRequest.java
        │                   ├── ApiResponse.java                   # generic wrapper { data, message, success }
        │                   ├── StockAdjustmentRequest.java
        │                   ├── CreateSaleRequest.java
        │                   ├── CreatePurchaseRequest.java
        │                   └── RecordPaymentRequest.java
        └── resources/
            ├── application.properties
            ├── schema.sql                                         # DDL — runs on startup
            └── data.sql                                          # DML seed — runs after schema.sql
```

Total Java source files: ~62 (16 models + 11 repos + 11 services + 12 controllers + 8 DTOs + 4 config/security).

---

## 2. File Creation Order

### Step 1 — `pom.xml`
Root Maven POM for `com.fmgc:warehouse-backend:1.0.0`. Java 21, Spring Boot 3.3.x parent.

Dependencies to declare:
- `spring-boot-starter-web` — REST API
- `spring-boot-starter-data-jpa` — JPA/Hibernate
- `spring-boot-starter-security` — JWT authentication
- `spring-boot-starter-validation` — Bean Validation (`@Valid`)
- `spring-boot-starter-test` — JUnit 5 + Mockito
- `io.jsonwebtoken:jjwt-api:0.12.6` + `jjwt-impl` + `jjwt-jackson` — JWT library
- `org.xerial:sqlite-jdbc:3.46.0.0` — SQLite JDBC driver
- `com.github.gwenn:sqlite-dialect:0.1.4` — Hibernate dialect for SQLite
  (Decision: SQLite over H2/PostgreSQL because the existing app is SQLite-based per the README, and the task targets a lightweight single-file DB matching the Node.js backend's `node:sqlite` store.)
- `com.fasterxml.jackson.core:jackson-databind` — already transitive but needed explicitly for JSON TEXT deserialization
- `org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0` — Swagger UI at `/swagger-ui.html`

Build plugin: `spring-boot-maven-plugin` with `mainClass` set to `com.fmgc.warehouse.FmgcWarehouseApplication`.

### Step 2 — `src/main/resources/application.properties`

```properties
spring.application.name=fmgc-warehouse-backend
server.port=3001

# SQLite datasource
spring.datasource.url=jdbc:sqlite:./fmgc_warehouse.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=none

# Always run schema + seed on startup
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql
spring.jpa.defer-datasource-initialization=true

# JWT
jwt.secret=change-this-secret-in-production-minimum-256-bits-long
jwt.expiration-ms=86400000

# Logging
logging.level.com.fmgc=DEBUG
logging.level.org.springframework.security=WARN
```

### Step 3 — `src/main/resources/schema.sql`

Create all tables with `CREATE TABLE IF NOT EXISTS`. Table names map directly to entity names:

| Table | Key columns |
|---|---|
| `business_tenants` | id VARCHAR PK, name, legal_entity, gstin, email, phone, address, city, state, currency, plan, status, created_date, total_skus_count, monthly_revenue_estimate |
| `users` | id VARCHAR PK, name, email (UNIQUE), phone, role, department, avatar, status, last_active, date_joined, permissions TEXT (JSON array), tenant_id FK, access_modules TEXT (JSON array), password_hash |
| `role_definitions` | id VARCHAR PK, title, tagline, description, user_count, is_elevated, badge_color, allowed_modules TEXT (JSON array) |
| `role_permission_rules` | id BIGINT PK AUTOINCREMENT, module_id VARCHAR UNIQUE, module_name, category, can_view, can_create, can_edit, can_delete, can_approve |
| `products` | id VARCHAR PK, sku (UNIQUE), name, category, brand, unit, purchase_price, selling_price, mrp, in_stock, damaged, min_threshold, hsn_code, gst_rate, status, ai_predicted_shortage, notes |
| `batches` | id VARCHAR PK, product_id FK→products, sku, product_name, batch_number, quantity, purchase_price, expiry_date DATE, days_to_expiry, mfg_date DATE, is_fefo_priority, status |
| `customers` | id VARCHAR PK, code (UNIQUE), name, store_name, contact_person, phone, email, address, zone, credit_limit, outstanding_balance, overdue_amount, payment_terms_days, status, last_order_date |
| `suppliers` | id VARCHAR PK, code (UNIQUE), name, contact_person, phone, email, gstin, address, payable_balance, total_purchases, rating, lead_time_days |
| `stock_movements` | id VARCHAR PK, timestamp DATETIME, time_formatted, type, sku, product_name, quantity, reference_no, note, actor |
| `sale_transactions` | id VARCHAR PK, invoice_number (UNIQUE), customer_id FK→customers, customer_name, store_name, date DATE, time VARCHAR, items TEXT (JSON), subtotal, discount_amount, tax_amount, total_amount, amount_paid, balance_due, payment_method, payment_status, created_by |
| `purchase_transactions` | id VARCHAR PK, invoice_number (UNIQUE), supplier_id FK→suppliers, supplier_name, date DATE, items TEXT (JSON), total_amount, payment_status, is_ai_scanned, status, document_url |
| `payment_collections` | id VARCHAR PK, receipt_number (UNIQUE), customer_id FK→customers, customer_name, invoice_number, amount, payment_method, date DATE, time VARCHAR, recorded_by, notes |
| `audit_logs` | id VARCHAR PK, timestamp DATETIME, actor, actor_role, action, entity, entity_id, previous_value TEXT, new_value TEXT, reason, ip_address |
| `predictive_insights` | id VARCHAR PK, type, title, description, sku, action_label, action_payload TEXT (JSON), severity, timestamp |

### Step 4 — `src/main/resources/data.sql`

Seed all tables with the exact rows from `_backup_checkpoint/src/data/initialData.ts`. Use `INSERT OR IGNORE INTO` so re-runs are idempotent. Rows to include:
- 1 tenant (`tnt-001`)
- 12 users (all from `INITIAL_USERS`). Password hash: bcrypt of `password123` for every user (pre-computed hash stored in the SQL literal so no runtime generation is needed at seed time).
- 7 role definitions
- 18 permission matrix rows
- 12 products
- 6 batches
- 5 customers
- 4 suppliers
- 5 stock movements
- 2 sale transactions (with items serialized as JSON strings)
- 2 purchase transactions (with items serialized as JSON strings)
- 1 collection
- 4 audit log entries
- 2 predictive insights

### Step 5 — Main application class

`FmgcWarehouseApplication.java` — annotated with `@SpringBootApplication`. No special code needed; rely on Spring Boot auto-configuration.

### Step 6 — Config classes (3 files)

**`CorsConfig.java`** — `@Configuration` + `WebMvcConfigurer`. Allow `http://localhost:3000` and `http://localhost:5173` origins, all methods, all headers, allow credentials.

**`JwtConfig.java`** — `@Configuration` + `@ConfigurationProperties(prefix="jwt")`. Fields: `secret` (String), `expirationMs` (long). Exposes `@Bean SecretKey signingKey()` derived from the secret string.

**`SecurityConfig.java`** — `@Configuration` + `@EnableWebSecurity`. Configures:
- `stateless` session (JWT-only)
- Permit `/api/v1/auth/**`, `/api/v1/health`, `/swagger-ui/**`, `/v3/api-docs/**` without auth
- All other endpoints require `AUTHENTICATED`
- Registers `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`
- `BCryptPasswordEncoder` bean

### Step 7 — Security classes (3 files)

**`JwtUtil.java`** — Generates and validates JWT tokens using `jjwt`. `generateToken(String userId, String email, String role)` → compact JWT. `validateToken(String token)` → boolean. `extractUserId/Email/Role(String token)`.

**`JwtAuthFilter.java`** — `OncePerRequestFilter`. Reads `Authorization: Bearer <token>`, calls `JwtUtil.validateToken`, builds `UsernamePasswordAuthenticationToken`, sets in `SecurityContextHolder`.

**`UserDetailsServiceImpl.java`** — Implements `UserDetailsService`. Loads `User` by email from `UserRepository`. Maps `role` string to a single `GrantedAuthority` (`ROLE_ADMIN`, `ROLE_OWNER`, etc.).

### Step 8 — Model classes (16 files)

Map every TypeScript interface in `types/index.ts` to a JPA `@Entity`. Key mapping decisions:

- **`SaleTransaction`** — `items` field is `List<SaleItem>`. Because SQLite has no array/JSONB column type, store items as a `TEXT` column containing a Jackson-serialized JSON array. Use `@Convert(converter = SaleItemListConverter.class)` (a custom `AttributeConverter<List<SaleItem>, String>`). Same pattern for `PurchaseTransaction.items` and `ExtractedInvoiceData.items`.
- **`User`** — Add `passwordHash` field (`@Column(name="password_hash")`). The `permissions` and `accessModules` string-list fields use a `StringListConverter` (`AttributeConverter<List<String>, String>`).
- **`AuditLog`** — `previousValue` and `newValue` map to `TEXT` columns; no length limit constraint.
- All entity IDs are `VARCHAR` (not auto-incremented `BIGINT`) because the existing seed data uses string IDs (`prod-1`, `cust-001`, etc.).
- `RolePermissionRule` is the exception: it has a `Long id` with `@GeneratedValue(strategy = GenerationType.IDENTITY)` since the TypeScript model has no explicit string ID.

### Step 9 — Repository interfaces (11 files)

Each extends `JpaRepository<T, String>` (or `Long` for `RolePermissionRule`). Add finder methods as needed:

| Repository | Custom finders |
|---|---|
| `UserRepository` | `findByEmail(String email)`, `findByTenantId(String tenantId)` |
| `ProductRepository` | `findBySku(String sku)`, `findByStatus(String status)` |
| `BatchRepository` | `findByProductIdOrderByExpiryDateAsc(String productId)` (FEFO order), `findByStatus(String status)` |
| `SaleTransactionRepository` | `findByCustomerId(String customerId)`, `findByDateBetween(LocalDate from, LocalDate to)` |
| `PurchaseTransactionRepository` | `findBySupplierId(String supplierId)` |
| `PaymentCollectionRepository` | `findByCustomerId(String customerId)` |
| `AuditLogRepository` | `findAllByOrderByTimestampDesc(Pageable pageable)` |
| `StockMovementRepository` | `findAllByOrderByTimestampDesc(Pageable pageable)` |

### Step 10 — Service classes (11 files)

#### `AuditService.java`
Helper used by every other service. Single method:
```
void log(String action, String entity, String entityId, String newValue, String previousValue, String reason)
```
Reads the current authenticated user from `SecurityContextHolder`, builds an `AuditLog`, and saves it. This is the Java equivalent of `addAuditLog` in AppContext.

#### `AuthService.java`
- `login(email, password)` → validates password with `BCryptPasswordEncoder`, generates JWT, returns `LoginResponse { token, user }`
- `signup(SignupRequest)` → creates new `BusinessTenant` + Owner `User`, encodes password, returns JWT
- `forgotPassword(email)` → no-op stub returning success (matching the frontend's behaviour)

#### `UserService.java`
- `addStaffMember(...)` → creates User with `status=pending`, derives `accessModules` from role (same logic as AppContext lines 492–505), calls `AuditService.log("INVITATION_SENT", ...)`
- `updateStaffMember(id, updates)`
- `changeStaffRole(id, newRole, reason)` → calls `AuditService.log("ROLE_CHANGED", ...)`
- `suspendStaffMember(id, reason)` → sets `status=suspended`
- `reactivateStaffMember(id)` → sets `status=active`
- `deactivateStaffMember(id, reason)` → sets `status=deactivated`

#### `ProductService.java`
Standard CRUD. `deleteProduct` calls `AuditService.log("DELETE_PRODUCT", ...)`.

#### `BatchService.java`
- `getBatchesForProductFefoOrder(productId)` → delegates to `BatchRepository.findByProductIdOrderByExpiryDateAsc`. Used by SaleService to decide which batch to deduct from first.
- `applyExpiryDiscount(batchId, discountPercent)` → updates the associated product's `sellingPrice`, adds audit log `APPLY_EXPIRY_DISCOUNT`.
- `returnBatchToSupplier(batchId)` → deletes batch, reduces `product.inStock`, creates `StockMovement(type=Return)`, audit log `RETURN_TO_SUPPLIER`.
- `writeOffBatch(batchId)` → deletes batch, reduces `product.inStock`, increments `product.damaged`, creates `StockMovement(type=Damage)`, audit log `WRITE_OFF_BATCH`.

#### `InventoryService.java`
- `recordStockAdjustment(productId, batchNumber, quantityDelta, reason, isDamage)` → same logic as AppContext `recordStockAdjustment`. Updates `product.inStock` / `product.damaged`, recalculates `product.status` (Healthy/Low/Out of Stock based on `minThreshold`), creates `StockMovement`.

#### `SaleService.java` (**FEFO deduction**)
- `createSale(CreateSaleRequest)` →
  1. Generate invoice number: query `MAX(invoice_number)` from `sale_transactions` where format is `TRX-NNNN`, parse numeric suffix, increment by 1. Start at `TRX-9825` if table is empty. (Matches AppContext pattern: `TRX-${9825 + sales.length}`.)
  2. For each line item: call `BatchService.getBatchesForProductFefoOrder(productId)` to get batches sorted by earliest expiry. Deduct quantity from the first batch first (FEFO). If a batch is exhausted, continue to the next. Update `batch.quantity` and `product.inStock`.
  3. If `balanceDue > 0`, increment `customer.outstandingBalance`.
  4. Save `SaleTransaction` with items serialized to JSON TEXT.
  5. For each item, insert a `StockMovement(type=Sale)`.
  6. Audit log `CREATE_SALE`.
  - Use `@Transactional` — all operations in a single DB transaction; any failure rolls back everything.

#### `PurchaseService.java`
- `createPurchase(CreatePurchaseRequest)` →
  1. Generate PO number: `PO-2026-NNN` (query max, increment). Start at `PO-2026-882` if empty.
  2. For each item: increment `product.inStock` by `quantity + freeQuantity`. Recalculate `product.status`.
  3. Create a `Batch` row for each purchase item (batchNumber, expiryDate from request).
  4. Create `StockMovement(type=Purchase)` per item.
  5. Save `PurchaseTransaction` with items as JSON TEXT.
  6. Audit log `CREATE_PURCHASE`.
  - `@Transactional`.

#### `CollectionService.java`
- `recordCollectionPayment(RecordPaymentRequest)` →
  1. Generate receipt number: `RCP-NNNN` (query max, increment from `RCP-1093`).
  2. Reduce `customer.outstandingBalance` and `customer.overdueAmount` by `amount` (floor to 0).
  3. Save `PaymentCollection`.
  4. Audit log `RECORD_PAYMENT`.
  - `@Transactional`.

#### `TenantService.java`
Standard get/update. `updateTenant` calls audit log `TENANT_UPDATED`.

#### `DashboardService.java`
Returns aggregate KPIs used by the frontend dashboard:
- Total active products count
- Products with `status=Low` or `Out of Stock`
- Total outstanding balance across all customers
- Total overdue balance
- Recent stock movements (last 10)
- Predictive insights list
No `@Transactional` needed — read-only queries.

### Step 11 — Controller classes (12 files)

All controllers use `@RestController` + `@RequestMapping("/api/v1/...")` and return `ResponseEntity<ApiResponse<T>>`.

| Controller | Endpoints |
|---|---|
| `HealthController` | `GET /api/v1/health` → `{ status: "ok", timestamp }` |
| `AuthController` | `POST /api/v1/auth/login`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/forgot-password` |
| `TenantController` | `GET /api/v1/tenant`, `PUT /api/v1/tenant` |
| `UserController` | `GET /api/v1/users`, `GET /api/v1/users/{id}`, `POST /api/v1/users`, `PUT /api/v1/users/{id}`, `PATCH /api/v1/users/{id}/role`, `PATCH /api/v1/users/{id}/suspend`, `PATCH /api/v1/users/{id}/reactivate`, `PATCH /api/v1/users/{id}/deactivate`, `POST /api/v1/users/{id}/resend-invitation` |
| `ProductController` | `GET /api/v1/products`, `GET /api/v1/products/{id}`, `POST /api/v1/products`, `PUT /api/v1/products/{id}`, `DELETE /api/v1/products/{id}` |
| `BatchController` | `GET /api/v1/batches`, `GET /api/v1/batches/{id}`, `GET /api/v1/batches/product/{productId}`, `POST /api/v1/batches` |
| `InventoryController` | `POST /api/v1/inventory/adjust`, `POST /api/v1/inventory/write-off/{batchId}`, `POST /api/v1/inventory/rts/{batchId}`, `POST /api/v1/inventory/discount/{batchId}` |
| `SaleController` | `GET /api/v1/sales`, `GET /api/v1/sales/{id}`, `POST /api/v1/sales` |
| `PurchaseController` | `GET /api/v1/purchases`, `GET /api/v1/purchases/{id}`, `POST /api/v1/purchases` |
| `CollectionController` | `GET /api/v1/collections`, `GET /api/v1/collections/{id}`, `POST /api/v1/collections` |
| `AuditLogController` | `GET /api/v1/audit-logs` (paginated: `?page=0&size=50`) |
| `DashboardController` | `GET /api/v1/dashboard` |

All mutating endpoints validate input with `@Valid` on the request body.

### Step 12 — DTO classes (8 files)

- **`ApiResponse<T>`** — `{ boolean success, String message, T data, LocalDateTime timestamp }`
- **`LoginRequest`** — `email`, `password`
- **`LoginResponse`** — `token` (JWT string), `user` (User entity, minus `passwordHash`)
- **`SignupRequest`** — `fullName`, `businessName`, `email`, `phone`, `password`, `plan`
- **`StockAdjustmentRequest`** — `productId`, `batchNumber`, `quantityDelta`, `reason`, `isDamage`
- **`CreateSaleRequest`** — mirrors `SaleTransaction` minus `id`, `invoiceNumber`, `time`
- **`CreatePurchaseRequest`** — mirrors `PurchaseTransaction` minus `id`, `invoiceNumber`
- **`RecordPaymentRequest`** — `customerId`, `amount`, `paymentMethod`, `notes`

### Step 13 — `Dockerfile` and `.dockerignore`

**`Dockerfile`** (multi-stage):
```dockerfile
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN ./mvnw package -DskipTests   # requires mvnw wrapper — add wrapper generation to plan step

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 3001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**`.dockerignore`**:
```
target/
*.db
.git/
.agents/
```

Include Maven wrapper (`mvnw`, `.mvn/wrapper/`) in the project so the Dockerfile can run `./mvnw` without a host Maven installation. Generate with `mvn wrapper:wrapper` or include the wrapper JAR.

---

## 3. Cross-Cutting Concerns

### 3.1 JSON Deserialization of `items` TEXT Columns

`SaleTransaction.items`, `PurchaseTransaction.items`, and `ExtractedInvoiceData.items` are stored as serialized JSON strings in `TEXT` columns (SQLite has no array column type). The mechanism:

1. Create a `JsonAttributeConverter<T>` generic base class that accepts a `TypeReference<T>`:
   ```java
   public abstract class JsonAttributeConverter<T> implements AttributeConverter<T, String> {
       private final ObjectMapper objectMapper = new ObjectMapper();
       private final TypeReference<T> typeRef;
       protected JsonAttributeConverter(TypeReference<T> typeRef) { this.typeRef = typeRef; }
       @Override public String convertToDatabaseColumn(T attribute) { ... }
       @Override public T convertToEntityAttribute(String dbData) { ... }
   }
   ```
2. Create concrete converters:
   - `SaleItemListConverter extends JsonAttributeConverter<List<SaleItem>>`
   - `PurchaseItemListConverter extends JsonAttributeConverter<List<PurchaseItem>>`
   - `StringListConverter extends JsonAttributeConverter<List<String>>`
   - `ExtractedItemListConverter extends JsonAttributeConverter<List<ExtractedInvoiceItem>>`
3. Annotate the fields: `@Convert(converter = SaleItemListConverter.class)`.
4. Place converters in a `com.fmgc.warehouse.model.converter` sub-package.

### 3.2 FEFO (First-Expiry, First-Out) Logic

- **Rule**: when deducting stock for a sale, always consume the batch with the earliest `expiryDate` first.
- **Implementation**: `BatchRepository.findByProductIdOrderByExpiryDateAsc(productId)` returns batches in FEFO order. `SaleService.createSale` iterates that list, deducting from each batch until the line-item quantity is satisfied. This mirrors the frontend's `isFefoPriority` flag but enforces it systematically server-side.
- **Near-expiry threshold**: a batch is `near_expiry` if `expiryDate` is within 30 days of today. Compute `daysToExpiry` on read in the service layer (`ChronoUnit.DAYS.between(LocalDate.now(), batch.getExpiryDate())`). Do NOT store a stale `daysToExpiry` that becomes wrong after the seed day; recompute it dynamically in `BatchService.getBatchesForProductFefoOrder`.
- **Status recalculation**: after every stock change, set `product.status` to:
  - `Out of Stock` if `inStock == 0`
  - `Low` if `0 < inStock <= minThreshold`
  - `Healthy` otherwise

### 3.3 Invoice / Receipt Numbering

| Document | Prefix | Seed Start | Generation Query |
|---|---|---|---|
| Sale Invoice | `TRX-` | `TRX-9825` | `SELECT MAX(CAST(SUBSTR(invoice_number,5) AS INTEGER)) FROM sale_transactions` |
| Purchase Order | `PO-2026-` | `PO-2026-882` | `SELECT MAX(CAST(SUBSTR(invoice_number,9) AS INTEGER)) FROM purchase_transactions` |
| Payment Receipt | `RCP-` | `RCP-1093` | `SELECT MAX(CAST(SUBSTR(receipt_number,5) AS INTEGER)) FROM payment_collections` |
| Customer Code | `CUST-` | `CUST-006` (after 5 seeds) | `SELECT COUNT(*) + 1 FROM customers` padded to 3 digits |
| Supplier Code | `SUP-` | auto | `SELECT COUNT(*) + 1 FROM suppliers` |

All numbering is done inside `@Transactional` service methods using a `@Lock(LockModeType.PESSIMISTIC_WRITE)` query or a serialized sequence to avoid gaps under concurrent writes.

### 3.4 Transaction Handling

- All state-mutating service methods (`createSale`, `createPurchase`, `recordCollectionPayment`, `recordStockAdjustment`, `writeOffBatch`, `returnBatchToSupplier`) are annotated `@Transactional`. Rationale: each operation touches 3–5 tables atomically (product, batch, stock_movement, sale_transaction, customer).
- `AuditService.log` is `@Transactional(propagation = Propagation.REQUIRES_NEW)` so audit entries are persisted even if the outer transaction rolls back (matches the audit governance requirement: "immutable action logging").
- Read-only service methods (all `getAll`, `getById`) use `@Transactional(readOnly = true)` for Hibernate performance hints.

### 3.5 Security / RBAC

- The TypeScript frontend uses role names as plain strings (`Admin`, `Owner`, `Warehouse`, etc.). Map these to Spring Security authorities using the prefix `ROLE_` + uppercase: `ROLE_ADMIN`, `ROLE_OWNER`, `ROLE_WAREHOUSE`, `ROLE_SALES_STAFF`, `ROLE_COLLECTION_STAFF`, `ROLE_MANAGER`, `ROLE_VIEWER`.
- Protect write endpoints with `@PreAuthorize`:
  - Delete product, delete user: `ROLE_ADMIN` or `ROLE_OWNER` only
  - Create sale: `ROLE_SALES_STAFF`, `ROLE_ADMIN`, `ROLE_OWNER`, `ROLE_MANAGER`
  - Create purchase: `ROLE_WAREHOUSE`, `ROLE_ADMIN`, `ROLE_OWNER`
  - Record collection: `ROLE_COLLECTION_STAFF`, `ROLE_ADMIN`, `ROLE_OWNER`
- Enable `@EnableMethodSecurity` on `SecurityConfig`.

### 3.6 Password Hashing

Seed data has `password123` for all users. Pre-compute the bcrypt hash once (use `BCryptPasswordEncoder().encode("password123")`) and embed as a literal in `data.sql`. This avoids a startup seed loop and means `data.sql` is purely static SQL.

Pre-computed bcrypt hash of `password123` (cost 10):
`$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.`
(This is the well-known bcrypt test vector — safe to use in dev seed data.)

---

## 4. Verification Steps

### 4.1 Compile and package (no tests)
```bash
cd backend-java
mvn package -DskipTests
```
Expected: `BUILD SUCCESS`, JAR created at `target/warehouse-backend-1.0.0.jar`.

### 4.2 Run the application
```bash
java -jar target/warehouse-backend-1.0.0.jar
```
Expected: Spring Boot starts on port 3001, log line `Tomcat started on port 3001`, SQLite DB file `fmgc_warehouse.db` created, schema applied, seed data inserted.

### 4.3 Health check
```bash
curl http://localhost:3001/api/v1/health
```
Expected response: `{"success":true,"data":{"status":"ok"}}`

### 4.4 Login with seed credentials
```bash
curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh.k@apexfmcg.com","password":"password123"}'
```
Expected: `{"success":true,"data":{"token":"<JWT>","user":{...}}}` with role `Admin`.

### 4.5 Authenticated endpoint
```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh.k@apexfmcg.com","password":"password123"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer $TOKEN"
```
Expected: JSON array of 12 products.

### 4.6 FEFO sale test
```bash
curl -s -X POST http://localhost:3001/api/v1/sales \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust-1",
    "customerName": "City Retailers",
    "storeName": "City Supermarket",
    "date": "2026-08-21",
    "items": [{"productId":"prod-5","sku":"DAI-YOG-01","name":"Greek Yogurt Plain 1kg","quantity":10,"unitPrice":3.00,"totalAmount":30.00}],
    "subtotal": 30.00,
    "discountAmount": 0,
    "taxAmount": 0,
    "totalAmount": 30.00,
    "amountPaid": 30.00,
    "balanceDue": 0,
    "paymentMethod": "Cash",
    "paymentStatus": "Paid",
    "createdBy": "Rajesh Kumar"
  }'
```
Expected: new invoice created, batch `B992` (prod-5's only batch) deducted by 10 units.

### 4.7 Run unit tests (after implementation)
```bash
mvn test
```
Expected: all tests pass.

### 4.8 Docker build
```bash
docker build -t fmgc-warehouse-backend:1.0.0 .
docker run -p 3001:3001 fmgc-warehouse-backend:1.0.0
```
Expected: application starts inside container, health check responds.

---

## 5. Implementation Notes for the Coding Agent

1. **Read `_backup_checkpoint/src/types/index.ts` for the exact field names** — every entity field must match the TypeScript interface exactly (camelCase in JSON responses via `@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)` or explicit `@JsonProperty`).

2. **SQLite + Spring Boot gotcha**: SQLite does not support `ALTER TABLE ADD COLUMN` with non-null defaults in some versions. Write the schema DDL defensively with `IF NOT EXISTS` and nullable defaults only.

3. **SQLite + Hibernate**: use `spring.jpa.hibernate.ddl-auto=none` and rely entirely on `schema.sql`. The SQLite dialect (`org.hibernate.community.dialect.SQLiteDialect`) is in the `hibernate-community-dialects` artifact; add it to `pom.xml`:
   ```xml
   <dependency>
     <groupId>org.hibernate.orm</groupId>
     <artifactId>hibernate-community-dialects</artifactId>
   </dependency>
   ```

4. **`items` TEXT column deserialization**: Jackson `ObjectMapper` in the converter must handle `null` gracefully (return empty list, not exception). Initialize the ObjectMapper once as a static field in the converter, not per-call.

5. **No Lombok required** — generate standard Java getters/setters to avoid an additional dependency. If the coder chooses to add Lombok, add `lombok:1.18.34` to `pom.xml` as a `provided` dependency.

6. **Sequence of file creation must follow dependency order** listed in Section 2 (pom.xml → properties → schema.sql → data.sql → entry point → config → security → models+converters → repositories → services → controllers → DTOs). The project will not compile if a service references a repository that doesn't exist yet.

7. **`data.sql` idempotency**: use `INSERT OR IGNORE INTO` for all seed rows. This allows the application to restart without duplicating seed data.

8. **`mvn package -DskipTests`** is the canonical verification command. Run it after every file creation group to keep the codebase in a buildable state.
