import { Router } from 'express';
import { tenantController } from '../controllers/tenantController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { updateTenantSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', tenantController.get);
router.put('/', authorize('Owner', 'Admin'), validate(updateTenantSchema), tenantController.update);

export default router;
