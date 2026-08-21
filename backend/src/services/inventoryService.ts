import { v4 as uuid } from 'uuid';
import { productRepository } from '../repositories/productRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const inventoryService = {
  getMovements(tenantId: string, opts?: { sku?: string; type?: string; search?: string; limit?: number }) {
    return stockMovementRepository.findByTenant(tenantId, opts);
  },

  adjust(tenantId: string, data: {
    productId: string;
    batchNumber?: string;
    quantityDelta: number;
    reason: string;
    isDamage?: boolean;
  }, actor: { name: string; role: string }) {
    const product = productRepository.findById(data.productId, tenantId);
    if (!product) throw AppError.notFound('Product not found');

    if (data.isDamage) {
      // Damage: decrease sellable stock, increase damaged count
      productRepository.adjustStock(data.productId, tenantId, -Math.abs(data.quantityDelta), Math.abs(data.quantityDelta));
    } else {
      productRepository.adjustStock(data.productId, tenantId, data.quantityDelta);
    }
    productRepository.updateStatus(data.productId, tenantId);

    const movementId = uuid();
    stockMovementRepository.create({
      id: movementId,
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString(),
      type: data.isDamage ? 'Damage' : data.quantityDelta > 0 ? 'Adjustment In' : 'Adjustment Out',
      sku: product.sku,
      product_name: product.name,
      quantity: data.quantityDelta,
      reference_no: data.batchNumber ?? 'MANUAL',
      note: data.reason,
      actor: `${actor.name} (${actor.role})`,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'STOCK_ADJUSTMENT',
      entity: 'Product',
      entityId: data.productId,
      previousValue: { in_stock: product.in_stock, damaged: product.damaged },
      newValue: { quantityDelta: data.quantityDelta, isDamage: data.isDamage },
      reason: data.reason,
    });

    return productRepository.findById(data.productId, tenantId);
  },
};
