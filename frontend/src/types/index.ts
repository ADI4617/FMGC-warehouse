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
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: string;
  avatar: string;
  status: StaffStatus;
  lastActive: string;
  dateJoined?: string;
  permissions?: string[];
  tenantId?: string;
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
  currency: string;
  plan: 'Growth' | 'Enterprise' | 'Starter';
  status: 'active' | 'trial' | 'suspended';
  createdDate: string;
  totalSkusCount?: number;
  monthlyRevenueEstimate?: number;
}

export type AppModuleId =
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'suppliers'
  | 'purchases'
  | 'ai_invoice_scanner'
  | 'inventory'
  | 'batch_expiry'
  | 'sales'
  | 'payments'
  | 'collections'
  | 'returns'
  | 'reports'
  | 'ai_assistant'
  | 'staff'
  | 'settings'
  | 'audit_logs'
  | 'data_export';

export interface RolePermissionRule {
  moduleId: AppModuleId;
  moduleName: string;
  category: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
}

export interface RoleDefinition {
  id: UserRole;
  title: string;
  tagline: string;
  description: string;
  userCount: number;
  isElevated: boolean;
  badgeColor: string;
  allowedModules: string[];
}

export interface ElevatedActionRequest {
  actionName: string;
  description: string;
  resourceType: string;
  resourceId: string;
  impactWarning: string;
  onConfirm: () => void;
}

export interface Product {
  id: string;
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
  gstRate: number; // percentage e.g. 5, 12, 18
  status: 'Healthy' | 'Low' | 'Out of Stock';
  aiPredictedShortage?: boolean;
  notes?: string;
}

export interface Batch {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  purchasePrice: number;
  expiryDate: string; // YYYY-MM-DD
  daysToExpiry: number;
  mfgDate: string;
  isFefoPriority?: boolean;
  status: 'healthy' | 'near_expiry' | 'expired';
}

export interface Customer {
  id: string;
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
  timestamp: string;
  timeFormatted: string;
  type: 'Purchase' | 'Sale' | 'Adj' | 'Return' | 'Damage';
  sku: string;
  productName: string;
  quantity: number; // positive or negative
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

export interface ExtractedInvoiceItem {
  id: string;
  extractedName: string;
  matchedProductId?: string;
  matchedProductName?: string;
  matchedSku?: string;
  matchConfidence: number; // 0 to 100
  matchStatus: 'Matched' | 'Uncertain' | 'Unmatched';
  quantity: number;
  rate: number;
  batchNumber: string;
  expiryDate: string;
  isExpiryMissing?: boolean;
  suggestedMatches?: {
    productId: string;
    sku: string;
    name: string;
    confidence: number;
  }[];
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

export interface PaymentCollection {
  id: string;
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
  type: 'reorder' | 'trend' | 'expiry' | 'collection';
  title: string;
  description: string;
  sku?: string;
  actionLabel?: string;
  actionPayload?: any;
  severity: 'high' | 'medium' | 'info';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredData?: {
    type: 'pending_invoices' | 'top_products' | 'expiry_risks' | 'reorder_summary';
    title: string;
    totalHighlight?: string;
    items: {
      label: string;
      value: string | number;
      percentage?: number;
      badge?: string;
      color?: string;
    }[];
    actionButtons?: {
      label: string;
      icon: string;
      actionType: string;
      payload?: any;
    }[];
  };
}
