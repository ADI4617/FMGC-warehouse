import { getDb } from '../config/database.js';

export const tenantRepository = {
  findById(id: string) {
    return getDb().prepare('SELECT * FROM tenants WHERE id = ?').get(id) as any;
  },

  create(tenant: Record<string, any>) {
    const stmt = getDb().prepare(`
      INSERT INTO tenants (id, name, legal_entity, gstin, email, phone, address, city, state, currency, plan, status, created_date, total_skus_count, monthly_revenue_estimate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      tenant.id,
      tenant.name,
      tenant.legal_entity,
      tenant.gstin,
      tenant.email,
      tenant.phone,
      tenant.address,
      tenant.city,
      tenant.state,
      tenant.currency,
      tenant.plan,
      tenant.status,
      tenant.created_date,
      tenant.total_skus_count,
      tenant.monthly_revenue_estimate
    );
  },

  update(id: string, updates: Record<string, any>) {
    const keys = Object.keys(updates);
    const fields = keys.map(k => `${k} = ?`).join(', ');
    const values = keys.map(k => updates[k]);
    const stmt = getDb().prepare(`UPDATE tenants SET ${fields} WHERE id = ?`);
    return stmt.run(...values, id);
  },
};
