import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { env } from './env.js';
import { logger } from './logger.js';

let db: DatabaseSync;

export function getDb(): DatabaseSync {
  if (!db) {
    const dbDir = path.dirname(env.DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    db = new DatabaseSync(env.DB_PATH);
    db.exec('PRAGMA foreign_keys = ON;');
    logger.info('Database connected (node:sqlite)', { path: env.DB_PATH });
  }
  return db;
}

export function initializeDatabase(): void {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      legal_entity TEXT,
      gstin TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      currency TEXT DEFAULT 'INR',
      plan TEXT DEFAULT 'Enterprise',
      status TEXT DEFAULT 'active',
      created_date TEXT,
      total_skus_count INTEGER DEFAULT 0,
      monthly_revenue_estimate REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL,
      department TEXT,
      avatar TEXT,
      status TEXT DEFAULT 'pending',
      last_active TEXT,
      date_joined TEXT,
      permissions TEXT DEFAULT '[]',
      access_modules TEXT DEFAULT '[]',
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT,
      brand TEXT,
      unit TEXT,
      purchase_price REAL DEFAULT 0,
      selling_price REAL DEFAULT 0,
      mrp REAL DEFAULT 0,
      in_stock INTEGER DEFAULT 0,
      damaged INTEGER DEFAULT 0,
      min_threshold INTEGER DEFAULT 0,
      hsn_code TEXT,
      gst_rate REAL DEFAULT 0,
      status TEXT DEFAULT 'Healthy',
      ai_predicted_shortage INTEGER DEFAULT 0,
      notes TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      UNIQUE(tenant_id, sku)
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      sku TEXT,
      product_name TEXT,
      batch_number TEXT,
      quantity INTEGER DEFAULT 0,
      purchase_price REAL DEFAULT 0,
      expiry_date TEXT,
      days_to_expiry INTEGER DEFAULT 0,
      mfg_date TEXT,
      is_fefo_priority INTEGER DEFAULT 0,
      status TEXT DEFAULT 'healthy',
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      store_name TEXT,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      zone TEXT,
      credit_limit REAL DEFAULT 0,
      outstanding_balance REAL DEFAULT 0,
      overdue_amount REAL DEFAULT 0,
      payment_terms_days INTEGER DEFAULT 30,
      status TEXT DEFAULT 'active',
      last_order_date TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      UNIQUE(tenant_id, code)
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      gstin TEXT,
      address TEXT,
      payable_balance REAL DEFAULT 0,
      total_purchases REAL DEFAULT 0,
      rating REAL DEFAULT 0,
      lead_time_days INTEGER DEFAULT 0,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id),
      UNIQUE(tenant_id, code)
    );

    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      customer_id TEXT,
      customer_name TEXT,
      store_name TEXT,
      date TEXT,
      time TEXT,
      items TEXT DEFAULT '[]',
      subtotal REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      total_amount REAL DEFAULT 0,
      amount_paid REAL DEFAULT 0,
      balance_due REAL DEFAULT 0,
      payment_method TEXT,
      payment_status TEXT,
      created_by TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      invoice_number TEXT NOT NULL,
      supplier_id TEXT,
      supplier_name TEXT,
      date TEXT,
      items TEXT DEFAULT '[]',
      total_amount REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'Pending',
      is_ai_scanned INTEGER DEFAULT 0,
      status TEXT DEFAULT 'Draft',
      document_url TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      timestamp TEXT,
      time_formatted TEXT,
      type TEXT,
      sku TEXT,
      product_name TEXT,
      quantity INTEGER DEFAULT 0,
      reference_no TEXT,
      note TEXT,
      actor TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      receipt_number TEXT NOT NULL,
      customer_id TEXT,
      customer_name TEXT,
      invoice_number TEXT,
      amount REAL DEFAULT 0,
      payment_method TEXT,
      date TEXT,
      time TEXT,
      recorded_by TEXT,
      notes TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      timestamp TEXT,
      actor TEXT,
      actor_role TEXT,
      action TEXT,
      entity TEXT,
      entity_id TEXT,
      previous_value TEXT,
      new_value TEXT,
      reason TEXT,
      ip_address TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    CREATE TABLE IF NOT EXISTS predictive_insights (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      type TEXT,
      title TEXT,
      description TEXT,
      sku TEXT,
      action_label TEXT,
      action_payload TEXT,
      severity TEXT,
      timestamp TEXT,
      FOREIGN KEY (tenant_id) REFERENCES tenants(id)
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_products_tenant_sku ON products(tenant_id, sku);
    CREATE INDEX IF NOT EXISTS idx_batches_tenant_product ON batches(tenant_id, product_id);
    CREATE INDEX IF NOT EXISTS idx_batches_expiry ON batches(expiry_date);
    CREATE INDEX IF NOT EXISTS idx_sales_tenant_date ON sales(tenant_id, date);
    CREATE INDEX IF NOT EXISTS idx_purchases_tenant ON purchases(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_suppliers_tenant ON suppliers(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_stock_movements_tenant ON stock_movements(tenant_id);
    CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_collections_tenant ON collections(tenant_id);
  `);

  logger.info('Database schema initialized');
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    logger.info('Database connection closed');
  }
}
