import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js';

function actor(req: Request) {
  return { name: req.user!.email, role: req.user!.role };
}

export const productController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, status } = req.query as Record<string, string>;
      const products = productService.getAll(req.user!.tenantId, { search, category, status });
      sendSuccess(res, products);
    } catch (err) { next(err); }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.getById(req.params.id, req.user!.tenantId);
      sendSuccess(res, product);
    } catch (err) { next(err); }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.create(req.user!.tenantId, req.body, actor(req));
      sendCreated(res, product, 'Product created');
    } catch (err) { next(err); }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = productService.update(req.params.id, req.user!.tenantId, req.body, actor(req));
      sendSuccess(res, product, 'Product updated');
    } catch (err) { next(err); }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      productService.delete(req.params.id, req.user!.tenantId, actor(req));
      sendNoContent(res);
    } catch (err) { next(err); }
  },
};
