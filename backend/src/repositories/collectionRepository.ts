import { getDb } from '../config/database.js';

export const collectionRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM collections WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { customerId?: string; search?: string; startDate?: string; endDate?: string }) {
    let sql = 'SELECT * FROM collections WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.customerId) {
      sql += ' AND customer_id = ?';
      params.push(opts.customerId);
    }
    if (opts?.search) {
      sql += ' AND (receipt_number LIKE ? OR customer_name LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.startDate) {
      sql += ' AND date >= ?';
      params.push(opts.startDate);
    }
    if (opts?.endDate) {
      sql += ' AND date <= ?';
      params.push(opts.endDate);
    }
    sql += ' ORDER BY date DESC, time DESC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(collection: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO collections (id, tenant_id, receipt_number, customer_id, customer_name, invoice_number, amount, payment_method, date, time, recorded_by, notes)
      VALUES (@id, @tenant_id, @receipt_number, @customer_id, @customer_name, @invoice_number, @amount, @payment_method, @date, @time, @recorded_by, @notes)
    `).run(collection);
  },

  totalCollected(tenantId: string, startDate?: string, endDate?: string) {
    let sql = 'SELECT SUM(amount) as total FROM collections WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (startDate) { sql += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND date <= ?'; params.push(endDate); }
    return (getDb().prepare(sql).get(...params) as any)?.total ?? 0;
  },

  nextReceiptNumber(tenantId: string): string {
    const row = getDb().prepare(
      "SELECT receipt_number FROM collections WHERE tenant_id = ? ORDER BY CAST(SUBSTR(receipt_number, 5) AS INTEGER) DESC LIMIT 1"
    ).get(tenantId) as any;
    if (!row) return 'RCP-1001';
    const num = parseInt(row.receipt_number.replace('RCP-', ''), 10) + 1;
    return `RCP-${num}`;
  },
};
