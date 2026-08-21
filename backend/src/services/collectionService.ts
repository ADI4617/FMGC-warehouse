import { v4 as uuid } from 'uuid';
import { collectionRepository } from '../repositories/collectionRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const collectionService = {
  getAll(tenantId: string, opts?: { customerId?: string; search?: string; startDate?: string; endDate?: string }) {
    return collectionRepository.findByTenant(tenantId, opts);
  },

  getById(id: string, tenantId: string) {
    const c = collectionRepository.findById(id, tenantId);
    if (!c) throw AppError.notFound('Collection record not found');
    return c;
  },

  record(tenantId: string, data: {
    customerId: string;
    amount: number;
    paymentMethod: string;
    notes?: string;
  }, actor: { name: string; role: string }) {
    const customer = customerRepository.findById(data.customerId, tenantId);
    if (!customer) throw AppError.notFound('Customer not found');

    const receiptNumber = collectionRepository.nextReceiptNumber(tenantId);
    const id = uuid();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString();

    collectionRepository.create({
      id,
      tenant_id: tenantId,
      receipt_number: receiptNumber,
      customer_id: data.customerId,
      customer_name: customer.name,
      invoice_number: null,
      amount: data.amount,
      payment_method: data.paymentMethod,
      date: dateStr,
      time: timeStr,
      recorded_by: actor.name,
      notes: data.notes ?? null,
    });

    // Reduce customer outstanding (BR-008)
    const overdueReduction = Math.min(data.amount, customer.overdue_amount);
    const outstandingReduction = data.amount;
    customerRepository.adjustBalance(
      data.customerId,
      tenantId,
      -outstandingReduction,
      -overdueReduction
    );

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'RECORD_COLLECTION',
      entity: 'Collection',
      entityId: receiptNumber,
      newValue: { amount: data.amount, customer: customer.name, method: data.paymentMethod },
      reason: data.notes,
    });

    return collectionRepository.findById(id, tenantId);
  },
};
