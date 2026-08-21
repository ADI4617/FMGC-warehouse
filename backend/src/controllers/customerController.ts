import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customerService.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const customerController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, zone, status } = req.query as Record<string, string>;
      const customers = customerService.getAll(req.user!.tenantId, { search, zone, status });
      sendSuccess(res, customers);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = customerService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, customer);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = customerService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, customer, 'Customer created');
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = customerService.update(req.params.id, req.user!.tenantId, req.body, actor(req));
      sendSuccess(res, customer, 'Customer updated');
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      customerService.delete(req.params.id, req.user!.tenantId, actor(req));
      sendNoContent(res);
    } catch (err) { next(err); }
  },
};
