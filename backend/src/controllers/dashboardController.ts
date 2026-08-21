import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService.js';
import { sendSuccess } from '../utils/response.js';

export const dashboardController = {
  getKpis(req: Request, res: Response, next: NextFunction) {
    try {
      const kpis = dashboardService.getKpis(req.user!.tenantId);
      sendSuccess(res, kpis);
    } catch (err) { next(err); }
  },

  getRevenueChart(req: Request, res: Response, next: NextFunction) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 7;
      const chart = dashboardService.getRevenueChart(req.user!.tenantId, days);
      sendSuccess(res, chart);
    } catch (err) { next(err); }
  },

  getRecentMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const movements = dashboardService.getRecentMovements(req.user!.tenantId, limit);
      sendSuccess(res, movements);
    } catch (err) { next(err); }
  },

  getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const insights = dashboardService.getInsights(req.user!.tenantId);
      sendSuccess(res, insights);
    } catch (err) { next(err); }
  },
};
