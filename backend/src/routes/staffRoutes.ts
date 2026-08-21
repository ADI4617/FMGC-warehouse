import { Router } from 'express';
import { staffController } from '../controllers/staffController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { addStaffSchema, updateStaffSchema } from '../validators/schemas.js';

const router = Router();

// All staff routes require authentication
router.use(authenticate);

router.get('/', staffController.getAll);
router.get('/:id', staffController.getById);

// Only Owner/Admin can mutate staff (BR-017)
router.post('/', authorize('Owner', 'Admin'), validate(addStaffSchema), staffController.add);
router.put('/:id', authorize('Owner', 'Admin'), validate(updateStaffSchema), staffController.update);
router.patch('/:id/suspend', authorize('Owner', 'Admin'), staffController.suspend);
router.patch('/:id/reactivate', authorize('Owner', 'Admin'), staffController.reactivate);
router.patch('/:id/deactivate', authorize('Owner', 'Admin'), staffController.deactivate);
router.delete('/:id', authorize('Owner', 'Admin'), staffController.delete);

export default router;
