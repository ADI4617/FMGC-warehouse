import { v4 as uuid } from 'uuid';
import { customerRepository } from '../repositories/customerRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const customerService = {
  getAll(tenantId: string, opts?: { search?: string; zone?: string; status?: string }) {
    return customerRepository.findByTenant(tenantId, opts);
  },

  getById(id: string, tenantId: string) {
    const c = customerRepository.findById(id, tenantId);
    if (!c) throw AppError.notFound('Customer not found');
    return c;
  },

  create(tenantId: string, data: any, actor: { name: string; role: string }) {
    const code = customerRepository.nextCode(tenantId);
    const id = uuid();

    customerRepository.create({
      id,
      tenant_id: tenantId,
      code,
      name: data.name,
      store_name: data.storeName ?? '',
      contact_person: data.contactPerson ?? '',
      phone: data.phone ?? '',
      email: data.email ?? '',
      address: data.address ?? '',
      zone: data.zone ?? null,
      credit_limit: data.creditLimit ?? 0,
      outstanding_balance: data.outstandingBalance ?? 0,
      overdue_amount: data.overdueAmount ?? 0,
      payment_terms_days: data.paymentTermsDays ?? 30,
      status: data.status ?? 'active',
      last_order_date: null,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'CREATE_CUSTOMER',
      entity: 'Customer',
      entityId: id,
      newValue: { name: data.name, code },
    });

    return customerRepository.findById(id, tenantId);
  },

  update(id: string, tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = customerRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Customer not found');

    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      name: 'name', storeName: 'store_name', contactPerson: 'contact_person',
      phone: 'phone', email: 'email', address: 'address', zone: 'zone',
      creditLimit: 'credit_limit', paymentTermsDays: 'payment_terms_days', status: 'status',
    };
    for (const [k, col] of Object.entries(fieldMap)) {
      if (data[k] !== undefined) updates[col] = data[k];
    }

    customerRepository.update(id, tenantId, updates);

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_CUSTOMER',
      entity: 'Customer',
      entityId: id,
      previousValue: { name: existing.name },
      newValue: updates,
    });

    return customerRepository.findById(id, tenantId);
  },

  delete(id: string, tenantId: string, actor: { name: string; role: string }) {
    const existing = customerRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Customer not found');
    customerRepository.delete(id, tenantId);
    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'DELETE_CUSTOMER',
      entity: 'Customer',
      entityId: id,
      previousValue: { name: existing.name, code: existing.code },
    });
  },
};
