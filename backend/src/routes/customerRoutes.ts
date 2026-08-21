import { Router } from 'express';
import { customerController } from '../controllers/customerController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { createCustomerSchema, updateCustomerSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', authorize('Owner', 'Admin', 'Manager', 'Sales Staff'), validate(createCustomerSchema), customerController.create);
router.put('/:id', authorize('Owner', 'Admin', 'Manager', 'Sales Staff'), validate(updateCustomerSchema), customerController.update);
router.delete('/:id', authorize('Owner', 'Admin'), customerController.delete);

export default router;
