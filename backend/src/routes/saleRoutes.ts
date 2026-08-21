import { Router } from 'express';
import { saleController } from '../controllers/saleController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { createSaleSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.post(
  '/',
  authorize('Owner', 'Admin', 'Manager', 'Sales Staff'),
  validate(createSaleSchema),
  saleController.create
);

export default router;
