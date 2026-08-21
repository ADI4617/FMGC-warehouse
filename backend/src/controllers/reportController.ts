import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/reportService.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

export const reportController = {
  sales(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query as Record<string, string>;
      if (!startDate || !endDate) throw AppError.badRequest('startDate and endDate are required');
      const report = reportService.salesSummary(req.user!.tenantId, startDate, endDate);
      sendSuccess(res, report);
    } catch (err) { next(err); }
  },

  inventory(req: Request, res: Response, next: NextFunction) {
    try {
      const report = reportService.inventoryReport(req.user!.tenantId);
      sendSuccess(res, report);
    } catch (err) { next(err); }
  },

  collections(req: Request, res: Response, next: NextFunction) {
    try {
      const { startDate, endDate } = req.query as Record<string, string>;
      if (!startDate || !endDate) throw AppError.badRequest('startDate and endDate are required');
      const report = reportService.collectionsReport(req.user!.tenantId, startDate, endDate);
      sendSuccess(res, report);
    } catch (err) { next(err); }
  },

  receivables(req: Request, res: Response, next: NextFunction) {
    try {
      const report = reportService.receivablesReport(req.user!.tenantId);
      sendSuccess(res, report);
    } catch (err) { next(err); }
  },
};
