-- FMGC Warehouse Schema

CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(500),
    legal_entity VARCHAR(500),
    gstin VARCHAR(500),
    email VARCHAR(500),
    phone VARCHAR(500),
    address TEXT,
    city VARCHAR(500),
    state VARCHAR(500),
    currency VARCHAR(500),
    plan VARCHAR(500),
    status VARCHAR(500),
    created_date VARCHAR(500),
    total_skus_count INTEGER,
    monthly_revenue_estimate NUMERIC(15,2)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    name VARCHAR(500),
    email VARCHAR(500),
    password_hash TEXT,
    phone VARCHAR(500),
    role VARCHAR(500),
    department VARCHAR(500),
    avatar VARCHAR(500),
    status VARCHAR(500),
    last_active VARCHAR(500),
    date_joined VARCHAR(500),
    permissions TEXT,
    access_modules TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    sku VARCHAR(500),
    name VARCHAR(500),
    category VARCHAR(500),
    brand VARCHAR(500),
    unit VARCHAR(500),
    purchase_price NUMERIC(15,2),
    selling_price NUMERIC(15,2),
    mrp NUMERIC(15,2),
    in_stock INTEGER,
    damaged INTEGER DEFAULT 0,
    min_threshold INTEGER DEFAULT 0,
    hsn_code VARCHAR(500),
    gst_rate NUMERIC(15,2),
    status VARCHAR(500),
    ai_predicted_shortage INTEGER DEFAULT 0,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS batches (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    product_id VARCHAR(36),
    sku VARCHAR(500),
    product_name VARCHAR(500),
    batch_number VARCHAR(500),
    quantity INTEGER,
    purchase_price NUMERIC(15,2),
    expiry_date VARCHAR(500),
    days_to_expiry INTEGER,
    mfg_date VARCHAR(500),
    is_fefo_priority INTEGER DEFAULT 0,
    status VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    code VARCHAR(500),
    name VARCHAR(500),
    store_name VARCHAR(500),
    contact_person VARCHAR(500),
    phone VARCHAR(500),
    email VARCHAR(500),
    address TEXT,
    zone VARCHAR(500),
    credit_limit NUMERIC(15,2),
    outstanding_balance NUMERIC(15,2) DEFAULT 0,
    overdue_amount NUMERIC(15,2) DEFAULT 0,
    payment_terms_days INTEGER DEFAULT 30,
    status VARCHAR(500),
    last_order_date VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    code VARCHAR(500),
    name VARCHAR(500),
    contact_person VARCHAR(500),
    phone VARCHAR(500),
    email VARCHAR(500),
    gstin VARCHAR(500),
    address TEXT,
    payable_balance NUMERIC(15,2) DEFAULT 0,
    total_purchases NUMERIC(15,2) DEFAULT 0,
    rating NUMERIC(3,1),
    lead_time_days INTEGER
);

CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    invoice_number VARCHAR(500),
    customer_id VARCHAR(36),
    customer_name VARCHAR(500),
    store_name VARCHAR(500),
    date VARCHAR(500),
    time VARCHAR(500),
    items TEXT,
    subtotal NUMERIC(15,2),
    discount_amount NUMERIC(15,2),
    tax_amount NUMERIC(15,2),
    total_amount NUMERIC(15,2),
    amount_paid NUMERIC(15,2),
    balance_due NUMERIC(15,2),
    payment_method VARCHAR(500),
    payment_status VARCHAR(500),
    created_by VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    invoice_number VARCHAR(500),
    supplier_id VARCHAR(36),
    supplier_name VARCHAR(500),
    date VARCHAR(500),
    items TEXT,
    total_amount NUMERIC(15,2),
    payment_status VARCHAR(500),
    is_ai_scanned INTEGER DEFAULT 0,
    status VARCHAR(500),
    document_url TEXT
);

CREATE TABLE IF NOT EXISTS stock_movements (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    timestamp VARCHAR(500),
    time_formatted VARCHAR(500),
    type VARCHAR(500),
    sku VARCHAR(500),
    product_name VARCHAR(500),
    quantity INTEGER,
    reference_no VARCHAR(500),
    note TEXT,
    actor VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    receipt_number VARCHAR(500),
    customer_id VARCHAR(36),
    customer_name VARCHAR(500),
    invoice_number VARCHAR(500),
    amount NUMERIC(15,2),
    payment_method VARCHAR(500),
    date VARCHAR(500),
    time VARCHAR(500),
    recorded_by VARCHAR(500),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    timestamp VARCHAR(500),
    actor VARCHAR(500),
    actor_role VARCHAR(500),
    action VARCHAR(500),
    entity VARCHAR(500),
    entity_id VARCHAR(500),
    previous_value TEXT,
    new_value TEXT,
    reason TEXT,
    ip_address VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS predictive_insights (
    id VARCHAR(36) PRIMARY KEY,
    tenant_id VARCHAR(36),
    type VARCHAR(500),
    title VARCHAR(500),
    description TEXT,
    sku VARCHAR(500),
    action_label VARCHAR(500),
    action_payload TEXT,
    severity VARCHAR(500),
    timestamp VARCHAR(500)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_batches_tenant_id ON batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_tenant_id ON suppliers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_tenant_id ON sales(tenant_id);
CREATE INDEX IF NOT EXISTS idx_purchases_tenant_id ON purchases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant_id ON stock_movements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_collections_tenant_id ON collections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
