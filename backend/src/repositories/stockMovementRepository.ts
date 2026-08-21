import { getDb } from '../config/database.js';

export const stockMovementRepository = {
  findByTenant(tenantId: string, opts?: { sku?: string; type?: string; search?: string; limit?: number }) {
    let sql = 'SELECT * FROM stock_movements WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.sku) {
      sql += ' AND sku = ?';
      params.push(opts.sku);
    }
    if (opts?.type) {
      sql += ' AND type = ?';
      params.push(opts.type);
    }
    if (opts?.search) {
      sql += ' AND (sku LIKE ? OR product_name LIKE ? OR reference_no LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
    sql += ' ORDER BY timestamp DESC';
    if (opts?.limit) {
      sql += ` LIMIT ${opts.limit}`;
    }
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(movement: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO stock_movements (id, tenant_id, timestamp, time_formatted, type, sku, product_name, quantity, reference_no, note, actor)
      VALUES (@id, @tenant_id, @timestamp, @time_formatted, @type, @sku, @product_name, @quantity, @reference_no, @note, @actor)
    `).run(movement);
  },
};
