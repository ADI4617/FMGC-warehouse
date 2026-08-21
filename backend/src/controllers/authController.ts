import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { sendSuccess, sendCreated } from '../utils/response.js';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      sendCreated(res, result, 'Account created successfully');
    } catch (err) { next(err); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      sendSuccess(res, result, 'Login successful');
    } catch (err) { next(err); }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      sendSuccess(res, null, result.message);
    } catch (err) { next(err); }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = authService.getProfile(req.user!.userId);
      sendSuccess(res, result);
    } catch (err) { next(err); }
  },
};
