import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventoryService.js';
import { sendSuccess } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const inventoryController = {
  getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const { sku, type, search, limit } = req.query as Record<string, string>;
      const movements = inventoryService.getMovements(req.user!.tenantId, {
        sku, type, search,
        limit: limit ? parseInt(limit, 10) : undefined,
      });
      sendSuccess(res, movements);
    } catch (err) { next(err); }
  },

  adjust(req: Request, res: Response, next: NextFunction) {
    try {
      const product = inventoryService.adjust(req.user!.tenantId, req.body, actor(req));
      sendSuccess(res, product, 'Stock adjusted');
    } catch (err) { next(err); }
  },
};
