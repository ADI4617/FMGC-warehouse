import { Request, Response, NextFunction } from 'express';
import { supplierService } from '../services/supplierService.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const supplierController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search } = req.query as Record<string, string>;
      const suppliers = supplierService.getAll(req.user!.tenantId, { search });
      sendSuccess(res, suppliers);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = supplierService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, supplier);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = supplierService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, supplier, 'Supplier created');
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = supplierService.update(req.params.id, req.user!.tenantId, req.body, actor(req));
      sendSuccess(res, supplier, 'Supplier updated');
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      supplierService.delete(req.params.id, req.user!.tenantId, actor(req));
      sendNoContent(res);
    } catch (err) { next(err); }
  },
};
