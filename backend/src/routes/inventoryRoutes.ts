import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { stockAdjustmentSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/movements', inventoryController.getMovements);
router.post(
  '/adjust',
  authorize('Owner', 'Admin', 'Manager', 'Warehouse'),
  validate(stockAdjustmentSchema),
  inventoryController.adjust
);

export default router;
