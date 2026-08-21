import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/kpis', dashboardController.getKpis);
router.get('/revenue-chart', dashboardController.getRevenueChart);
router.get('/recent-movements', dashboardController.getRecentMovements);
router.get('/insights', dashboardController.getInsights);

export default router;
