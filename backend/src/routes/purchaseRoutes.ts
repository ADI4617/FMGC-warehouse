import { Router } from 'express';
import { purchaseController } from '../controllers/purchaseController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { createPurchaseSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', purchaseController.getAll);
router.get('/:id', purchaseController.getById);
router.post(
  '/',
  authorize('Owner', 'Admin', 'Manager', 'Warehouse'),
  validate(createPurchaseSchema),
  purchaseController.create
);
router.patch('/:id/confirm', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), purchaseController.confirm);

export default router;
