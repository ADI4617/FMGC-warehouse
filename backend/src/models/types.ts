export type UserRole = 
  | 'Owner'
  | 'Admin'
  | 'Manager'
  | 'Warehouse'
  | 'Sales Staff'
  | 'Collection Staff'
  | 'Viewer';

export type StaffStatus = 'active' | 'pending' | 'suspended' | 'deactivated';

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone?: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  status: StaffStatus;
  lastActive: string;
  dateJoined?: string;
  permissions?: string[];
  accessModules?: string[];
}

export interface BusinessTenant {
  id: string;
  name: string;
  legalEntity: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  currency: string; // 'INR'
  plan: 'Growth' | 'Enterprise' | 'Starter';
  status: 'active' | 'trial' | 'suspended';
  createdDate: string;
  totalSkusCount?: number;
  monthlyRevenueEstimate?: number;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  category: 'Beverages' | 'Snacks' | 'Dairy' | 'Household' | 'Personal Care' | 'Groceries';
  brand: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  inStock: number;
  damaged: number;
  minThreshold: number;
  hsnCode?: string;
  gstRate: number;
  status: 'Healthy' | 'Low' | 'Out of Stock';
  aiPredictedShortage?: boolean;
  notes?: string;
}

export interface Batch {
  id: string;
  tenantId: string;
  productId: string;
  sku: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  purchasePrice: number;
  expiryDate: string;
  daysToExpiry: number;
  mfgDate: string;
  isFefoPriority?: boolean;
  status: 'healthy' | 'near_expiry' | 'expired';
}

export interface Customer {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  storeName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  zone: 'North Zone' | 'South Zone' | 'East Zone' | 'West Zone' | 'Central';
  creditLimit: number;
  outstandingBalance: number;
  overdueAmount: number;
  paymentTermsDays: number;
  status: 'active' | 'inactive';
  lastOrderDate?: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  payableBalance: number;
  totalPurchases: number;
  rating: number;
  leadTimeDays: number;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  timestamp: string;
  timeFormatted: string;
  type: 'Purchase' | 'Sale' | 'Adj' | 'Return' | 'Damage';
  sku: string;
  productName: string;
  quantity: number;
  referenceNo: string;
  note?: string;
  actor: string;
}

export interface SaleItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  freeQuantity?: number;
  unitPrice: number;
  discountPercent?: number;
  totalAmount: number;
  batchNumber?: string;
}

export interface SaleTransaction {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  storeName: string;
  date: string;
  time: string;
  items: SaleItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod: 'Cash' | 'Credit' | 'Bank Transfer' | 'UPI';
  paymentStatus: 'Paid' | 'Partial' | 'Unpaid';
  createdBy: string;
}

export interface PurchaseItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  freeQuantity: number;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string;
  totalAmount: number;
}

export interface PurchaseTransaction {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: PurchaseItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  isAiScanned?: boolean;
  status: 'Draft' | 'Confirmed' | 'Cancelled';
  documentUrl?: string;
}

export interface PaymentCollection {
  id: string;
  tenantId: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod: 'Cash' | 'Cheque' | 'UPI' | 'NEFT/RTGS';
  date: string;
  time: string;
  recordedBy: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  ipAddress?: string;
}

export interface PredictiveInsight {
  id: string;
  tenantId: string;
  type: 'reorder' | 'trend' | 'expiry' | 'collection';
  title: string;
  description: string;
  sku?: string;
  actionLabel?: string;
  actionPayload?: any;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
}

export interface ExtractedInvoiceItem {
  id: string;
  extractedName: string;
  matchedProductId?: string;
  matchedProductName?: string;
  matchedSku?: string;
  matchConfidence: number;
  matchStatus: 'Matched' | 'Uncertain' | 'Unmatched';
  quantity: number;
  rate: number;
  batchNumber: string;
  expiryDate: string;
  isExpiryMissing?: boolean;
}

export interface ExtractedInvoiceData {
  invoiceNumber: string;
  supplierName: string;
  supplierId?: string;
  date: string;
  totalAmount: number;
  items: ExtractedInvoiceItem[];
  rawImageUrl?: string;
  status: 'processing' | 'ready_for_review' | 'confirmed';
}
