import { getDb } from '../config/database.js';

export const userRepository = {
  findById(id: string) {
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
  },

  findByEmail(email: string) {
    return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  },

  findByTenant(tenantId: string) {
    return getDb()
      .prepare('SELECT * FROM users WHERE tenant_id = ? ORDER BY date_joined DESC')
      .all(tenantId) as any[];
  },

  create(user: Record<string, any>) {
    return getDb().prepare(`
      INSERT INTO users (id, tenant_id, name, email, password_hash, phone, role, department, avatar, status, last_active, date_joined, permissions, access_modules)
      VALUES (@id, @tenant_id, @name, @email, @password_hash, @phone, @role, @department, @avatar, @status, @last_active, @date_joined, @permissions, @access_modules)
    `).run(user);
  },

  update(id: string, tenantId: string, updates: Record<string, any>) {
    const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
    return getDb().prepare(
      `UPDATE users SET ${fields} WHERE id = @id AND tenant_id = @tenant_id`
    ).run({ ...updates, id, tenant_id: tenantId });
  },

  delete(id: string, tenantId: string) {
    return getDb().prepare('DELETE FROM users WHERE id = ? AND tenant_id = ?').run(id, tenantId);
  },

  countByTenant(tenantId: string) {
    return (getDb().prepare('SELECT COUNT(*) as count FROM users WHERE tenant_id = ?').get(tenantId) as any).count as number;
  },
};
