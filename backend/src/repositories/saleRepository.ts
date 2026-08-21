import { getDb } from '../config/database.js';

export const saleRepository = {
  findById(id: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM sales WHERE id = ? AND tenant_id = ?').get(id, tenantId) as any;
  },

  findByInvoice(invoiceNumber: string, tenantId: string) {
    return getDb().prepare('SELECT * FROM sales WHERE invoice_number = ? AND tenant_id = ?').get(invoiceNumber, tenantId) as any;
  },

  findByTenant(tenantId: string, opts?: { search?: string; customerId?: string; startDate?: string; endDate?: string; paymentStatus?: string }) {
    let sql = 'SELECT * FROM sales WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.search) {
      sql += ' AND (invoice_number LIKE ? OR customer_name LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.customerId) {
      sql += ' AND customer_id = ?';
      params.push(opts.customerId);
    }
    if (opts?.startDate) {
      sql += ' AND date >= ?';
      params.push(opts.startDate);
    }
    if (opts?.endDate) {
      sql += ' AND date <= ?';
      params.push(opts.endDate);
    }
    if (opts?.paymentStatus) {
      sql += ' AND payment_status = ?';
      params.push(opts.paymentStatus);
    }
    sql += ' ORDER BY date DESC, time DESC';
    return getDb().prepare(sql).all(...params) as any[];
  },

  create(sale: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, store_name, date, time, items, subtotal, discount_amount, tax_amount, total_amount, amount_paid, balance_due, payment_method, payment_status, created_by)
      VALUES (@id, @tenant_id, @invoice_number, @customer_id, @customer_name, @store_name, @date, @time, @items, @subtotal, @discount_amount, @tax_amount, @total_amount, @amount_paid, @balance_due, @payment_method, @payment_status, @created_by)
    `).run(sale);
  },

  totalRevenue(tenantId: string, startDate?: string, endDate?: string) {
    let sql = 'SELECT SUM(total_amount) as total FROM sales WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (startDate) { sql += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND date <= ?'; params.push(endDate); }
    return (getDb().prepare(sql).get(...params) as any)?.total ?? 0;
  },

  countByTenant(tenantId: string, startDate?: string, endDate?: string) {
    let sql = 'SELECT COUNT(*) as count FROM sales WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (startDate) { sql += ' AND date >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND date <= ?'; params.push(endDate); }
    return (getDb().prepare(sql).get(...params) as any).count as number;
  },

  nextInvoiceNumber(tenantId: string): string {
    const row = getDb().prepare(
      "SELECT invoice_number FROM sales WHERE tenant_id = ? ORDER BY CAST(SUBSTR(invoice_number, 5) AS INTEGER) DESC LIMIT 1"
    ).get(tenantId) as any;
    if (!row) return 'TRX-0001';
    const num = parseInt(row.invoice_number.replace('TRX-', ''), 10) + 1;
    return `TRX-${String(num).padStart(4, '0')}`;
  },

  revenueByDate(tenantId: string, days: number) {
    return getDb().prepare(`
      SELECT date, SUM(total_amount) as revenue, COUNT(*) as count
      FROM sales
      WHERE tenant_id = ? AND date >= date('now', ? || ' days')
      GROUP BY date
      ORDER BY date ASC
    `).all(tenantId, -days) as any[];
  },
};
