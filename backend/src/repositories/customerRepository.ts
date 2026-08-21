import { getDb } from '../config/database.js';

export const customerRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM customers WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByCode(code: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM customers WHERE code = ? AND tenant_id = ?').get(code, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { search?: string; zone?: string; status?: string }) {
    let sql = 'SELECT * FROM customers WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (name LIKE ? OR store_name LIKE ? OR code LIKE ? OR phone LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.zone) {
      sql += ' AND zone = ?';
      params.push(opts.zone);
    }
    if (opts?.status) {
      sql += ' AND status = ?';
      params.push(opts.status);
    }
    sql += ' ORDER BY name ASC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(customer: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO customers (id, tenant_id, code, name, store_name, contact_person, phone, email, address, zone, credit_limit, outstanding_balance, overdue_amount, payment_terms_days, status, last_order_date)
      VALUES (@id, @tenant_id, @code, @name, @store_name, @contact_person, @phone, @email, @address, @zone, @credit_limit, @outstanding_balance, @overdue_amount, @payment_terms_days, @status, @last_order_date)
    `).run(customer);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE customers SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM customers WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  },

  adjustBalance(id: string, tenantId: string, outstandingDelta: number, overdueDelta = 0) {
    return getDb().prepare(`
      UPDATE customers
      SET outstanding_balance = MAX(0, outstanding_balance + ?),
          overdue_amount = MAX(0, overdue_amount + ?)
      WHERE id = ? AND tenant_id = ?
    `).run(outstandingDelta, overdueDelta, id, tenantId);
  },

  sumOutstanding(tenantId: string) {
    return (getDb().prepare(
      'SELECT SUM(outstanding_balance) as total FROM customers WHERE tenant_id = ?'
    ).get(tenantId) as any)?.total ?? 0;
  },

  nextCode(tenantId: string): string {
    const row = getDb().prepare(
      "SELECT code FROM customers WHERE tenant_id = ? ORDER BY CAST(SUBSTR(code, 6) AS INTEGER) DESC LIMIT 1"
    ).get(tenantId) as any;
    if (!row) return 'CUST-001';
    const num = parseInt(row.code.replace('CUST-', ''), 10) + 1;
    return `CUST-${String(num).padStart(3, '0')}`;
  },
};
