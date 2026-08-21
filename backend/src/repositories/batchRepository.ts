import { getDb } from '../config/database.js';

export const batchRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM batches WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByProduct(productId: string, tenantId: string) {
    return getDb().prepare(
      'SELECT * FROM batches WHERE product_id = ? AND tenant_id = ? ORDER BY expiry_date ASC'
    ).all(productId, tenantId) as any[];
  },

  // FEFO: batches with quantity > 0, sorted by expiry_date ascending
  findFefoBatches(productId: string, tenantId: string) {
    return getDb().prepare(`
      SELECT * FROM batches
      WHERE product_id = ? AND tenant_id = ? AND quantity > 0
      ORDER BY expiry_date ASC
    `).all(productId, tenantId) as any[];
  },

  findByTenant(tenantId: string, opts?: { search?: string; status?: string }) {
    let sql = 'SELECT * FROM batches WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (product_name LIKE ? OR sku LIKE ? OR batch_number LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.status) {
      sql += ' AND status = ?';
      params.push(opts.status);
    }
    sql += ' ORDER BY expiry_date ASC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  findNearExpiry(tenantId: string, daysThreshold: number) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + daysThreshold);
    return getDb().prepare(`
      SELECT * FROM batches
      WHERE tenant_id = ? AND expiry_date <= ? AND quantity > 0
      ORDER BY expiry_date ASC
    `).all(tenantId, cutoff.toISOString().split('T')[0]) as any[];
  },

  create(batch: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO batches (id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, days_to_expiry, mfg_date, is_fefo_priority, status)
      VALUES (@id, @tenant_id, @product_id, @sku, @product_name, @batch_number, @quantity, @purchase_price, @expiry_date, @days_to_expiry, @mfg_date, @is_fefo_priority, @status)
    `).run(batch);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE batches SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  deductQuantity(id: string, tenantId: string, qty: number) {
    return getDb().prepare(`
      UPDATE batches SET quantity = MAX(0, quantity - ?) WHERE id = ? AND tenant_id = ?
    `).run(qty, id, tenantId);
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM batches WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  },

  updateDaysToExpiry(tenantId: string) {
    const today = new Date().toISOString().split('T')[0];
    return getDb().prepare(`
      UPDATE batches
      SET days_to_expiry = CAST((julianday(expiry_date) - julianday(?)) AS INTEGER),
          is_fefo_priority = CASE WHEN CAST((julianday(expiry_date) - julianday(?)) AS INTEGER) <= 30 AND quantity > 0 THEN 1 ELSE 0 END,
          status = CASE
            WHEN quantity = 0 THEN 'depleted'
            WHEN CAST((julianday(expiry_date) - julianday(?)) AS INTEGER) < 0 THEN 'expired'
            WHEN CAST((julianday(expiry_date) - julianday(?)) AS INTEGER) <= 30 THEN 'near_expiry'
            ELSE 'healthy'
          END
      WHERE tenant_id = ?
    `).run(today, today, today, today, tenantId);
  },
};
