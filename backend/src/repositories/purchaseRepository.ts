import { getDb } from '../config/database.js';

export const purchaseRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM purchases WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByInvoice(invoiceNumber: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM purchases WHERE invoice_number = ? AND tenant_id = ?').get(invoiceNumber, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { search?: string; supplierId?: string; status?: string; startDate?: string; endDate?: string }) {
    let sql = 'SELECT * FROM purchases WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (invoice_number LIKE ? OR supplier_name LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.supplierId) {
      sql += ' AND supplier_id = ?';
      params.push(opts.supplierId);
    }
    if (opts?.status) {
      sql += ' AND status = ?';
      params.push(opts.status);
    }
    if (opts?.startDate) {
      sql += ' AND date >= ?';
      params.push(opts.startDate);
    }
    if (opts?.endDate) {
      sql += ' AND date <= ?';
      params.push(opts.endDate);
    }
    sql += ' ORDER BY date DESC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(purchase: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO purchases (id, tenant_id, invoice_number, supplier_id, supplier_name, date, items, total_amount, payment_status, is_ai_scanned, status, document_url)
      VALUES (@id, @tenant_id, @invoice_number, @supplier_id, @supplier_name, @date, @items, @total_amount, @payment_status, @is_ai_scanned, @status, @document_url)
    `).run(purchase);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE purchases SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  nextInvoiceNumber(tenantId: string): string {
    const year = new Date().getFullYear();
    const row = getDb().prepare(
      `SELECT invoice_number FROM purchases WHERE tenant_id = ? AND invoice_number LIKE 'PO-${year}-%' ORDER BY CAST(SUBSTR(invoice_number, 9) AS INTEGER) DESC LIMIT 1`
    ).get(tenantId) as any;
    if (!row) return `PO-${year}-001`;
    const num = parseInt(row.invoice_number.split('-')[2], 10) + 1;
    return `PO-${year}-${String(num).padStart(3, '0')}`;
  },

  totalByTenant(tenantId: string) {
    return (getDb().prepare(
      'SELECT SUM(total_amount) as total FROM purchases WHERE tenant_id = ? AND status = ?'
    ).get(tenantId, 'Confirmed') as any)?.total ?? 0;
  },
};
