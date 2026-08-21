import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';

const router = Router();

router.use(authenticate);
router.use(authorize('Owner', 'Admin', 'Manager', 'Collection Staff', 'Viewer'));

router.get('/sales', reportController.sales);
router.get('/inventory', reportController.inventory);
router.get('/collections', reportController.collections);
router.get('/receivables', reportController.receivables);

export default router;
