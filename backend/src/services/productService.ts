import { v4 as uuid } from 'uuid';
import { productRepository } from '../repositories/productRepository.js';
import { AppError } from '../utils/AppError.js';
import { auditService } from './auditService.js';

export const productService = {
  getAll(tenantId: string, opts?: { search?: string; category?: string; status?: string }) {
    return productRepository.findByTenant(tenantId, opts);
  },

  getById(id: string, tenantId: string) {
    const p = productRepository.findById(id, tenantId);
    if (!p) throw AppError.notFound('Product not found');
    return p;
  },

  create(tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = productRepository.findBySku(data.sku, tenantId);
    if (existing) throw AppError.conflict(`SKU '${data.sku}' already exists`);

    const id = uuid();
    const inStock = data.inStock ?? 0;
    let status = 'Healthy';
    if (inStock === 0) status = 'Out of Stock';
    else if (inStock <= (data.minThreshold ?? 0)) status = 'Low';

    productRepository.create({
      id,
      tenant_id: tenantId,
      sku: data.sku,
      name: data.name,
      category: data.category ?? null,
      brand: data.brand ?? null,
      unit: data.unit ?? null,
      purchase_price: data.purchasePrice ?? 0,
      selling_price: data.sellingPrice ?? 0,
      mrp: data.mrp ?? 0,
      in_stock: inStock,
      damaged: data.damaged ?? 0,
      min_threshold: data.minThreshold ?? 0,
      hsn_code: data.hsnCode ?? null,
      gst_rate: data.gstRate ?? 0,
      status: data.status ?? status,
      ai_predicted_shortage: 0,
      notes: data.notes ?? null,
    });

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      newValue: { sku: data.sku, name: data.name },
    });

    return productRepository.findById(id, tenantId);
  },

  update(id: string, tenantId: string, data: any, actor: { name: string; role: string }) {
    const existing = productRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Product not found');

    if (data.sku && data.sku !== existing.sku) {
      const skuConflict = productRepository.findBySku(data.sku, tenantId);
      if (skuConflict) throw AppError.conflict(`SKU '${data.sku}' already exists`);
    }

    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
      sku: 'sku', name: 'name', category: 'category', brand: 'brand', unit: 'unit',
      purchasePrice: 'purchase_price', sellingPrice: 'selling_price', mrp: 'mrp',
      inStock: 'in_stock', damaged: 'damaged', minThreshold: 'min_threshold',
      hsnCode: 'hsn_code', gstRate: 'gst_rate', notes: 'notes', status: 'status',
    };
    for (const [key, col] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) updates[col] = data[key];
    }

    productRepository.update(id, tenantId, updates);
    productRepository.updateStatus(id, tenantId);

    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: id,
      previousValue: { name: existing.name, in_stock: existing.in_stock },
      newValue: updates,
    });

    return productRepository.findById(id, tenantId);
  },

  delete(id: string, tenantId: string, actor: { name: string; role: string }) {
    const existing = productRepository.findById(id, tenantId);
    if (!existing) throw AppError.notFound('Product not found');
    productRepository.delete(id, tenantId);
    auditService.log({
      tenantId,
      actor: actor.name,
      actorRole: actor.role,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: id,
      previousValue: { sku: existing.sku, name: existing.name },
    });
  },
};
