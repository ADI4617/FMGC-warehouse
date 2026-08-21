import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validator.js';
import { aiChatSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate);

router.post('/chat', validate(aiChatSchema), aiController.chat);
router.post('/scan-invoice', aiController.scanInvoice);
router.get('/optimizations', aiController.getOptimizations);

export default router;
