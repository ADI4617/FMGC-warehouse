import { getDb } from '../config/database.js';

export const supplierRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM suppliers WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { search?: string }) {
    let sql = 'SELECT * FROM suppliers WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (name LIKE ? OR code LIKE ? OR contact_person LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
    sql += ' ORDER BY name ASC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(supplier: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO suppliers (id, tenant_id, code, name, contact_person, phone, email, gstin, address, payable_balance, total_purchases, rating, lead_time_days)
      VALUES (@id, @tenant_id, @code, @name, @contact_person, @phone, @email, @gstin, @address, @payable_balance, @total_purchases, @rating, @lead_time_days)
    `).run(supplier);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE suppliers SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM suppliers WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  },

  adjustPayable(id: string, tenantId: string, delta: number, purchaseDelta = 0) {
    return getDb().prepare(`
      UPDATE suppliers
      SET payable_balance = MAX(0, payable_balance + ?),
          total_purchases = total_purchases + ?
      WHERE id = ? AND tenant_id = ?
    `).run(delta, purchaseDelta, id, tenantId);
  },

  nextCode(tenantId: string): string {
    const row = getDb().prepare(
      "SELECT code FROM suppliers WHERE tenant_id = ? ORDER BY CAST(SUBSTR(code, 5) AS INTEGER) DESC LIMIT 1"
    ).get(tenantId) as any;
    if (!row) return 'SUP-1';
    const num = parseInt(row.code.replace('SUP-', ''), 10) + 1;
    return `SUP-${num}`;
  },
};
