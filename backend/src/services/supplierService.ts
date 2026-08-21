import { v4 as uuid } from 'uuid';
import { supplierRepository } from '../repositories/supplierRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const supplierService = {
  getAll(tenantId: string, opts?: { search?: string }) {
    return supplierRepository.findByTenant(tenantId, opts);
  },

  getById(id: string, tenantId: string) {
    const s = supplierRepository.findById(id, tenantId);
    if (!s) throw AppError.notFound('Supplier not found');
    return s;
  },

  create(tenantId: string, data: any, actor: { name: string; role: string }) {
    const code = supplierRepository.nextCode(tenantId);
    const id = uuid();

    supplierRepository.create({
      id,
      tenant_id: tenantId,
      code,
      name: data.name,
      contact_person: data.contactPerson ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      gstin: data.gstin ?? '',
      address: data.address ?? '',
      payable_balance: data.payableBalance ?? 0,
      total_purchases: data.totalPurchases ?? 0,
      rating: data.rating ?? 0,
      lead_time_days: data.leadTimeDays ?? 0,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'CREATE_SUPPLIER',
      entity: 'Supplier',
      entityId: id,
      newValue: { name: data.name, code },
    });

    return supplierRepository.findById(id, tenantId);
  },

  update(id: string, tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = supplierRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Supplier not found');

    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      name: 'name', contactPerson: 'contact_person', phone: 'phone',
      email: 'email', gstin: 'gstin', address: 'address',
      payableBalance: 'payable_balance', rating: 'rating', leadTimeDays: 'lead_time_days',
    };
    for (const [k, col] of Object.entries(fieldMap)) {
      if (data[k] !== undefined) updates[col] = data[k];
    }

    supplierRepository.update(id, tenantId, updates);

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_SUPPLIER',
      entity: 'Supplier',
      entityId: id,
      previousValue: { name: existing.name },
      newValue: updates,
    });

    return supplierRepository.findById(id, tenantId);
  },

  delete(id: string, tenantId: string, actor: { name: string; role: string }) {
    const existing = supplierRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Supplier not found');
    supplierRepository.delete(id, tenantId);
    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'DELETE_SUPPLIER',
      entity: 'Supplier',
      entityId: id,
      previousValue: { name: existing.name, code: existing.code },
    });
  },
};
