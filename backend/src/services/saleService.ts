import { v4 as uuid } from 'uuid';
import { getDb } from '../config/database.js';
import { saleRepository } from '../repositories/saleRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { batchRepository } from '../repositories/batchRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const saleService = {
  getAll(tenantId: string, opts?: { search?: string; customerId?: string; startDate?: string; endDate?: string; paymentStatus?: string }) {
    return saleRepository.findByTenant(tenantId, opts).map((s: any) => ({
      ...s,
      items: JSON.parse(s.items || '[]'),
    }));
  },

  getById(id: string, tenantId: string) {
    const sale = saleRepository.findById(id, tenantId);
    if (!sale) throw AppError.notFound('Sale not found');
    return { ...sale, items: JSON.parse(sale.items || '[]') };
  },

  create(tenantId: string, data: any, actor: { name: string; role: string }) {
    const db = getDb();

    // Validate customer exists
    const customer = customerRepository.findById(data.customerId, tenantId);
    if (!customer) throw AppError.notFound('Customer not found');

    // Deduct stock using FEFO (BR-006)
    db.exec('BEGIN');
    try {
      const invoiceNumber = saleRepository.nextInvoiceNumber(tenantId);
      const saleId = uuid();
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString();

      for (const item of data.items) {
        const product = productRepository.findById(item.productId, tenantId);
        if (!product) throw AppError.notFound(`Product ${item.productId} not found`);

        const totalQty = item.quantity + (item.freeQuantity ?? 0);

        // FEFO deduction
        const fefoBatches = batchRepository.findFefoBatches(item.productId, tenantId);
        let remaining = totalQty;
        for (const batch of fefoBatches) {
          if (remaining <= 0) break;
          const deduct = Math.min(batch.quantity, remaining);
          batchRepository.deductQuantity(batch.id, tenantId, deduct);
          remaining -= deduct;
        }

        // Adjust product stock
        productRepository.adjustStock(item.productId, tenantId, -totalQty);
        productRepository.updateStatus(item.productId, tenantId);

        // Stock movement
        stockMovementRepository.create({
          id: uuid(),
          tenant_id: tenantId,
          timestamp: now.toISOString(),
          time_formatted: timeStr,
          type: 'Sale',
          sku: item.sku,
          product_name: item.name,
          quantity: -totalQty,
          reference_no: invoiceNumber,
          note: null,
          actor: `${actor.name} (${actor.role})`,
        });
      }

      // Create sale record
      saleRepository.create({
        id: saleId,
        tenant_id: tenantId,
        invoice_number: invoiceNumber,
        customer_id: data.customerId,
        customer_name: data.customerName,
        store_name: data.storeName ?? '',
        date: data.date ?? dateStr,
        time: data.time ?? timeStr,
        items: JSON.stringify(data.items),
        subtotal: data.subtotal,
        discount_amount: data.discountAmount ?? 0,
        tax_amount: data.taxAmount ?? 0,
        total_amount: data.totalAmount,
        amount_paid: data.amountPaid ?? 0,
        balance_due: data.balanceDue ?? 0,
        payment_method: data.paymentMethod,
        payment_status: data.paymentStatus ?? 'Paid',
        created_by: actor.name,
      });

      // Update customer balance (BR-007)
      if (data.balanceDue > 0) {
        customerRepository.adjustBalance(data.customerId, tenantId, data.balanceDue);
        customerRepository.update(data.customerId, tenantId, {
          last_order_date: dateStr,
        });
      } else {
        customerRepository.update(data.customerId, tenantId, { last_order_date: dateStr });
      }

      auditService.log({
        tenantId,
        actor: actor.name,
        actorRole: actor.role,
        action: 'CREATE_SALE',
        entity: 'SaleTransaction',
        entityId: invoiceNumber,
        newValue: { total: data.totalAmount, customer: data.customerName, items: data.items.length },
        reason: 'Sale completed',
      });

      const result = saleRepository.findById(saleId, tenantId) as any;
      db.exec('COMMIT');
      return { ...result, items: JSON.parse(result.items || '[]') };
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  },
};
