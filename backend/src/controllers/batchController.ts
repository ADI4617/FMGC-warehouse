import { Request, Response, NextFunction } from 'express';
import { batchService } from '../services/batchService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const batchController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, status } = req.query as Record<string, string>;
      const batches = batchService.getAll(req.user!.tenantId, { search, status });
      sendSuccess(res, batches);
    } catch (err) { next(err); }
  },

  getByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const batches = batchService.getByProduct(req.params.productId, req.user!.tenantId);
      sendSuccess(res, batches);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = batchService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, batch);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = batchService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, batch, 'Batch created');
    } catch (err) { next(err); }
  },

  applyDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { discountPercent } = req.body;
      const batch = batchService.applyExpiryDiscount(
        req.params.id,
        req.user!.tenantId,
        discountPercent,
        actor(req)
      );
      sendSuccess(res, batch, 'Expiry discount applied');
    } catch (err) { next(err); }
  },

  writeOff(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = batchService.writeOff(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, batch, 'Batch written off');
    } catch (err) { next(err); }
  },

  returnToSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const batch = batchService.returnToSupplier(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, batch, 'Batch returned to supplier');
    } catch (err) { next(err); }
  },
};
