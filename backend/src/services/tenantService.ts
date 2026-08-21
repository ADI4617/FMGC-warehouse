import { tenantRepository } from '../repositories/tenantRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const tenantService = {
  getById(id: string) {
    const tenant = tenantRepository.findById(id);
    if (!tenant) throw AppError.notFound('Tenant not found');
    return tenant;
  },

  update(id: string, data: any, actor: { name: string; role: string }) {
    const existing = tenantRepository.findById(id);
    if (!existing) throw AppError.notFound('Tenant not found');

    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      name: 'name', legalEntity: 'legal_entity', gstin: 'gstin',
      email: 'email', phone: 'phone', address: 'address',
      city: 'city', state: 'state', currency: 'currency', plan: 'plan',
    };
    for (const [k, col] of Object.entries(fieldMap)) {
      if (data[k] !== undefined) updates[col] = data[k];
    }

    if (Object.keys(updates).length === 0) return existing;

    tenantRepository.update(id, updates);

    auditService.log({
      tenantId: id,
      actor: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_TENANT',
      entity: 'Tenant',
      entityId: id,
      previousValue: { name: existing.name },
      newValue: updates,
    });

    return tenantRepository.findById(id);
  },
};
