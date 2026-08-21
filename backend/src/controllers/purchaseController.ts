import { Request, Response, NextFunction } from 'express';
import { purchaseService } from '../services/purchaseService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const purchaseController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, supplierId, status, startDate, endDate } = req.query as Record<string, string>;
      const purchases = purchaseService.getAll(req.user!.tenantId, { search, supplierId, status, startDate, endDate });
      sendSuccess(res, purchases);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = purchaseService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, purchase);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = purchaseService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, purchase, 'Purchase created');
    } catch (err) { next(err); }
  },

  confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const purchase = purchaseService.confirm(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, purchase, 'Purchase confirmed and stock updated');
    } catch (err) { next(err); }
  },
};
