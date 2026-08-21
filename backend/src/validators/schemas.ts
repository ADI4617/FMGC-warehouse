import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  plan: z.enum(['Growth', 'Enterprise', 'Starter']).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Valid email required'),
});

const userRoles = ['Owner', 'Admin', 'Manager', 'Warehouse', 'Sales Staff', 'Collection Staff', 'Viewer'] as const;
const productCategories = ['Beverages', 'Snacks', 'Dairy', 'Household', 'Personal Care', 'Groceries'] as const;
const customerZones = ['North Zone', 'South Zone', 'East Zone', 'West Zone', 'Central'] as const;
const paymentMethods = ['Cash', 'Credit', 'Bank Transfer', 'UPI'] as const;
const collectionMethods = ['Cash', 'Cheque', 'UPI', 'NEFT/RTGS'] as const;

export const addStaffSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  role: z.enum(userRoles),
  department: z.string().optional(),
  status: z.enum(['active', 'pending', 'suspended', 'deactivated']).optional(),
});

export const updateStaffSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  role: z.enum(userRoles).optional(),
  department: z.string().optional(),
  status: z.enum(['active', 'pending', 'suspended', 'deactivated']).optional(),
});

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU required'),
  name: z.string().min(1, 'Product name required'),
  category: z.enum(productCategories).optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
  purchasePrice: z.number().min(0).default(0),
  sellingPrice: z.number().min(0).default(0),
  mrp: z.number().min(0).default(0),
  inStock: z.number().int().min(0).default(0),
  damaged: z.number().int().min(0).default(0),
  minThreshold: z.number().int().min(0).default(0),
  hsnCode: z.string().optional(),
  gstRate: z.number().min(0).default(0),
  status: z.enum(['Healthy', 'Low', 'Out of Stock']).optional(),
  notes: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name required'),
  storeName: z.string().optional().default(''),
  contactPerson: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  address: z.string().optional().default(''),
  zone: z.enum(customerZones).optional(),
  creditLimit: z.number().min(0).default(0),
  outstandingBalance: z.number().min(0).default(0),
  overdueAmount: z.number().min(0).default(0),
  paymentTermsDays: z.number().int().min(0).default(30),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const createSupplierSchema = z.object({
  name: z.string().min(1, 'Supplier name required'),
  contactPerson: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  email: z.string().optional().default(''),
  gstin: z.string().optional().default(''),
  address: z.string().optional().default(''),
  payableBalance: z.number().min(0).default(0),
  totalPurchases: z.number().min(0).default(0),
  rating: z.number().min(0).max(5).default(0),
  leadTimeDays: z.number().int().min(0).default(0),
});

export const updateSupplierSchema = createSupplierSchema.partial();

const saleItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1),
  freeQuantity: z.number().int().min(0).optional().default(0),
  unitPrice: z.number().min(0),
  discountPercent: z.number().min(0).max(100).optional().default(0),
  totalAmount: z.number().min(0),
  batchNumber: z.string().optional(),
});

export const createSaleSchema = z.object({
  customerId: z.string().min(1, 'Customer required'),
  customerName: z.string().min(1),
  storeName: z.string().optional().default(''),
  date: z.string().min(1),
  items: z.array(saleItemSchema).min(1, 'At least one item required'),
  subtotal: z.number().min(0),
  discountAmount: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0),
  amountPaid: z.number().min(0).default(0),
  balanceDue: z.number().min(0).default(0),
  paymentMethod: z.enum(paymentMethods),
  paymentStatus: z.enum(['Paid', 'Partial', 'Unpaid']).default('Paid'),
  createdBy: z.string().optional(),
});

const purchaseItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1),
  freeQuantity: z.number().int().min(0).default(0),
  unitPrice: z.number().min(0),
  batchNumber: z.string().min(1),
  expiryDate: z.string().min(1),
  totalAmount: z.number().min(0),
});

export const createPurchaseSchema = z.object({
  supplierId: z.string().min(1, 'Supplier required'),
  supplierName: z.string().min(1),
  date: z.string().min(1),
  items: z.array(purchaseItemSchema).min(1, 'At least one item required'),
  totalAmount: z.number().min(0),
  paymentStatus: z.enum(['Paid', 'Pending', 'Partial']).default('Pending'),
  isAiScanned: z.boolean().optional().default(false),
  status: z.enum(['Draft', 'Confirmed', 'Cancelled']).default('Confirmed'),
  documentUrl: z.string().optional(),
});

export const recordCollectionSchema = z.object({
  customerId: z.string().min(1, 'Customer required'),
  amount: z.number().positive('Amount must be positive'),
  paymentMethod: z.enum(collectionMethods),
  notes: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product required'),
  batchNumber: z.string().optional().default(''),
  quantityDelta: z.number().int('Must be an integer'),
  reason: z.string().min(1, 'Reason required'),
  isDamage: z.boolean().optional().default(false),
});

export const batchActionSchema = z.object({
  batchId: z.string().min(1, 'Batch ID required'),
  discountPercent: z.number().min(0).max(100).optional(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1, 'Message required'),
});

export const updateTenantSchema = z.object({
  name: z.string().optional(),
  legalEntity: z.string().optional(),
  gstin: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  currency: z.string().optional(),
  plan: z.enum(['Growth', 'Enterprise', 'Starter']).optional(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});
