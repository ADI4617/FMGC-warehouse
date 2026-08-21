import { getDb } from '../config/database.js';

export const auditLogRepository = {
  findByTenant(tenantId: string, opts?: { entity?: string; actor?: string; action?: string; search?: string; startDate?: string; endDate?: string; limit?: number; offset?: number }) {
    let sql = 'SELECT * FROM audit_logs WHERE tenant_id = ?';
    const params: any[] = [tenantId];
    if (opts?.entity) {
      sql += ' AND entity = ?';
      params.push(opts.entity);
    }
    if (opts?.actor) {
      sql += ' AND actor LIKE ?';
      params.push(`%${opts.actor}%`);
    }
    if (opts?.action) {
      sql += ' AND action = ?';
      params.push(opts.action);
    }
    if (opts?.search) {
      sql += ' AND (actor LIKE ? OR action LIKE ? OR entity LIKE ? OR entity_id LIKE ?)';
      params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
    }
    if (opts?.startDate) {
      sql += ' AND timestamp >= ?';
      params.push(opts.startDate);
    }
    if (opts?.endDate) {
      sql += ' AND timestamp <= ?';
      params.push(opts.endDate + ' 23:59:59');
    }
    sql += ' ORDER BY timestamp DESC';
    if (opts?.limit) {
      sql += ` LIMIT ${opts.limit}`;
      if (opts?.offset) {
        sql += ` OFFSET ${opts.offset}`;
      }
    }
    return getDb().prepare(sql).all(...params) as any[];
  },

  countByTenant(tenantId: string) {
    return (getDb().prepare('SELECT COUNT(*) as count FROM audit_logs WHERE tenant_id = ?').get(tenantId) as any).count as number;
  },

  create(log: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO audit_logs (id, tenant_id, timestamp, actor, actor_role, action, entity, entity_id, previous_value, new_value, reason, ip_address)
      VALUES (@id, @tenant_id, @timestamp, @actor, @actor_role, @action, @entity, @entity_id, @previous_value, @new_value, @reason, @ip_address)
    `).run(log);
  },
};
