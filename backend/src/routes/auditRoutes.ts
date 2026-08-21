import { Router } from 'express';
import { auditController } from '../controllers/auditController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';

const router = Router();

router.use(authenticate);
router.use(authorize('Owner', 'Admin', 'Manager'));

router.get('/', auditController.getAll);

export default router;
