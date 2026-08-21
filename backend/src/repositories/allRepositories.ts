import { getDb } from '../config/database.js';

export const userRepository = {
  findByEmail(email: string) {
    return getDb().prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email) as any;
  },

  findById(id: string, tenantId?: string) {
    if (tenantId) {
      return getDb().prepare('SELECT * FROM users WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
    }
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  },

  findAllByTenant(tenantId: string) {
    return getDb().prepare('SELECT * FROM users WHERE tenant_id = ? ORDER BY date_joined DESC').all(tenantId) as any[];
  },

  create(user: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO users (id, tenant_id, name, email, password_hash, phone, role, department, avatar, status, last_active, date_joined, permissions, access_modules)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      user.id, user.tenant_id, user.name, user.email, user.password_hash, user.phone,
      user.role, user.department, user.avatar, user.status, user.last_active,
      user.date_joined, user.permissions, user.access_modules
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE users SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM users WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  }
};

export const productRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM products WHERE tenant_id = ? ORDER BY name ASC').all(tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM products WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findBySku(sku: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM products WHERE sku = ? AND tenant_id = ?').get(sku, tenantId) as any;
  },

  create(product: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO products (id, tenant_id, sku, name, category, brand, unit, purchase_price, selling_price, mrp, in_stock, damaged, min_threshold, hsn_code, gst_rate, status, ai_predicted_shortage, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      product.id, product.tenant_id, product.sku, product.name, product.category, product.brand,
      product.unit, product.purchase_price, product.selling_price, product.mrp, product.in_stock,
      product.damaged, product.min_threshold, product.hsn_code, product.gst_rate, product.status,
      product.ai_predicted_shortage, product.notes
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE products SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM products WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  }
};

export const batchRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM batches WHERE tenant_id = ? ORDER BY expiry_date ASC').all(tenantId) as any[];
  },

  findByProductId(productId: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM batches WHERE product_id = ? AND tenant_id = ? ORDER BY expiry_date ASC').all(productId, tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM batches WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  create(batch: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO batches (id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, days_to_expiry, mfg_date, is_fefo_priority, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      batch.id, batch.tenant_id, batch.product_id, batch.sku, batch.product_name, batch.batch_number,
      batch.quantity, batch.purchase_price, batch.expiry_date, batch.days_to_expiry, batch.mfg_date,
      batch.is_fefo_priority, batch.status
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE batches SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM batches WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  }
};

export const customerRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM customers WHERE tenant_id = ? ORDER BY name ASC').all(tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM customers WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  create(customer: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO customers (id, tenant_id, code, name, store_name, contact_person, phone, email, address, zone, credit_limit, outstanding_balance, overdue_amount, payment_terms_days, status, last_order_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      customer.id, customer.tenant_id, customer.code, customer.name, customer.store_name,
      customer.contact_person, customer.phone, customer.email, customer.address, customer.zone,
      customer.credit_limit, customer.outstanding_balance, customer.overdue_amount,
      customer.payment_terms_days, customer.status, customer.last_order_date
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE customers SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM customers WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  }
};

export const supplierRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM suppliers WHERE tenant_id = ? ORDER BY name ASC').all(tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM suppliers WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  create(supplier: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO suppliers (id, tenant_id, code, name, contact_person, phone, email, gstin, address, payable_balance, total_purchases, rating, lead_time_days)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      supplier.id, supplier.tenant_id, supplier.code, supplier.name, supplier.contact_person,
      supplier.phone, supplier.email, supplier.gstin, supplier.address, supplier.payable_balance,
      supplier.total_purchases, supplier.rating, supplier.lead_time_days
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE suppliers SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM suppliers WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  }
};

export const salesRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM sales WHERE tenant_id = ? ORDER BY date DESC, time DESC').all(tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM sales WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  create(sale: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, store_name, date, time, items, subtotal, discount_amount, tax_amount, total_amount, amount_paid, balance_due, payment_method, payment_status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      sale.id, sale.tenant_id, sale.invoice_number, sale.customer_id, sale.customer_name,
      sale.store_name, sale.date, sale.time, sale.items, sale.subtotal, sale.discount_amount,
      sale.tax_amount, sale.total_amount, sale.amount_paid, sale.balance_due, sale.payment_method,
      sale.payment_status, sale.created_by
    );
  }
};

export const purchaseRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM purchases WHERE tenant_id = ? ORDER BY date DESC').all(tenantId) as any[];
  },

  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM purchases WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  create(purchase: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO purchases (id, tenant_id, invoice_number, supplier_id, supplier_name, date, items, total_amount, payment_status, is_ai_scanned, status, document_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      purchase.id, purchase.tenant_id, purchase.invoice_number, purchase.supplier_id,
      purchase.supplier_name, purchase.date, purchase.items, purchase.total_amount,
      purchase.payment_status, purchase.is_ai_scanned, purchase.status, purchase.document_url
    );
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE purchases SET ${fields} WHERE id = ? AND tenant_id = ?`);
    return stmt.run(...values, id, tenantId);
  }
};

export const collectionRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM collections WHERE tenant_id = ? ORDER BY date DESC, time DESC').all(tenantId) as any[];
  },

  create(collection: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO collections (id, tenant_id, receipt_number, customer_id, customer_name, invoice_number, amount, payment_method, date, time, recorded_by, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      collection.id, collection.tenant_id, collection.receipt_number, collection.customer_id,
      collection.customer_name, collection.invoice_number, collection.amount,
      collection.payment_method, collection.date, collection.time, collection.recorded_by,
      collection.notes
    );
  }
};

export const stockMovementRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM stock_movements WHERE tenant_id = ? ORDER BY timestamp DESC').all(tenantId) as any[];
  },

  create(movement: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO stock_movements (id, tenant_id, timestamp, time_formatted, type, sku, product_name, quantity, reference_no, note, actor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      movement.id, movement.tenant_id, movement.timestamp, movement.time_formatted,
      movement.type, movement.sku, movement.product_name, movement.quantity,
      movement.reference_no, movement.note, movement.actor
    );
  }
};

export const auditLogRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM audit_logs WHERE tenant_id = ? ORDER BY timestamp DESC').all(tenantId) as any[];
  },

  create(log: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO audit_logs (id, tenant_id, timestamp, actor, actor_role, action, entity, entity_id, previous_value, new_value, reason, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      log.id, log.tenant_id, log.timestamp, log.actor, log.actor_role, log.action,
      log.entity, log.entity_id, log.previous_value, log.new_value, log.reason, log.ip_address
    );
  }
};

export const insightRepository = {
  findAll(tenantId: string) {
    return getDb().prepare('SELECT * FROM predictive_insights WHERE tenant_id = ? ORDER BY timestamp DESC').all(tenantId) as any[];
  }
};
