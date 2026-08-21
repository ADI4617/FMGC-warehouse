import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(AppError.forbidden(`Role '${req.user.role}' does not have access to this resource`));
    }
    next();
  };
}
