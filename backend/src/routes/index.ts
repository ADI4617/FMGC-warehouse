import { Router } from 'express';
import authRoutes from './authRoutes.js';
import staffRoutes from './staffRoutes.js';
import productRoutes from './productRoutes.js';
import batchRoutes from './batchRoutes.js';
import customerRoutes from './customerRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import saleRoutes from './saleRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import collectionRoutes from './collectionRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import reportRoutes from './reportRoutes.js';
import auditRoutes from './auditRoutes.js';
import tenantRoutes from './tenantRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/products', productRoutes);
router.use('/batches', batchRoutes);
router.use('/customers', customerRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/sales', saleRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/collections', collectionRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/settings', tenantRoutes);
router.use('/ai', aiRoutes);

export default router;
