import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { userRepository } from '../repositories/userRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

function sanitize(user: any) {
  const { password_hash, ...safe } = user;
  return safe;
}

export const staffService = {
  getAll(tenantId: string) {
    return userRepository.findByTenant(tenantId).map(sanitize);
  },

  getById(id: string, tenantId: string) {
    const user = userRepository.findById(id);
    if (!user || user.tenant_id !== tenantId) throw AppError.notFound('Staff member not found');
    return sanitize(user);
  },

  async add(tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = userRepository.findByEmail(data.email);
    if (existing) throw AppError.conflict('Email already in use');

    const tempPassword = 'Welcome@' + Math.random().toString(36).slice(-6);
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    const userId = uuid();
    const now = new Date().toISOString();

    const defaultModules: Record<string, string[]> = {
      Owner:             ['Dashboard','Sales','Purchase','Inventory','Customers','Suppliers','Collections','Reports','AI Center','Staff & Roles','Audit Logs','Settings'],
      Admin:             ['Dashboard','Sales','Purchase','Inventory','Customers','Suppliers','Collections','Reports','AI Center','Staff & Roles','Audit Logs','Settings'],
      Manager:           ['Dashboard','Sales','Purchase','Inventory','Reports','AI Center'],
      Warehouse:         ['Dashboard','Purchase','Inventory','AI Invoice Scanner','Batch & Expiry'],
      'Sales Staff':     ['Dashboard','Sales','Customers'],
      'Collection Staff':['Dashboard','Customers','Collections','Reports'],
      Viewer:            ['Dashboard','Reports'],
    };

    userRepository.create({
      id: userId,
      tenant_id: tenantId,
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone ?? null,
      role: data.role,
      department: data.department ?? null,
      avatar: null,
      status: data.status ?? 'active',
      last_active: null,
      date_joined: now,
      permissions: JSON.stringify([]),
      access_modules: JSON.stringify(defaultModules[data.role] ?? []),
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'ADD_STAFF',
      entity: 'User',
      entityId: userId,
      newValue: { name: data.name, email: data.email, role: data.role },
    });

    const user = userRepository.findById(userId);
    return { ...sanitize(user), tempPassword };
  },

  update(id: string, tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = userRepository.findById(id);
    if (!existing || existing.tenant_id !== tenantId) throw AppError.notFound('Staff member not found');

    const updates: Record<string, any> = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.role !== undefined) updates.role = data.role;
    if (data.department !== undefined) updates.department = data.department;
    if (data.status !== undefined) updates.status = data.status;

    userRepository.update(id, tenantId, updates);

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_STAFF',
      entity: 'User',
      entityId: id,
      previousValue: sanitize(existing),
      newValue: updates,
    });

    return sanitize(userRepository.findById(id));
  },

  suspend(id: string, tenantId: string, actor: { name: string; role: string }) {
    return staffService.update(id, tenantId, { status: 'suspended' }, actor);
  },

  reactivate(id: string, tenantId: string, actor: { name: string; role: string }) {
    return staffService.update(id, tenantId, { status: 'active' }, actor);
  },

  deactivate(id: string, tenantId: string, actor: { name: string; role: string }) {
    return staffService.update(id, tenantId, { status: 'deactivated' }, actor);
  },

  delete(id: string, tenantId: string, actor: { name: string; role: string }) {
    const existing = userRepository.findById(id);
    if (!existing || existing.tenant_id !== tenantId) throw AppError.notFound('Staff member not found');
    userRepository.delete(id, tenantId);
    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'DELETE_STAFF',
      entity: 'User',
      entityId: id,
      previousValue: { name: existing.name, email: existing.email },
    });
  },
};
