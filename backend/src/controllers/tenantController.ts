import { Request, Response, NextFunction } from 'express';
import { tenantService } from '../services/tenantService.js';
import { sendSuccess } from '../utils/response.js';

export const tenantController = {
  get(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = tenantService.getById(req.user!.tenantId);
      sendSuccess(res, tenant);
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = tenantService.update(
        req.user!.tenantId,
        req.body,
        { name: req.user!.email, role: req.user!.role }
      );
      sendSuccess(res, tenant, 'Settings updated');
    } catch (err) { next(err); }
  },
};
