import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { createProductSchema, updateProductSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), validate(createProductSchema), productController.create);
router.put('/:id', authorize('Owner', 'Admin', 'Manager', 'Warehouse'), validate(updateProductSchema), productController.update);
router.delete('/:id', authorize('Owner', 'Admin'), productController.delete);

export default router;
