import { Request, Response, NextFunction } from 'express';
import { staffService } from '../services/staffService.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const staffController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = staffService.getAll(req.user!.tenantId);
      sendSuccess(res, staff);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const staff = staffService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, staff);
    } catch (err) { next(err); }
  },

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await staffService.add(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, result, 'Staff member added');
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = staffService.update(req.params.id, req.user!.tenantId, req.body, actor(req));
      sendSuccess(res, result, 'Staff member updated');
    } catch (err) { next(err); }
  },

  suspend(req: Request, res: Response, next: NextFunction) {
    try {
      const result = staffService.suspend(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, result, 'Staff member suspended');
    } catch (err) { next(err); }
  },

  reactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = staffService.reactivate(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, result, 'Staff member reactivated');
    } catch (err) { next(err); }
  },

  deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const result = staffService.deactivate(req.params.id, req.user!.tenantId, actor(req));
      sendSuccess(res, result, 'Staff member deactivated');
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      staffService.delete(req.params.id, req.user!.tenantId, actor(req));
      sendNoContent(res);
    } catch (err) { next(err); }
  },
};
