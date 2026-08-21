import { v4 as uuid } from 'uuid';
import { batchRepository } from '../repositories/batchRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

function calcDaysToExpiry(expiryDate: string): number {
  const exp = new Date(expiryDate);
  const now = new Date();
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export const batchService = {
  getAll(tenantId: string, opts?: { search?: string; status?: string }) {
    batchRepository.updateDaysToExpiry(tenantId);
    return batchRepository.findByTenant(tenantId, opts);
  },

  getByProduct(productId: string, tenantId: string) {
    const product = productRepository.findById(productId, tenantId);
    if (!product) throw AppError.notFound('Product not found');
    return batchRepository.findByProduct(productId, tenantId);
  },

  getById(id: string, tenantId: string) {
    const batch = batchRepository.findById(id, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');
    return batch;
  },

  create(tenantId: string, data: {
    productId: string;
    batchNumber: string;
    quantity: number;
    purchasePrice: number;
    expiryDate: string;
    mfgDate?: string;
  }, actor: { name: string; role: string }) {
    const product = productRepository.findById(data.productId, tenantId);
    if (!product) throw AppError.notFound('Product not found');

    const dte = calcDaysToExpiry(data.expiryDate);
    const id = uuid();
    batchRepository.create({
      id,
      tenant_id: tenantId,
      product_id: data.productId,
      sku: product.sku,
      product_name: product.name,
      batch_number: data.batchNumber,
      quantity: data.quantity,
      purchase_price: data.purchasePrice,
      expiry_date: data.expiryDate,
      days_to_expiry: dte,
      mfg_date: data.mfgDate ?? null,
      is_fefo_priority: dte <= 30 ? 1 : 0,
      status: dte < 0 ? 'expired' : dte <= 30 ? 'near_expiry' : 'healthy',
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'CREATE_BATCH',
      entity: 'Batch',
      entityId: id,
      newValue: { productId: data.productId, batchNumber: data.batchNumber, quantity: data.quantity },
    });

    return batchRepository.findById(id, tenantId);
  },

  applyExpiryDiscount(id: string, tenantId: string, discountPercent: number, actor: { name: string; role: string }) {
    const batch = batchRepository.findById(id, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');
    if (batch.days_to_expiry > 30) {
      throw AppError.badRequest('Expiry discount can only be applied to batches within 30 days of expiry (BR-011)');
    }
    batchRepository.update(id, tenantId, { status: 'discounted', is_fefo_priority: 1 });
    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'APPLY_EXPIRY_DISCOUNT',
      entity: 'Batch',
      entityId: id,
      newValue: { discountPercent, status: 'discounted' },
    });
    return batchRepository.findById(id, tenantId);
  },

  writeOff(id: string, tenantId: string, actor: { name: string; role: string }) {
    const batch = batchRepository.findById(id, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');

    const qty = batch.quantity;
    // Move quantity to damaged, zero out batch
    productRepository.adjustStock(batch.product_id, tenantId, -qty, qty);
    productRepository.updateStatus(batch.product_id, tenantId);
    batchRepository.update(id, tenantId, { quantity: 0, status: 'written_off' });

    stockMovementRepository.create({
      id: uuid(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString(),
      type: 'Write-off',
      sku: batch.sku,
      product_name: batch.product_name,
      quantity: -qty,
      reference_no: id,
      note: `Batch ${batch.batch_number} written off`,
      actor: `${actor.name} (${actor.role})`,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'BATCH_WRITEOFF',
      entity: 'Batch',
      entityId: id,
      previousValue: { quantity: qty, status: batch.status },
      newValue: { quantity: 0, status: 'written_off' },
      reason: 'Batch write-off (BR-012)',
    });

    return batchRepository.findById(id, tenantId);
  },

  returnToSupplier(id: string, tenantId: string, actor: { name: string; role: string }) {
    const batch = batchRepository.findById(id, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');

    const qty = batch.quantity;
    productRepository.adjustStock(batch.product_id, tenantId, -qty);
    productRepository.updateStatus(batch.product_id, tenantId);
    batchRepository.update(id, tenantId, { quantity: 0, status: 'returned' });

    stockMovementRepository.create({
      id: uuid(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString(),
      type: 'Return to Supplier',
      sku: batch.sku,
      product_name: batch.product_name,
      quantity: -qty,
      reference_no: id,
      note: `Batch ${batch.batch_number} returned to supplier`,
      actor: `${actor.name} (${actor.role})`,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'BATCH_RETURN_SUPPLIER',
      entity: 'Batch',
      entityId: id,
      previousValue: { quantity: qty },
      newValue: { quantity: 0, status: 'returned' },
      reason: 'Return to supplier (BR-013)',
    });

    return batchRepository.findById(id, tenantId);
  },
};
