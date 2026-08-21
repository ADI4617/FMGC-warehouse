import {
  Product,
  Batch,
  Customer,
  Supplier,
  StockMovement,
  SaleTransaction,
  PurchaseTransaction,
  AuditLog,
  PredictiveInsight,
  ChatMessage,
  User,
  ExtractedInvoiceData,
  BusinessTenant,
  RoleDefinition,
  RolePermissionRule
} from '../types';

export const INITIAL_TENANT: BusinessTenant = {
  id: 'tnt-001',
  name: 'Apex FMCG Distributors Ltd.',
  legalEntity: 'Apex Consumer Goods Distribution Pvt Ltd',
  gstin: '27AABCA1234F1Z8',
  email: 'ops@apexfmcg.com',
  phone: '+91 22 2840 9100',
  address: 'Warehouse Block 4-C, Logistics Corridor, Andheri East',
  city: 'Mumbai',
  state: 'Maharashtra',
  currency: 'USD',
  plan: 'Enterprise',
  status: 'active',
  createdDate: '2025-04-12',
  totalSkusCount: 12,
  monthlyRevenueEstimate: 345000
};

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@apexfmcg.com',
    phone: '+91 98201 44521',
    role: 'Admin',
    department: 'Executive Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: 'Today',
    dateJoined: '2025-05-10',
    permissions: ['All Modules', 'User Provisioning', 'Audit Ledgers', 'Data Exports'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
  },
  {
    id: 'usr-2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@apexfmcg.com',
    phone: '+1 (415) 890-2100',
    role: 'Owner',
    department: 'Executive Office',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLOB9lDQ_LVO4gdlt2o1hqXMadKA61JyF6FNwOL_VEqtLBlBiuseCtWrTL9wgQ5H71Y17lsn5v6fDPq57zfTbrk-K0fSyE5r1UPwovN4krnqcmiA14c0DKGv6p3PqyTqgSo7a3nBrBbDYqkmy2EhX20YMy49WMe6diSAZvR_e1hVHxapSI_TuLX04FxOGjC6A078PuK0Wy4bi_1sNPMtOd7blFHn8rOjMM4987JUBvl4x9PY5rRxs',
    status: 'active',
    lastActive: '5 mins ago',
    dateJoined: '2025-04-12',
    permissions: ['Master Tenant Owner', 'Billing & Subscription', 'Global Config', 'Full Access'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
  },
  {
    id: 'usr-3',
    name: 'Amit Sharma',
    email: 'amit.s@apexfmcg.com',
    phone: '+91 98334 11290',
    role: 'Warehouse',
    department: 'Central Warehouse Depot',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '12 min ago',
    dateJoined: '2025-06-01',
    permissions: ['Stock Inward', 'AI Invoice Match', 'Batch & Expiry Track', 'Damage Logging'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Purchase', 'Inventory', 'AI Invoice Scanner', 'Batch & Expiry']
  },
  {
    id: 'usr-4',
    name: 'Priya Patil',
    email: 'priya.p@apexfmcg.com',
    phone: '+91 98192 77482',
    role: 'Sales Staff',
    department: 'Field Sales - West Sector',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '35 min ago',
    dateJoined: '2025-07-15',
    permissions: ['POS Billing', 'Retailer Ledger Lookup', 'Order Entry', 'Route Dispatch'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Customers']
  },
  {
    id: 'usr-5',
    name: 'Sneha Joshi',
    email: 'sneha.j@apexfmcg.com',
    phone: '+91 98721 33419',
    role: 'Collection Staff',
    department: 'Finance & Accounts',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: 'Yesterday',
    dateJoined: '2025-06-20',
    permissions: ['Cash Receipt Issue', 'Overdue Tracking', 'Credit Reconciliation', 'Collections Reports'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Customers', 'Collections', 'Reports']
  },
  {
    id: 'usr-6',
    name: 'Vikas More',
    email: 'vikas.m@apexfmcg.com',
    phone: '+91 98210 66542',
    role: 'Sales Staff',
    department: 'Field Sales - North Sector',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'pending',
    lastActive: 'Invitation sent',
    dateJoined: '2026-08-19',
    permissions: ['Pending Account Activation', 'Limited Sales Access'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales']
  },
  {
    id: 'usr-7',
    name: 'Alex Manager',
    email: 'alex.distro@fmcg-hub.com',
    phone: '+1 (415) 762-9011',
    role: 'Admin',
    department: 'Operations',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkozczMhCGx0Zxd024m8Vk8XXTVMWeKFy0RrWyR1_GHe8cZ0BBEKrqD_wJo_OSexSEzt49X0yU5i210nptAD5U9BS00KcnCG2o3qz6N9w1edOce7yqcXF5zoQ0Yd1HohPnPqiOb9HTGKRyTmUdUmubmyE8PFQ9FLMMofWqQP7hF-T3I-0l14DneOFIKvxTdsPdHVvQw8sMhAzoYKos9amwPEESDCuGIzZBESvz66BPG-dGC7sixik',
    status: 'active',
    lastActive: 'Just now',
    dateJoined: '2025-05-01',
    permissions: ['All Operational Modules', 'Staff Admin', 'Audit Logs'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
  },
  {
    id: 'usr-8',
    name: 'Marcus Vance',
    email: 'marcus.v@fmcg-hub.com',
    phone: '+1 (415) 623-1199',
    role: 'Warehouse',
    department: 'Logistics',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '12 mins ago',
    dateJoined: '2025-08-01',
    permissions: ['Stock Management', 'Purchase Receiving'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Purchase', 'Inventory', 'AI Invoice Scanner', 'Batch & Expiry']
  },
  {
    id: 'usr-9',
    name: 'David Chen',
    email: 'david.c@fmcg-hub.com',
    phone: '+1 (415) 344-8800',
    role: 'Sales Staff',
    department: 'Trade Sales',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '1 hour ago',
    dateJoined: '2025-09-10',
    permissions: ['Sales Order Issuance', 'Customer Lookup'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Customers']
  },
  {
    id: 'usr-10',
    name: 'Elena Rostova',
    email: 'elena.r@fmcg-hub.com',
    phone: '+1 (415) 551-7722',
    role: 'Collection Staff',
    department: 'Credit Control',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '3 hours ago',
    dateJoined: '2025-10-05',
    permissions: ['Payment Receipts', 'Customer Outstanding Reports'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Customers', 'Collections', 'Reports']
  },
  {
    id: 'usr-11',
    name: 'Rohan Mehta',
    email: 'rohan.m@apexfmcg.com',
    phone: '+91 98450 99211',
    role: 'Manager',
    department: 'Regional Distribution Hub',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: '45 mins ago',
    dateJoined: '2025-05-20',
    permissions: ['Sales & Purchase Approvals', 'Inventory Supervision', 'Executive Reports'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Reports', 'AI Center']
  },
  {
    id: 'usr-12',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@apexfmcg.com',
    phone: '+91 98209 11844',
    role: 'Viewer',
    department: 'Audit & Compliance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    lastActive: 'Today',
    dateJoined: '2026-01-10',
    permissions: ['Read-only Reports', 'Dashboard Analytics'],
    tenantId: 'tnt-001',
    accessModules: ['Dashboard', 'Reports']
  }
];

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: 'Owner',
    title: 'Owner / Founder',
    tagline: 'Complete sovereign authority over tenant data and configuration',
    description: 'Full unconstrained access across all business modules, financial audit ledgers, billing subscriptions, and root administrative operations.',
    userCount: 1,
    isElevated: true,
    badgeColor: '#8C733E',
    allowedModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
  },
  {
    id: 'Admin',
    title: 'Administrator',
    tagline: 'Manage users, security configuration, and operational data',
    description: 'Elevated administrative power to provision staff, adjust master stock ledgers, manage supplier accounts, and oversee end-to-end distribution workflows.',
    userCount: 2,
    isElevated: true,
    badgeColor: '#1A1A1A',
    allowedModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
  },
  {
    id: 'Manager',
    title: 'Operations Manager',
    tagline: 'Sales, Purchase, Inventory, and Executive Reports',
    description: 'Supervises commercial workflows, inventory replenishment velocity, sales pipeline targets, and performance analytics with approval capabilities.',
    userCount: 1,
    isElevated: false,
    badgeColor: '#234E3E',
    allowedModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Reports', 'AI Center']
  },
  {
    id: 'Warehouse',
    title: 'Warehouse Staff',
    tagline: 'Inventory receiving, stock batches, and purchase processing',
    description: 'Executes inbound purchase receiving, AI invoice scanner verification, physical stock counts, and FEFO expiry prioritization.',
    userCount: 2,
    isElevated: false,
    badgeColor: '#78746D',
    allowedModules: ['Dashboard', 'Purchase', 'Inventory', 'AI Invoice Scanner', 'Batch & Expiry']
  },
  {
    id: 'Sales Staff',
    title: 'Sales Staff / Rep',
    tagline: 'Retailer relationships, POS billing, and order intake',
    description: 'Field order generation, POS counter billing, retail customer credit limit monitoring, and route dispatch coordination.',
    userCount: 3,
    isElevated: false,
    badgeColor: '#9C5B23',
    allowedModules: ['Dashboard', 'Sales', 'Customers']
  },
  {
    id: 'Collection Staff',
    title: 'Collection Staff / Accountant',
    tagline: 'Payments collection, receivables ledger, and overdue tracking',
    description: 'Collects cash/cheque payments on route, issues official receipts, reconciles aging balances, and tracks customer credit risk.',
    userCount: 2,
    isElevated: false,
    badgeColor: '#234E3E',
    allowedModules: ['Dashboard', 'Customers', 'Collections', 'Reports']
  },
  {
    id: 'Viewer',
    title: 'Viewer / Stakeholder',
    tagline: 'Read-only analytics and reports inspection',
    description: 'Provides external auditors, investors, or read-only stakeholders access to business dashboard metrics and financial reporting without write rights.',
    userCount: 1,
    isElevated: false,
    badgeColor: '#5C5850',
    allowedModules: ['Dashboard', 'Reports']
  }
];

export const INITIAL_PERMISSION_MATRIX: RolePermissionRule[] = [
  { moduleId: 'dashboard', moduleName: 'Executive Dashboard', category: 'Analytics', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
  { moduleId: 'products', moduleName: 'Products Catalog', category: 'Catalog', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'customers', moduleName: 'Retailers & Accounts', category: 'Commercial', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'suppliers', moduleName: 'Suppliers Registry', category: 'Inbound', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'purchases', moduleName: 'Purchase Invoices', category: 'Inbound', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'ai_invoice_scanner', moduleName: 'AI Invoice Scanner', category: 'Inbound', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
  { moduleId: 'inventory', moduleName: 'Inventory & Warehousing', category: 'Operations', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'batch_expiry', moduleName: 'Batch & Expiry FEFO', category: 'Operations', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
  { moduleId: 'sales', moduleName: 'Sales & POS Ledger', category: 'Commercial', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'payments', moduleName: 'Payment Gateways & POS', category: 'Financial', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
  { moduleId: 'collections', moduleName: 'Collections & Receivables', category: 'Financial', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
  { moduleId: 'returns', moduleName: 'Returns & Damage Write-off', category: 'Operations', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'reports', moduleName: 'Executive Reports & P&L', category: 'Financial', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false },
  { moduleId: 'ai_assistant', moduleName: 'AI Business Advisor', category: 'AI Tools', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
  { moduleId: 'staff', moduleName: 'Staff & Roles Management', category: 'Administration', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
  { moduleId: 'settings', moduleName: 'Business Settings', category: 'Administration', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: true },
  { moduleId: 'audit_logs', moduleName: 'Audit Trail & Compliance', category: 'Administration', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
  { moduleId: 'data_export', moduleName: 'Data Export & Backup', category: 'Administration', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: true }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'BEV-092-COL',
    name: 'Sparkling Cola 500ml x24',
    category: 'Beverages',
    brand: 'FizzCo',
    unit: 'Case (24)',
    purchasePrice: 12.50,
    sellingPrice: 15.00,
    mrp: 18.00,
    inStock: 1240,
    damaged: 5,
    minThreshold: 300,
    gstRate: 18,
    hsnCode: '220210',
    status: 'Healthy',
    aiPredictedShortage: false,
    notes: 'Fast moving high velocity beverage'
  },
  {
    id: 'prod-2',
    sku: 'SNA-110-CHI',
    name: 'Potato Chips Salted 150g',
    category: 'Snacks',
    brand: 'CrunchBites',
    unit: 'Pkt',
    purchasePrice: 2.80,
    sellingPrice: 4.00,
    mrp: 4.50,
    inStock: 112,
    damaged: 2,
    minThreshold: 200,
    gstRate: 12,
    hsnCode: '200520',
    status: 'Low',
    aiPredictedShortage: true,
    notes: 'AI Alert: High weekend demand expected'
  },
  {
    id: 'prod-3',
    sku: 'DAI-405-MIL',
    name: 'UHT Full Cream Milk 1L',
    category: 'Dairy',
    brand: 'DairyFresh',
    unit: 'Tetra (1L)',
    purchasePrice: 1.10,
    sellingPrice: 1.45,
    mrp: 1.60,
    inStock: 0,
    damaged: 12,
    minThreshold: 150,
    gstRate: 5,
    hsnCode: '040120',
    status: 'Out of Stock',
    aiPredictedShortage: true,
    notes: '12 units damaged in transit on yesterday delivery'
  },
  {
    id: 'prod-4',
    sku: 'HOU-882-DET',
    name: 'Liquid Detergent 2L',
    category: 'Household',
    brand: 'CleanGlow',
    unit: 'Bottle',
    purchasePrice: 6.20,
    sellingPrice: 8.00,
    mrp: 9.50,
    inStock: 450,
    damaged: 1,
    minThreshold: 100,
    gstRate: 18,
    hsnCode: '340220',
    status: 'Healthy',
    aiPredictedShortage: false,
  },
  {
    id: 'prod-5',
    sku: 'DAI-YOG-01',
    name: 'Greek Yogurt Plain 1kg',
    category: 'Dairy',
    brand: 'DairyFresh',
    unit: 'Tub (1kg)',
    purchasePrice: 2.20,
    sellingPrice: 3.00,
    mrp: 3.50,
    inStock: 45,
    damaged: 0,
    minThreshold: 30,
    gstRate: 5,
    hsnCode: '040310',
    status: 'Low',
    aiPredictedShortage: false,
    notes: 'Batch #B992 expiring in 4 days'
  },
  {
    id: 'prod-6',
    sku: 'BEV-JUI-12',
    name: 'Orange Juice 250ml',
    category: 'Beverages',
    brand: 'TropicBurst',
    unit: 'Bottle',
    purchasePrice: 1.05,
    sellingPrice: 1.50,
    mrp: 1.75,
    inStock: 120,
    damaged: 0,
    minThreshold: 80,
    gstRate: 12,
    hsnCode: '200912',
    status: 'Healthy',
    aiPredictedShortage: false,
    notes: 'Batch #J441 expiring in 12 days'
  },
  {
    id: 'prod-7',
    sku: 'LIP-YL-250-B',
    name: 'Lipton Yellow Label Tea 250g Box',
    category: 'Groceries',
    brand: 'Lipton',
    unit: 'Box',
    purchasePrice: 2.90,
    sellingPrice: 3.80,
    mrp: 4.20,
    inStock: 340,
    damaged: 0,
    minThreshold: 100,
    gstRate: 5,
    hsnCode: '090230',
    status: 'Healthy',
  },
  {
    id: 'prod-8',
    sku: 'LIP-YL-500-J',
    name: 'Lipton Yellow Label Tea 500g Jar',
    category: 'Groceries',
    brand: 'Lipton',
    unit: 'Jar',
    purchasePrice: 5.40,
    sellingPrice: 7.20,
    mrp: 8.00,
    inStock: 180,
    damaged: 0,
    minThreshold: 60,
    gstRate: 5,
    hsnCode: '090230',
    status: 'Healthy',
  },
  {
    id: 'prod-9',
    sku: 'DOV-SOAP-100',
    name: 'Dove Soap Bar 100g Original',
    category: 'Personal Care',
    brand: 'Dove / Unilever',
    unit: 'Pack of 3',
    purchasePrice: 1.20,
    sellingPrice: 1.75,
    mrp: 2.00,
    inStock: 680,
    damaged: 2,
    minThreshold: 200,
    gstRate: 18,
    hsnCode: '340111',
    status: 'Healthy',
  },
  {
    id: 'prod-10',
    sku: 'SUN-DISH-500',
    name: 'Sunlight Dish Liq Lemon 500ml',
    category: 'Household',
    brand: 'Sunlight',
    unit: 'Bottle',
    purchasePrice: 1.60,
    sellingPrice: 2.20,
    mrp: 2.50,
    inStock: 520,
    damaged: 0,
    minThreshold: 150,
    gstRate: 18,
    hsnCode: '340220',
    status: 'Healthy',
  },
  {
    id: 'prod-11',
    sku: 'PAR-GLU-80',
    name: 'Parle-G Glucose Biscuits 80g',
    category: 'Snacks',
    brand: 'Parle',
    unit: 'Pack (10)',
    purchasePrice: 0.85,
    sellingPrice: 1.20,
    mrp: 1.30,
    inStock: 95,
    damaged: 0,
    minThreshold: 400,
    gstRate: 5,
    hsnCode: '190531',
    status: 'Low',
    aiPredictedShortage: true,
    notes: 'Depleting rapidly. Sales velocity 80 pkts/day'
  },
  {
    id: 'prod-12',
    sku: 'NES-CL-50',
    name: 'Nescafe Classic Coffee 50g',
    category: 'Groceries',
    brand: 'Nestle',
    unit: 'Glass Jar',
    purchasePrice: 2.40,
    sellingPrice: 3.20,
    mrp: 3.50,
    inStock: 260,
    damaged: 0,
    minThreshold: 80,
    gstRate: 18,
    hsnCode: '210111',
    status: 'Healthy',
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'bat-1',
    productId: 'prod-5',
    sku: 'DAI-YOG-01',
    productName: 'Greek Yogurt Plain 1kg',
    batchNumber: 'B992',
    quantity: 45,
    purchasePrice: 2.20,
    expiryDate: '2026-08-24', // 4 days away
    daysToExpiry: 4,
    mfgDate: '2026-07-24',
    isFefoPriority: true,
    status: 'near_expiry'
  },
  {
    id: 'bat-2',
    productId: 'prod-6',
    sku: 'BEV-JUI-12',
    productName: 'Orange Juice 250ml',
    batchNumber: 'J441',
    quantity: 120,
    purchasePrice: 1.05,
    expiryDate: '2026-09-01', // 12 days away
    daysToExpiry: 12,
    mfgDate: '2026-07-01',
    isFefoPriority: true,
    status: 'near_expiry'
  },
  {
    id: 'bat-3',
    productId: 'prod-3',
    sku: 'DAI-405-MIL',
    productName: 'UHT Full Cream Milk 1L',
    batchNumber: 'M771',
    quantity: 0,
    purchasePrice: 1.10,
    expiryDate: '2026-08-28',
    daysToExpiry: 8,
    mfgDate: '2026-06-28',
    status: 'near_expiry'
  },
  {
    id: 'bat-4',
    productId: 'prod-1',
    sku: 'BEV-092-COL',
    productName: 'Sparkling Cola 500ml x24',
    batchNumber: 'COL-2026-88',
    quantity: 740,
    purchasePrice: 12.50,
    expiryDate: '2027-02-15',
    daysToExpiry: 179,
    mfgDate: '2026-08-01',
    status: 'healthy'
  },
  {
    id: 'bat-5',
    productId: 'prod-1',
    sku: 'BEV-092-COL',
    productName: 'Sparkling Cola 500ml x24',
    batchNumber: 'COL-2026-92',
    quantity: 500,
    purchasePrice: 12.50,
    expiryDate: '2027-04-10',
    daysToExpiry: 233,
    mfgDate: '2026-08-18',
    status: 'healthy'
  },
  {
    id: 'bat-6',
    productId: 'prod-2',
    sku: 'SNA-110-CHI',
    productName: 'Potato Chips Salted 150g',
    batchNumber: 'CHI-0810',
    quantity: 112,
    purchasePrice: 2.80,
    expiryDate: '2026-11-20',
    daysToExpiry: 92,
    mfgDate: '2026-08-10',
    status: 'healthy'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    code: 'CUST-001',
    name: 'City Retailers',
    storeName: 'City Supermarket & Provisions',
    contactPerson: 'Rajesh Sharma',
    phone: '+1 (555) 234-5678',
    email: 'rajesh@cityretailers.com',
    address: 'Shop 14-16, Metro Plaza, North Zone',
    zone: 'North Zone',
    creditLimit: 20000,
    outstandingBalance: 14250.00,
    overdueAmount: 6400.00,
    paymentTermsDays: 15,
    status: 'active',
    lastOrderDate: 'Today, 10:45 AM'
  },
  {
    id: 'cust-2',
    code: 'CUST-002',
    name: 'Metro Mart',
    storeName: 'Metro Hypermarket',
    contactPerson: 'Anjali Deshmukh',
    phone: '+1 (555) 345-6789',
    email: 'anjali@metromart.com',
    address: 'Building 4, Outer Ring Road, South Zone',
    zone: 'South Zone',
    creditLimit: 15000,
    outstandingBalance: 8400.00,
    overdueAmount: 0,
    paymentTermsDays: 30,
    status: 'active',
    lastOrderDate: 'Yesterday, 16:30 PM'
  },
  {
    id: 'cust-3',
    code: 'CUST-003',
    name: 'QuickStop Convenience',
    storeName: 'QuickStop 24/7 Store',
    contactPerson: 'Karan Patel',
    phone: '+1 (555) 456-7890',
    email: 'karan@quickstop.com',
    address: 'Station Road Junction, North Zone',
    zone: 'North Zone',
    creditLimit: 5000,
    outstandingBalance: 3200.00,
    overdueAmount: 0,
    paymentTermsDays: 15,
    status: 'active',
    lastOrderDate: 'Yesterday, 14:00 PM'
  },
  {
    id: 'cust-4',
    code: 'CUST-004',
    name: 'Sunrise Grocers',
    storeName: 'Sunrise Departmental Store',
    contactPerson: 'Vikram Joshi',
    phone: '+1 (555) 567-8901',
    email: 'orders@sunrisegrocers.com',
    address: '22 Sector 9 Commercial Complex, East Zone',
    zone: 'East Zone',
    creditLimit: 12000,
    outstandingBalance: 5100.00,
    overdueAmount: 1800.00,
    paymentTermsDays: 15,
    status: 'active',
    lastOrderDate: 'Aug 18, 2026'
  },
  {
    id: 'cust-5',
    code: 'CUST-005',
    name: 'Golden Kirana',
    storeName: 'Golden General Stores',
    contactPerson: 'Ramesh Gupta',
    phone: '+1 (555) 678-9012',
    email: 'ramesh.gupta@goldenk.com',
    address: 'Old Bazaar Lane, West Zone',
    zone: 'West Zone',
    creditLimit: 8000,
    outstandingBalance: 1450.00,
    overdueAmount: 0,
    paymentTermsDays: 7,
    status: 'active',
    lastOrderDate: 'Aug 17, 2026'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    code: 'SUP-HUL',
    name: 'Hindustan Unilever Limited (HUL)',
    contactPerson: 'Sunil Mathur',
    phone: '+1 (800) 123-4567',
    email: 'distro.support@hul-supply.com',
    gstin: '27AAACH5544L1Z2',
    address: 'HUL Distribution Center, Sector 18',
    payableBalance: 15600.00,
    totalPurchases: 184500.00,
    rating: 4.8,
    leadTimeDays: 2
  },
  {
    id: 'sup-2',
    code: 'SUP-ITC',
    name: 'ITC Distribution Hub',
    contactPerson: 'Priya Mehra',
    phone: '+1 (800) 234-5678',
    email: 'supply@itc-distro.com',
    gstin: '27AABCI9876K1Z8',
    address: 'ITC Warehousing Complex, Unit 3',
    payableBalance: 8200.00,
    totalPurchases: 96400.00,
    rating: 4.6,
    leadTimeDays: 3
  },
  {
    id: 'sup-3',
    code: 'SUP-UNI',
    name: 'Unilever Distro Hub',
    contactPerson: 'Mohan Lal',
    phone: '+1 (800) 345-6789',
    email: 'orders@unilever-hub.com',
    gstin: '27AAACU1234F1Z1',
    address: 'Logistics Park, Bay 12',
    payableBalance: 12400.00,
    totalPurchases: 142000.00,
    rating: 4.9,
    leadTimeDays: 1
  },
  {
    id: 'sup-4',
    code: 'SUP-PAR',
    name: 'Parle Products Depot',
    contactPerson: 'Ashok Verma',
    phone: '+1 (800) 456-7890',
    email: 'depot@parlebiscuits.com',
    gstin: '27AAACP3322M1Z0',
    address: 'Parle Industrial Area, Factory Gate 2',
    payableBalance: 4500.00,
    totalPurchases: 54000.00,
    rating: 4.7,
    leadTimeDays: 2
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    timestamp: '2026-08-20T10:42:00',
    timeFormatted: '10:42 AM',
    type: 'Purchase',
    sku: 'BEV-092-COL',
    productName: 'Sparkling Cola 500ml x24',
    quantity: 500,
    referenceNo: 'PO-2023-881',
    actor: 'Marcus Vance (Warehouse)'
  },
  {
    id: 'mov-2',
    timestamp: '2026-08-20T09:15:00',
    timeFormatted: '09:15 AM',
    type: 'Sale',
    sku: 'SNA-110-CHI',
    productName: 'Potato Chips Salted 150g',
    quantity: -48,
    referenceNo: 'INV-99201',
    actor: 'David Chen (Sales)'
  },
  {
    id: 'mov-3',
    timestamp: '2026-08-19T17:30:00',
    timeFormatted: 'Yesterday',
    type: 'Adj',
    sku: 'DAI-405-MIL',
    productName: 'UHT Full Cream Milk 1L',
    quantity: -2,
    referenceNo: 'Damaged in transit',
    note: 'Carton crushed upon receiving inspection',
    actor: 'Marcus Vance (Warehouse)'
  },
  {
    id: 'mov-4',
    timestamp: '2026-08-19T14:10:00',
    timeFormatted: 'Yesterday',
    type: 'Sale',
    sku: 'BEV-092-COL',
    productName: 'Sparkling Cola 500ml x24',
    quantity: -20,
    referenceNo: 'INV-99198',
    actor: 'David Chen (Sales)'
  },
  {
    id: 'mov-5',
    timestamp: '2026-08-19T11:20:00',
    timeFormatted: 'Yesterday',
    type: 'Purchase',
    sku: 'HOU-882-DET',
    productName: 'Liquid Detergent 2L',
    quantity: 150,
    referenceNo: 'PO-2023-879',
    actor: 'Marcus Vance (Warehouse)'
  }
];

export const INITIAL_SALES: SaleTransaction[] = [
  {
    id: 'sale-1',
    invoiceNumber: 'TRX-9824',
    customerId: 'cust-1',
    customerName: 'City Retailers',
    storeName: 'City Supermarket',
    date: '2026-08-20',
    time: '10:45 AM',
    items: [
      {
        productId: 'prod-1',
        sku: 'BEV-092-COL',
        name: 'Sparkling Cola 500ml x24',
        quantity: 50,
        freeQuantity: 2,
        unitPrice: 15.00,
        totalAmount: 750.00
      },
      {
        productId: 'prod-4',
        sku: 'HOU-882-DET',
        name: 'Liquid Detergent 2L',
        quantity: 50,
        freeQuantity: 0,
        unitPrice: 8.00,
        totalAmount: 400.00
      },
      {
        productId: 'prod-2',
        sku: 'SNA-110-CHI',
        name: 'Potato Chips Salted 150g',
        quantity: 25,
        freeQuantity: 0,
        unitPrice: 4.00,
        totalAmount: 100.00
      }
    ],
    subtotal: 1250.00,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 1250.00,
    amountPaid: 0,
    balanceDue: 1250.00,
    paymentMethod: 'Credit',
    paymentStatus: 'Unpaid',
    createdBy: 'David Chen'
  },
  {
    id: 'sale-2',
    invoiceNumber: 'TRX-9822',
    customerId: 'cust-2',
    customerName: 'Metro Mart',
    storeName: 'Metro Hypermarket',
    date: '2026-08-19',
    time: '16:30 PM',
    items: [
      {
        productId: 'prod-1',
        sku: 'BEV-092-COL',
        name: 'Sparkling Cola 500ml x24',
        quantity: 40,
        freeQuantity: 0,
        unitPrice: 15.00,
        totalAmount: 600.00
      },
      {
        productId: 'prod-7',
        sku: 'LIP-YL-250-B',
        name: 'Lipton Yellow Label Tea 250g Box',
        quantity: 65,
        freeQuantity: 5,
        unitPrice: 3.80,
        totalAmount: 247.00
      },
      {
        productId: 'prod-11',
        sku: 'PAR-GLU-80',
        name: 'Parle-G Glucose Biscuits 80g',
        quantity: 3,
        freeQuantity: 0,
        unitPrice: 1.20,
        totalAmount: 3.50
      }
    ],
    subtotal: 850.50,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 850.50,
    amountPaid: 850.50,
    balanceDue: 0,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    createdBy: 'David Chen'
  }
];

export const INITIAL_PURCHASES: PurchaseTransaction[] = [
  {
    id: 'pur-1',
    invoiceNumber: 'TRX-9823',
    supplierId: 'sup-1',
    supplierName: 'Hindustan Unilever Limited (HUL)',
    date: '2026-08-20',
    items: [
      {
        productId: 'prod-9',
        sku: 'DOV-SOAP-100',
        name: 'Dove Soap Bar 100g Original',
        quantity: 144,
        freeQuantity: 12,
        unitPrice: 1.20,
        batchNumber: 'L-8921',
        expiryDate: '2027-12-31',
        totalAmount: 172.80
      },
      {
        productId: 'prod-10',
        sku: 'SUN-DISH-500',
        name: 'Sunlight Dish Liq Lemon 500ml',
        quantity: 72,
        freeQuantity: 0,
        unitPrice: 2.10,
        batchNumber: 'M-1102',
        expiryDate: '2028-08-31',
        totalAmount: 151.20
      }
    ],
    totalAmount: 3400.00,
    paymentStatus: 'Pending',
    isAiScanned: true,
    status: 'Confirmed'
  },
  {
    id: 'pur-2',
    invoiceNumber: 'TRX-9820',
    supplierId: 'sup-2',
    supplierName: 'ITC Distribution Hub',
    date: '2026-08-19',
    items: [
      {
        productId: 'prod-2',
        sku: 'SNA-110-CHI',
        name: 'Potato Chips Salted 150g',
        quantity: 300,
        freeQuantity: 20,
        unitPrice: 2.80,
        batchNumber: 'ITC-778',
        expiryDate: '2026-12-15',
        totalAmount: 840.00
      },
      {
        productId: 'prod-4',
        sku: 'HOU-882-DET',
        name: 'Liquid Detergent 2L',
        quantity: 60,
        freeQuantity: 0,
        unitPrice: 6.00,
        batchNumber: 'DET-990',
        expiryDate: '2028-01-10',
        totalAmount: 360.00
      }
    ],
    totalAmount: 1200.00,
    paymentStatus: 'Paid',
    isAiScanned: false,
    status: 'Confirmed'
  }
];

export const INITIAL_EXTRACTED_INVOICE: ExtractedInvoiceData = {
  invoiceNumber: 'INV-2023-884',
  supplierName: 'Unilever Distro Hub',
  supplierId: 'sup-3',
  date: 'Oct 24, 2023',
  totalAmount: 499.20,
  rawImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc19UurHgP7OyJbT5k4NnVsZYExQ12IMwy77O3qEnReRMVp2x2hD8Y50wr1zmqOuYTMzJgl1KZQaiRh5tY7OEUqYQXkyBf12dVpt0sZXcSvRQBP8aETox6KDId6QCTFxXS9RA7lLs7IRjfAptkkcrB050DC4QgZoyxmbgfiqzOf3ZwTdRSbVlmUt3sETwioOlvaEM_T3-BretZaoPEejHSO3HQJAIR5j8CQwXyEr3HWByPcOA6IHI',
  status: 'ready_for_review',
  items: [
    {
      id: 'ext-1',
      extractedName: 'Dove Soap Bar 100g Original',
      matchedProductId: 'prod-9',
      matchedProductName: 'Dove Soap Bar 100g Original',
      matchedSku: 'DOV-SOAP-100',
      matchConfidence: 98,
      matchStatus: 'Matched',
      quantity: 144,
      rate: 1.20,
      batchNumber: 'L-8921',
      expiryDate: '12/2025',
      isExpiryMissing: false
    },
    {
      id: 'ext-2',
      extractedName: 'Lipton Ylw Lbl 250g',
      matchedProductId: 'prod-7',
      matchedProductName: 'Lipton Yellow Label Tea 250g Box',
      matchedSku: 'LIP-YL-250-B',
      matchConfidence: 68,
      matchStatus: 'Uncertain',
      quantity: 50,
      rate: 3.50,
      batchNumber: 'UNK',
      expiryDate: 'MISSING',
      isExpiryMissing: true,
      suggestedMatches: [
        {
          productId: 'prod-7',
          sku: 'LIP-YL-250-B',
          name: 'Lipton Yellow Label Tea 250g Box',
          confidence: 92
        },
        {
          productId: 'prod-8',
          sku: 'LIP-YL-500-J',
          name: 'Lipton Yellow Label Tea 500g Jar',
          confidence: 45
        }
      ]
    },
    {
      id: 'ext-3',
      extractedName: 'Sunlight Dish Liq Lemon 500ml',
      matchedProductId: 'prod-10',
      matchedProductName: 'Sunlight Dish Liq Lemon 500ml',
      matchedSku: 'SUN-DISH-500',
      matchConfidence: 96,
      matchStatus: 'Matched',
      quantity: 72,
      rate: 2.10,
      batchNumber: 'M-1102',
      expiryDate: '08/2026',
      isExpiryMissing: false
    }
  ]
};

export const INITIAL_PREDICTIVE_INSIGHTS: PredictiveInsight[] = [
  {
    id: 'ins-1',
    type: 'reorder',
    title: 'Reorder Recommendation',
    description: "AI Recommendation: Reorder 'Parle-G 80g' immediately. Stock will deplete in 2 days based on current sales velocity.",
    sku: 'PAR-GLU-80',
    actionLabel: 'Action Now',
    severity: 'high',
    timestamp: 'Just now'
  },
  {
    id: 'ins-2',
    type: 'trend',
    title: 'Trend Alert',
    description: 'Beverage sales in North Zone have increased by 25% this week.',
    severity: 'info',
    timestamp: 'Today, 08:30 AM'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    timestamp: '10:48 AM',
    text: 'How much money is pending from City Retailers?'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    timestamp: '10:48 AM',
    text: 'Currently, there is $14,250.00 pending from City Retailers. This spans across 4 overdue invoices.',
    structuredData: {
      type: 'pending_invoices',
      title: 'TOP PENDING INVOICES',
      totalHighlight: '$14,250.00',
      items: [
        {
          label: 'INV-802',
          value: '$6,400',
          percentage: 45,
          color: '#ba1a1a'
        },
        {
          label: 'INV-815',
          value: '$4,250',
          percentage: 30,
          color: '#ff9800'
        },
        {
          label: 'INV-829',
          value: '$2,100',
          percentage: 15,
          color: '#3f51b5'
        },
        {
          label: 'INV-833',
          value: '$1,500',
          percentage: 10,
          color: '#757684'
        }
      ],
      actionButtons: [
        {
          label: 'View Collection List',
          icon: 'receipt_long',
          actionType: 'navigate_collections',
          payload: { customerId: 'cust-1' }
        },
        {
          label: 'Send Reminder',
          icon: 'mail',
          actionType: 'send_reminder',
          payload: { customerId: 'cust-1', email: 'rajesh@cityretailers.com' }
        }
      ]
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '2026-08-20 10:45:12',
    actor: 'David Chen',
    actorRole: 'Sales Staff',
    action: 'CREATE_SALE',
    entity: 'SaleTransaction',
    entityId: 'TRX-9824',
    newValue: 'Total: $1,250.00, Customer: City Retailers',
    reason: 'New retail order fulfillment'
  },
  {
    id: 'aud-2',
    timestamp: '2026-08-20 09:15:30',
    actor: 'Marcus Vance',
    actorRole: 'Warehouse',
    action: 'CONFIRM_PURCHASE',
    entity: 'PurchaseTransaction',
    entityId: 'TRX-9823',
    newValue: 'Total: $3,400.00, Supplier: HUL',
    reason: 'AI Inbound scan confirmed'
  },
  {
    id: 'aud-3',
    timestamp: '2026-08-19 17:30:45',
    actor: 'Marcus Vance',
    actorRole: 'Warehouse',
    action: 'STOCK_ADJUSTMENT',
    entity: 'Product',
    entityId: 'DAI-405-MIL',
    previousValue: 'Damaged: 10',
    newValue: 'Damaged: 12',
    reason: 'Damaged in transit inspection'
  },
  {
    id: 'aud-4',
    timestamp: '2026-08-19 14:00:10',
    actor: 'Elena Rostova',
    actorRole: 'Collection Staff',
    action: 'RECORD_PAYMENT',
    entity: 'PaymentCollection',
    entityId: 'TRX-9821',
    newValue: 'Amount: $500.00 from QuickStop',
    reason: 'Cash collection receipt #RCP-1092'
  }
];
