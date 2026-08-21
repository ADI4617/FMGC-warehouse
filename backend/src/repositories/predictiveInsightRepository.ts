import { getDb } from '../config/database.js';

export const predictiveInsightRepository = {
  findByTenant(tenantId: string) {
    return getDb().prepare(
      'SELECT * FROM predictive_insights WHERE tenant_id = ? ORDER BY timestamp DESC'
    ).all(tenantId) as any[];
  },

  create(insight: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO predictive_insights (id, tenant_id, type, title, description, sku, action_label, action_payload, severity, timestamp)
      VALUES (@id, @tenant_id, @type, @title, @description, @sku, @action_label, @action_payload, @severity, @timestamp)
    `).run(insight);
  },

  deleteByTenant(tenantId: string) {
    return getDb().prepare('DELETE FROM predictive_insights WHERE tenant_id = ?').run(tenantId);
  },
};
