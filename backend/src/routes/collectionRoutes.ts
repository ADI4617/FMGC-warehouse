import { Router } from 'express';
import { collectionController } from '../controllers/collectionController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import { recordCollectionSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.get('/', collectionController.getAll);
router.get('/:id', collectionController.getById);
router.post(
  '/',
  authorize('Owner', 'Admin', 'Manager', 'Collection Staff'),
  validate(recordCollectionSchema),
  collectionController.record
);

export default router;
