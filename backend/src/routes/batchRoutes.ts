import { Router } from 'express';
import { batchController } from '../controllers/batchController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { batchActionSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', batchController.getAll);
router.get('/:id', batchController.getById);
router.get('/product/:productId', batchController.getByProduct);

router.post('/', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), batchController.create);
router.patch('/:id/discount', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), validate(batchActionSchema), batchController.applyDiscount);
router.patch('/:id/write-off', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), batchController.writeOff);
router.patch('/:id/return', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), batchController.returnToSupplier);

export default router;
