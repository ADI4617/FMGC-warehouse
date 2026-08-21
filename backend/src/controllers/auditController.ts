import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/auditService.js';
import { sendSuccess } from '../utils/response.js';

export const auditController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { entity, actor, action, search, startDate, endDate, limit, offset } = req.query as Record<string, string>;
      const logs = auditService.getAll(req.user!.tenantId, {
        entity, actor, action, search, startDate, endDate,
        limit: limit ? parseInt(limit, 10) : 100,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      const total = auditService.count(req.user!.tenantId);
      sendSuccess(res, { logs, total });
    } catch (err) { next(err); }
  },
};
