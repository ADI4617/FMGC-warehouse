import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/rbac.js';
import { validate } from '../middlewares/validator.js';
import {
  loginSchema,
  signupSchema,
  createProductSchema,
  updateProductSchema,
  createCustomerSchema,
  createSupplierSchema,
  createSaleSchema,
  createPurchaseSchema,
  recordCollectionSchema,
  stockAdjustmentSchema,
  batchActionSchema,
  addStaffSchema,
  updateStaffSchema,
  updateTenantSchema
} from '../validators/schemas.js';
import {
  authController,
  staffController,
  productController,
  inventoryController,
  salesController,
  purchaseController,
  collectionController,
  customerController,
  supplierController,
  dashboardController,
  auditController,
  tenantController
} from '../controllers/allControllers.js';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, message: 'FMCG Distro Backend API is active', timestamp: new Date().toISOString() });
});

// Auth Routes (Public)
apiRouter.post('/auth/login', validate(loginSchema), authController.login);
apiRouter.post('/auth/signup', validate(signupSchema), authController.signup);

// Protected Routes (Require Bearer Token)
apiRouter.use(authenticate);

// Current User & Tenant Profile
apiRouter.get('/auth/me', authController.me);

// Dashboard KPIs
apiRouter.get('/dashboard', dashboardController.getDashboard);

// Products & Catalog
apiRouter.get('/products', productController.getProducts);
apiRouter.post('/products', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(createProductSchema), productController.createProduct);
apiRouter.put('/products/:id', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(updateProductSchema), productController.updateProduct);
apiRouter.delete('/products/:id', authorize('Owner', 'Admin'), productController.deleteProduct);

// Inventory & Batches
apiRouter.get('/inventory/batches', inventoryController.getBatches);
apiRouter.get('/inventory/movements', inventoryController.getMovements);
apiRouter.post('/inventory/adjust', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(stockAdjustmentSchema), inventoryController.adjustStock);
apiRouter.post('/inventory/expiry-discount', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(batchActionSchema), inventoryController.applyExpiryDiscount);
apiRouter.post('/inventory/write-off', authorize('Owner', 'Admin', 'Warehouse'), validate(batchActionSchema), inventoryController.writeOffBatch);
apiRouter.post('/inventory/return-to-supplier', authorize('Owner', 'Admin', 'Warehouse'), validate(batchActionSchema), inventoryController.returnBatchToSupplier);

// Sales & POS
apiRouter.get('/sales', salesController.getSales);
apiRouter.post('/sales', authorize('Owner', 'Admin', 'Sales Staff', 'Manager'), validate(createSaleSchema), salesController.createSale);

// Purchases & Inward
apiRouter.get('/purchases', purchaseController.getPurchases);
apiRouter.post('/purchases', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(createPurchaseSchema), purchaseController.createPurchase);

// Collections
apiRouter.get('/collections', collectionController.getCollections);
apiRouter.post('/collections', authorize('Owner', 'Admin', 'Collection Staff', 'Manager'), validate(recordCollectionSchema), collectionController.recordPayment);

// Customers
apiRouter.get('/customers', customerController.getCustomers);
apiRouter.post('/customers', authorize('Owner', 'Admin', 'Sales Staff', 'Collection Staff', 'Manager'), validate(createCustomerSchema), customerController.createCustomer);

// Suppliers
apiRouter.get('/suppliers', supplierController.getSuppliers);
apiRouter.post('/suppliers', authorize('Owner', 'Admin', 'Warehouse', 'Manager'), validate(createSupplierSchema), supplierController.createSupplier);

// Staff & Roles
apiRouter.get('/staff', authorize('Owner', 'Admin', 'Manager'), staffController.getStaff);
apiRouter.post('/staff', authorize('Owner', 'Admin'), validate(addStaffSchema), staffController.inviteStaff);
apiRouter.put('/staff/:id', authorize('Owner', 'Admin'), validate(updateStaffSchema), staffController.updateStaff);

// Audit Logs
apiRouter.get('/audit-logs', authorize('Owner', 'Admin'), auditController.getLogs);

// Tenant & Settings
apiRouter.get('/tenant', tenantController.getTenant);
apiRouter.put('/tenant', authorize('Owner', 'Admin'), validate(updateTenantSchema), tenantController.updateTenant);
