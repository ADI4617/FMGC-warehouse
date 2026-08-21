import { Router } from 'express';
import { supplierController } from '../controllers/supplierController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { createSupplierSchema, updateSupplierSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);
router.post('/', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), validate(createSupplierSchema), supplierController.create);
router.put('/:id', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), validate(updateSupplierSchema), supplierController.update);
router.delete('/:id', authorize('Owner', 'Admin'), supplierController.delete);

export default router;
