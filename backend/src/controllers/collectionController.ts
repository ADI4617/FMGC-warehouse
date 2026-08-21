import { Request, Response, NextFunction } from 'express';
import { collectionService } from '../services/collectionService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const collectionController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId, search, startDate, endDate } = req.query as Record<string, string>;
      const collections = collectionService.getAll(req.user!.tenantId, { customerId, search, startDate, endDate });
      sendSuccess(res, collections);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const collection = collectionService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, collection);
    } catch (err) { next(err); }
  },

  record(req: Request, res: Response, next: NextFunction) {
    try {
      const collection = collectionService.record(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, collection, 'Collection recorded');
    } catch (err) { next(err); }
  },
};
