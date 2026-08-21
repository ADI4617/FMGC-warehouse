import { Request, Response, NextFunction } from 'express';
import {
  authService,
  staffService,
  inventoryService,
  salesService,
  purchaseService,
  collectionService,
  customerService,
  supplierService,
  dashboardService,
  auditService
} from '../services/allServices.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { productRepository, customerRepository, supplierRepository } from '../repositories/allRepositories.js';
import { tenantRepository } from '../repositories/tenantRepository.js';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password, req.ip);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (err) {
      next(err);
    }
  },

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      return sendCreated(res, result, 'Business created successfully');
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const staffList = staffService.getStaff(user.tenantId);
      const found = staffList.find(s => s.id === user.userId) || staffList[0];
      const tenant = tenantRepository.findById(user.tenantId);
      return sendSuccess(res, { user: found, tenant });
    } catch (err) {
      next(err);
    }
  }
};

export const staffController = {
  getStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const list = staffService.getStaff(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  async inviteStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await staffService.inviteStaff(req.user!.tenantId, req.body);
      return sendCreated(res, result, 'Staff invited successfully');
    } catch (err) {
      next(err);
    }
  },

  updateStaff(req: Request, res: Response, next: NextFunction) {
    try {
      const result = staffService.updateStaff(req.user!.tenantId, req.params.id, req.body);
      return sendSuccess(res, result, 'Staff updated successfully');
    } catch (err) {
      next(err);
    }
  }
};

export const productController = {
  getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const list = inventoryService.getProducts(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const count = productRepository.findAll(req.user!.tenantId).length;
      const id = 'prod-' + (count + 1);
      const product = {
        id,
        tenant_id: req.user!.tenantId,
        sku: req.body.sku,
        name: req.body.name,
        category: req.body.category || 'General',
        brand: req.body.brand || '',
        unit: req.body.unit || 'Piece',
        purchase_price: req.body.purchasePrice || 0,
        selling_price: req.body.sellingPrice || 0,
        mrp: req.body.mrp || 0,
        in_stock: req.body.inStock || 0,
        damaged: req.body.damaged || 0,
        min_threshold: req.body.minThreshold || 0,
        hsn_code: req.body.hsnCode || '',
        gst_rate: req.body.gstRate || 0,
        status: req.body.status || 'Healthy',
        ai_predicted_shortage: 0,
        notes: req.body.notes || null
      };
      productRepository.create(product);
      return sendCreated(res, { ...req.body, id, tenantId: req.user!.tenantId }, 'Product created');
    } catch (err) {
      next(err);
    }
  },

  updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const updates: any = {};
      if (req.body.name) updates.name = req.body.name;
      if (req.body.sellingPrice !== undefined) updates.selling_price = req.body.sellingPrice;
      if (req.body.purchasePrice !== undefined) updates.purchase_price = req.body.purchasePrice;
      if (req.body.inStock !== undefined) updates.in_stock = req.body.inStock;
      if (req.body.minThreshold !== undefined) updates.min_threshold = req.body.minThreshold;
      if (req.body.status) updates.status = req.body.status;
      if (req.body.notes) updates.notes = req.body.notes;

      productRepository.update(req.params.id, req.user!.tenantId, updates);
      return sendSuccess(res, { success: true }, 'Product updated');
    } catch (err) {
      next(err);
    }
  },

  deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      productRepository.delete(req.params.id, req.user!.tenantId);
      return sendSuccess(res, { success: true }, 'Product removed');
    } catch (err) {
      next(err);
    }
  }
};

export const inventoryController = {
  getBatches(req: Request, res: Response, next: NextFunction) {
    try {
      const list = inventoryService.getBatches(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const list = inventoryService.getMovements(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  adjustStock(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = inventoryService.adjustStock(req.user!.tenantId, actor, req.body);
      return sendSuccess(res, result, 'Stock adjusted');
    } catch (err) {
      next(err);
    }
  },

  applyExpiryDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const { batchId, discountPercent } = req.body;
      const result = inventoryService.applyExpiryDiscount(req.user!.tenantId, actor, batchId, discountPercent || 20);
      return sendSuccess(res, result, 'FEFO Discount applied');
    } catch (err) {
      next(err);
    }
  },

  writeOffBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const { batchId } = req.body;
      const result = inventoryService.writeOffBatch(req.user!.tenantId, actor, batchId);
      return sendSuccess(res, result, 'Batch written off');
    } catch (err) {
      next(err);
    }
  },

  returnBatchToSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const { batchId } = req.body;
      const result = inventoryService.returnBatchToSupplier(req.user!.tenantId, actor, batchId);
      return sendSuccess(res, result, 'Batch marked for return to supplier');
    } catch (err) {
      next(err);
    }
  }
};

export const salesController = {
  getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const list = salesService.getSales(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  createSale(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = salesService.createSale(req.user!.tenantId, actor, req.body);
      return sendCreated(res, result, 'Sale recorded successfully');
    } catch (err) {
      next(err);
    }
  }
};

export const purchaseController = {
  getPurchases(req: Request, res: Response, next: NextFunction) {
    try {
      const list = purchaseService.getPurchases(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  createPurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = purchaseService.createPurchase(req.user!.tenantId, actor, req.body);
      return sendCreated(res, result, 'Purchase order confirmed and stock updated');
    } catch (err) {
      next(err);
    }
  }
};

export const collectionController = {
  getCollections(req: Request, res: Response, next: NextFunction) {
    try {
      const list = collectionService.getCollections(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = collectionService.recordPayment(req.user!.tenantId, actor, req.body);
      return sendCreated(res, result, 'Payment collection recorded');
    } catch (err) {
      next(err);
    }
  }
};

export const customerController = {
  getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const list = customerService.getCustomers(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = customerService.createCustomer(req.user!.tenantId, actor, req.body);
      return sendCreated(res, result, 'Customer added');
    } catch (err) {
      next(err);
    }
  }
};

export const supplierController = {
  getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const list = supplierService.getSuppliers(req.user!.tenantId);
      return sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  },

  createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const actor = req.user!.email;
      const result = supplierService.createSupplier(req.user!.tenantId, actor, req.body);
      return sendCreated(res, result, 'Supplier registered');
    } catch (err) {
      next(err);
    }
  }
};

export const dashboardController = {
  getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = dashboardService.getStats(req.user!.tenantId);
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }
};

export const auditController = {
  getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = auditService.getLogs(req.user!.tenantId);
      return sendSuccess(res, logs);
    } catch (err) {
      next(err);
    }
  }
};

export const tenantController = {
  getTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = tenantRepository.findById(req.user!.tenantId);
      return sendSuccess(res, tenant);
    } catch (err) {
      next(err);
    }
  },

  updateTenant(req: Request, res: Response, next: NextFunction) {
    try {
      tenantRepository.update(req.user!.tenantId, req.body);
      const updated = tenantRepository.findById(req.user!.tenantId);
      return sendSuccess(res, updated, 'Organization settings saved');
    } catch (err) {
      next(err);
    }
  }
};
