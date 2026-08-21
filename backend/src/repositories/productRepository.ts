import { getDb } from '../config/database.js';

export const productRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM products WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findBySku(sku: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM products WHERE sku = ? AND tenant_id = ?').get(sku, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { search?: string; category?: string; status?: string }) {
    let sql = 'SELECT * FROM products WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (name LIKE ? OR sku LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.category) {
      sql += ' AND category = ?';
      params.push(opts.category);
    }
    if (opts?.status) {
      sql += ' AND status = ?';
      params.push(opts.status);
    }
    sql += ' ORDER BY name ASC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(product: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO products (id, tenant_id, sku, name, category, brand, unit, purchase_price, selling_price, mrp, in_stock, damaged, min_threshold, hsn_code, gst_rate, status, ai_predicted_shortage, notes)
      VALUES (@id, @tenant_id, @sku, @name, @category, @brand, @unit, @purchase_price, @selling_price, @mrp, @in_stock, @damaged, @min_threshold, @hsn_code, @gst_rate, @status, @ai_predicted_shortage, @notes)
    `).run(product);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE products SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM products WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  },

  adjustStock(id: string, tenantId: string, delta: number, damageDelta = 0) {
    return getDb().prepare(`
      UPDATE products
      SET in_stock = MAX(0, in_stock + ?),
          damaged = MAX(0, damaged + ?)
      WHERE id = ? AND tenant_id = ?
    `).run(delta, damageDelta, id, tenantId);
  },

  updateStatus(id: string, tenantId: string) {
    const product = productRepository.findById(id, tenantId);
    if (!product) return;
    let status = 'Healthy';
    if (product.in_stock === 0) status = 'Out of Stock';
    else if (product.in_stock <= product.min_threshold) status = 'Low';
    return getDb().prepare('UPDATE products SET status = ? WHERE id = ? AND tenant_id = ?')
      .run(status, id, tenantId);
  },

  countByTenant(tenantId: string) {
    return (getDb().prepare('SELECT COUNT(*) as count FROM products WHERE tenant_id = ?').get(tenantId) as any).count as number;
  },

  sumStockValue(tenantId: string) {
    return (getDb().prepare(
      'SELECT SUM(in_stock * purchase_price) as total FROM products WHERE tenant_id = ?'
    ).get(tenantId) as any)?.total ?? 0;
  },

  countLowStock(tenantId: string) {
    return (getDb().prepare(
      "SELECT COUNT(*) as count FROM products WHERE tenant_id = ? AND status IN ('Low', 'Out of Stock')"
    ).get(tenantId) as any).count as number;
  },
};
