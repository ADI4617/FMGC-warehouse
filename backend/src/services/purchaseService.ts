import { v4 as uuid } from 'uuid';
import { getDb } from '../config/database.js';
import { purchaseRepository } from '../repositories/purchaseRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { batchRepository } from '../repositories/batchRepository.js';
import { supplierRepository } from '../repositories/supplierRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

function calcDaysToExpiry(expiryDate: string): number {
  const exp = new Date(expiryDate);
  const now = new Date();
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export const purchaseService = {
  getAll(tenantId: string, opts?: { search?: string; supplierId?: string; status?: string; startDate?: string; endDate?: string }) {
    return purchaseRepository.findByTenant(tenantId, opts).map((p: any) => ({
      ...p,
      items: JSON.parse(p.items || '[]'),
    }));
  },

  getById(id: string, tenantId: string) {
    const purchase = purchaseRepository.findById(id, tenantId);
    if (!purchase) throw AppError.notFound('Purchase not found');
    return { ...purchase, items: JSON.parse(purchase.items || '[]') };
  },

  create(tenantId: string, data: any, actor: { name: string; role: string }) {
    const db = getDb();

    const supplier = supplierRepository.findById(data.supplierId, tenantId);
    if (!supplier) throw AppError.notFound('Supplier not found');

    db.exec('BEGIN');
    try {
      const invoiceNumber = purchaseRepository.nextInvoiceNumber(tenantId);
      const purchaseId = uuid();
      const now = new Date();
      const dateStr = data.date ?? now.toISOString().split('T')[0];

      // If status is Confirmed, add stock (BR-009)
      if (data.status === 'Confirmed') {
        for (const item of data.items) {
          const product = productRepository.findById(item.productId, tenantId);
          if (!product) throw AppError.notFound(`Product ${item.productId} not found`);

          const totalQty = item.quantity + (item.freeQuantity ?? 0);

          // Create batch
          const dte = calcDaysToExpiry(item.expiryDate);
          batchRepository.create({
            id: uuid(),
            tenant_id: tenantId,
            product_id: item.productId,
            sku: item.sku,
            product_name: item.name,
            batch_number: item.batchNumber,
            quantity: totalQty,
            purchase_price: item.unitPrice,
            expiry_date: item.expiryDate,
            days_to_expiry: dte,
            mfg_date: item.mfgDate ?? null,
            is_fefo_priority: dte <= 30 ? 1 : 0,
            status: dte < 0 ? 'expired' : dte <= 30 ? 'near_expiry' : 'healthy',
          });

          // Add stock
          productRepository.adjustStock(item.productId, tenantId, totalQty);
          productRepository.updateStatus(item.productId, tenantId);

          // Stock movement
          stockMovementRepository.create({
            id: uuid(),
            tenant_id: tenantId,
            timestamp: now.toISOString(),
            time_formatted: now.toLocaleTimeString(),
            type: 'Purchase',
            sku: item.sku,
            product_name: item.name,
            quantity: totalQty,
            reference_no: invoiceNumber,
            note: `Batch: ${item.batchNumber}`,
            actor: `${actor.name} (${actor.role})`,
          });
        }

        // Update supplier totals
        supplierRepository.adjustPayable(data.supplierId, tenantId,
          data.paymentStatus === 'Pending' ? data.totalAmount : 0,
          data.totalAmount
        );
      }

      purchaseRepository.create({
        id: purchaseId,
        tenant_id: tenantId,
        invoice_number: invoiceNumber,
        supplier_id: data.supplierId,
        supplier_name: data.supplierName,
        date: dateStr,
        items: JSON.stringify(data.items),
        total_amount: data.totalAmount,
        payment_status: data.paymentStatus ?? 'Pending',
        is_ai_scanned: data.isAiScanned ? 1 : 0,
        status: data.status ?? 'Confirmed',
        document_url: data.documentUrl ?? null,
      });

      auditService.log({
        tenantId,
        actor: actor.name,
        actorRole: actor.role,
        action: 'CREATE_PURCHASE',
        entity: 'PurchaseTransaction',
        entityId: invoiceNumber,
        newValue: { total: data.totalAmount, supplier: data.supplierName, status: data.status },
      });

      const result = purchaseRepository.findById(purchaseId, tenantId) as any;
      db.exec('COMMIT');
      return { ...result, items: JSON.parse(result.items || '[]') };
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  },

  confirm(id: string, tenantId: string, actor: { name: string; role: string }) {
    const purchase = purchaseRepository.findById(id, tenantId);
    if (!purchase) throw AppError.notFound('Purchase not found');
    if (purchase.status === 'Confirmed') throw AppError.badRequest('Purchase already confirmed');
    if (purchase.status === 'Cancelled') throw AppError.badRequest('Cannot confirm a cancelled purchase');

    const items = JSON.parse(purchase.items || '[]');
    const db = getDb();

    db.exec('BEGIN');
    try {
      for (const item of items) {
        const totalQty = item.quantity + (item.freeQuantity ?? 0);
        const dte = calcDaysToExpiry(item.expiryDate);
        batchRepository.create({
          id: uuid(),
          tenant_id: tenantId,
          product_id: item.productId,
          sku: item.sku,
          product_name: item.name,
          batch_number: item.batchNumber,
          quantity: totalQty,
          purchase_price: item.unitPrice,
          expiry_date: item.expiryDate,
          days_to_expiry: dte,
          mfg_date: null,
          is_fefo_priority: dte <= 30 ? 1 : 0,
          status: dte <= 30 ? 'near_expiry' : 'healthy',
        });
        productRepository.adjustStock(item.productId, tenantId, totalQty);
        productRepository.updateStatus(item.productId, tenantId);
        stockMovementRepository.create({
          id: uuid(),
          tenant_id: tenantId,
          timestamp: new Date().toISOString(),
          time_formatted: new Date().toLocaleTimeString(),
          type: 'Purchase',
          sku: item.sku,
          product_name: item.name,
          quantity: totalQty,
          reference_no: purchase.invoice_number,
          note: `Batch: ${item.batchNumber}`,
          actor: `${actor.name} (${actor.role})`,
        });
      }
      purchaseRepository.update(id, tenantId, { status: 'Confirmed' });
      auditService.log({
        tenantId,
        actor: actor.name,
        actorRole: actor.role,
        action: 'CONFIRM_PURCHASE',
        entity: 'PurchaseTransaction',
        entityId: purchase.invoice_number,
        previousValue: { status: 'Draft' },
        newValue: { status: 'Confirmed' },
      });

      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    const result = purchaseRepository.findById(id, tenantId) as any;
    return { ...result, items: JSON.parse(result.items || '[]') };
  },
};
