import { Request, Response, NextFunction } from 'express';
import { saleService } from '../services/saleService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const saleController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, customerId, startDate, endDate, paymentStatus } = req.query as Record<string, string>;
      const sales = saleService.getAll(req.user!.tenantId, { search, customerId, startDate, endDate, paymentStatus });
      sendSuccess(res, sales);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = saleService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, sale);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = saleService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, sale, 'Sale created');
    } catch (err) { next(err); }
  },
};
