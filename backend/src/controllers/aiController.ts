import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

export const aiController = {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const reply = await aiService.chat(req.user!.tenantId, message);
      sendSuccess(res, { reply });
    } catch (err) { next(err); }
  },

  async scanInvoice(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) throw AppError.badRequest('imageBase64 is required');
      const result = await aiService.scanInvoice(req.user!.tenantId, imageBase64, mimeType);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },

  async getOptimizations(req: Request, res: Response, next: NextFunction) {
    try {
      const recommendations = await aiService.getOptimizations(req.user!.tenantId);
      sendSuccess(res, recommendations);
    } catch (err) { next(err); }
  },
};
