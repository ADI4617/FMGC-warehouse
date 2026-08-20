import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  Batch,
  Customer,
  Supplier,
  StockMovement,
  SaleTransaction,
  PurchaseTransaction,
  ExtractedInvoiceData,
  AuditLog,
  PredictiveInsight,
  ChatMessage,
  User,
  UserRole,
  StaffStatus,
  PaymentCollection,
  BusinessTenant,
  RolePermissionRule,
  AppModuleId,
  ElevatedActionRequest
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_BATCHES,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_SALES,
  INITIAL_PURCHASES,
  INITIAL_EXTRACTED_INVOICE,
  INITIAL_PREDICTIVE_INSIGHTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TENANT,
  INITIAL_PERMISSION_MATRIX
} from '../data/initialData';

export type NavigationTab =
  | 'dashboard'
  | 'sales'
  | 'purchase'
  | 'inventory'
  | 'customers'
  | 'suppliers'
  | 'collections'
  | 'reports'
  | 'ai-center'
  | 'staff'
  | 'staff-roles'
  | 'audit-logs'
  | 'settings'
  | 'platform-admin'
  | 'login'
  | 'signup'
  | 'forgot-password';

export interface ToastNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

export interface SignupData {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  password: string;
  plan?: 'Growth' | 'Enterprise' | 'Starter';
}

interface AppContextType {
  // Navigation, Routing & Auth
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  navigateTo: (tab: NavigationTab | string) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (data: SignupData) => boolean;
  logout: () => void;
  forgotPassword: (email: string) => boolean;

  // Tenant & Organization Context
  currentTenant: BusinessTenant;
  updateTenant: (updates: Partial<BusinessTenant>) => void;

  // Active User & Staff Management
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  addStaffMember: (staffData: { name: string; email: string; phone?: string; role: UserRole; department?: string; status?: StaffStatus }) => void;
  updateStaffMember: (id: string, updates: Partial<User>) => void;
  changeStaffRole: (id: string, newRole: UserRole, reason?: string) => void;
  suspendStaffMember: (id: string, reason?: string) => void;
  reactivateStaffMember: (id: string) => void;
  deactivateStaffMember: (id: string, reason?: string) => void;
  resendInvitation: (id: string) => void;

  // Permissions Matrix
  permissionMatrix: RolePermissionRule[];
  updatePermissionMatrixRule: (moduleId: AppModuleId, updates: Partial<RolePermissionRule>) => void;

  // Elevated Permission Confirmation
  elevatedActionRequest: ElevatedActionRequest | null;
  requestElevatedAction: (req: ElevatedActionRequest) => void;
  confirmElevatedAction: () => void;
  cancelElevatedAction: () => void;

  // Search
  globalSearch: string;
  setGlobalSearch: (search: string) => void;

  // Master Data
  products: Product[];
  batches: Batch[];
  customers: Customer[];
  suppliers: Supplier[];
  stockMovements: StockMovement[];
  sales: SaleTransaction[];
  purchases: PurchaseTransaction[];
  collections: PaymentCollection[];
  auditLogs: AuditLog[];
  predictiveInsights: PredictiveInsight[];
  chatMessages: ChatMessage[];
  extractedInvoice: ExtractedInvoiceData;

  // Modals & Drawers
  isAiOptimizerOpen: boolean;
  setIsAiOptimizerOpen: (open: boolean) => void;
  isAddStockOpen: boolean;
  setIsAddStockOpen: (open: boolean) => void;
  isNewSaleOpen: boolean;
  setIsNewSaleOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  selectedCustomerIdForPayment?: string;
  setSelectedCustomerIdForPayment: (id?: string) => void;
  isStockAdjustmentOpen: boolean;
  setIsStockAdjustmentOpen: (open: boolean) => void;
  selectedProductForAdjustment?: Product;
  setSelectedProductForAdjustment: (prod?: Product) => void;
  activeInvoiceToPrint?: SaleTransaction;
  setActiveInvoiceToPrint: (sale?: SaleTransaction) => void;

  // Actions
  toasts: ToastNotification[];
  addToast: (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Master Data Operations
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'code'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  addSupplier: (supplier: Omit<Supplier, 'id' | 'code'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;

  // Inventory & Batch Operations
  recordStockAdjustment: (productId: string, batchNumber: string, quantityDelta: number, reason: string, isDamage?: boolean) => void;
  applyExpiryDiscount: (batchId: string, discountPercent: number) => void;
  returnBatchToSupplier: (batchId: string) => void;
  writeOffBatch: (batchId: string) => void;

  // Transaction Operations
  createSale: (sale: Omit<SaleTransaction, 'id' | 'invoiceNumber' | 'time'>) => void;
  createPurchase: (purchase: Omit<PurchaseTransaction, 'id' | 'invoiceNumber'>) => void;
  recordCollectionPayment: (customerId: string, amount: number, method: 'Cash' | 'Cheque' | 'UPI' | 'NEFT/RTGS', notes?: string) => void;

  // AI Invoice Scanner Operations
  updateExtractedItem: (itemId: string, updates: any) => void;
  resolveUncertainItemMatch: (itemId: string, matchedProduct: Product, confidence: number) => void;
  removeExtractedItem: (itemId: string) => void;
  addExtractedItem: (item: any) => void;
  confirmExtractedInvoice: () => void;
  resetExtractedInvoice: () => void;

  // AI Assistant Chat Operations
  sendChatMessage: (text: string) => Promise<void>;

  // System
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to determine initial tab from URL path
const getTabFromPathname = (pathname: string): NavigationTab => {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  if (cleanPath === 'login') return 'login';
  if (cleanPath === 'signup') return 'signup';
  if (cleanPath === 'forgot-password') return 'forgot-password';
  if (cleanPath === 'staff/roles') return 'staff-roles';
  if (cleanPath === 'staff') return 'staff';
  if (cleanPath === 'inventory') return 'inventory';
  if (cleanPath === 'purchase') return 'purchase';
  if (cleanPath === 'sales') return 'sales';
  if (cleanPath === 'customers') return 'customers';
  if (cleanPath === 'suppliers') return 'suppliers';
  if (cleanPath === 'collections') return 'collections';
  if (cleanPath === 'reports') return 'reports';
  if (cleanPath === 'ai-center') return 'ai-center';
  if (cleanPath === 'audit-logs') return 'audit-logs';
  if (cleanPath === 'settings') return 'settings';
  if (cleanPath === 'platform-admin') return 'platform-admin';
  return 'dashboard';
};

const getPathnameFromTab = (tab: NavigationTab): string => {
  if (tab === 'staff-roles') return '/staff/roles';
  if (tab === 'dashboard') return '/dashboard';
  return `/${tab}`;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & URL Routing Sync
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    return getTabFromPathname(window.location.pathname);
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('fmcg_auth');
    if (saved !== null) return saved === 'true';
    // If accessing auth routes initially, don't force auth
    const path = window.location.pathname;
    if (path.includes('login') || path.includes('signup') || path.includes('forgot-password')) {
      return false;
    }
    return true; // default authenticated for seamless direct app exploration
  });

  // Tenant / Organization Context
  const [currentTenant, setCurrentTenant] = useState<BusinessTenant>(() => {
    const saved = localStorage.getItem('fmcg_tenant');
    return saved ? JSON.parse(saved) : INITIAL_TENANT;
  });

  const [globalSearch, setGlobalSearch] = useState('');

  // Users & RBAC
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fmcg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('fmcg_current_user_id');
    const found = users.find(u => u.id === saved);
    return found || users[0];
  });

  // Role Permissions Matrix
  const [permissionMatrix, setPermissionMatrix] = useState<RolePermissionRule[]>(() => {
    const saved = localStorage.getItem('fmcg_permission_matrix');
    return saved ? JSON.parse(saved) : INITIAL_PERMISSION_MATRIX;
  });

  // Elevated Action State
  const [elevatedActionRequest, setElevatedActionRequest] = useState<ElevatedActionRequest | null>(null);

  // Data Collections
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('fmcg_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('fmcg_batches');
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('fmcg_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('fmcg_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('fmcg_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [sales, setSales] = useState<SaleTransaction[]>(() => {
    const saved = localStorage.getItem('fmcg_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [purchases, setPurchases] = useState<PurchaseTransaction[]>(() => {
    const saved = localStorage.getItem('fmcg_purchases');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [collections, setCollections] = useState<PaymentCollection[]>(() => {
    const saved = localStorage.getItem('fmcg_collections');
    return saved ? JSON.parse(saved) : [
      {
        id: 'col-1',
        receiptNumber: 'RCP-1092',
        customerId: 'cust-3',
        customerName: 'QuickStop Convenience',
        invoiceNumber: 'TRX-9821',
        amount: 500,
        paymentMethod: 'Cash',
        date: '2026-08-19',
        time: '14:00 PM',
        recordedBy: 'Elena Rostova',
        notes: 'Cash payment received on route'
      }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('fmcg_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>(() => {
    const saved = localStorage.getItem('fmcg_insights');
    return saved ? JSON.parse(saved) : INITIAL_PREDICTIVE_INSIGHTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('fmcg_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [extractedInvoice, setExtractedInvoice] = useState<ExtractedInvoiceData>(() => {
    const saved = localStorage.getItem('fmcg_extracted_invoice');
    return saved ? JSON.parse(saved) : INITIAL_EXTRACTED_INVOICE;
  });

  // Modals & Overlays
  const [isAiOptimizerOpen, setIsAiOptimizerOpen] = useState(false);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [selectedCustomerIdForPayment, setSelectedCustomerIdForPayment] = useState<string | undefined>(undefined);
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false);
  const [selectedProductForAdjustment, setSelectedProductForAdjustment] = useState<Product | undefined>(undefined);
  const [activeInvoiceToPrint, setActiveInvoiceToPrint] = useState<SaleTransaction | undefined>(undefined);

  // Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // PushState and Tab Navigation Sync
  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    const path = getPathnameFromTab(tab);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  const navigateTo = (tabOrPath: NavigationTab | string) => {
    if (tabOrPath.startsWith('/')) {
      const tab = getTabFromPathname(tabOrPath);
      setActiveTab(tab);
    } else {
      setActiveTab(tabOrPath as NavigationTab);
    }
  };

  // Browser back/forward navigation event listener
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPathname(window.location.pathname);
      setActiveTabState(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fmcg_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('fmcg_tenant', JSON.stringify(currentTenant));
  }, [currentTenant]);

  useEffect(() => {
    localStorage.setItem('fmcg_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fmcg_current_user_id', currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fmcg_permission_matrix', JSON.stringify(permissionMatrix));
  }, [permissionMatrix]);

  useEffect(() => {
    localStorage.setItem('fmcg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fmcg_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('fmcg_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('fmcg_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('fmcg_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('fmcg_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('fmcg_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('fmcg_collections', JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem('fmcg_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('fmcg_extracted_invoice', JSON.stringify(extractedInvoice));
  }, [extractedInvoice]);

  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [...prev, { id, type, title, message, timestamp: 'Just now' }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addAuditLog = (action: string, entity: string, entityId: string, newValue: string, previousValue?: string, reason?: string) => {
    const newLog: AuditLog = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: currentUser?.name || 'System Operator',
      actorRole: currentUser?.role || 'Admin',
      action,
      entity,
      entityId,
      previousValue,
      newValue,
      reason: reason || 'User action completed'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Authentication Flow
  const login = (email: string, _password: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (matchedUser) {
      if (matchedUser.status === 'suspended' || matchedUser.status === 'deactivated') {
        addToast('error', 'Access Denied', `Account for ${matchedUser.name} is ${matchedUser.status}. Contact administrator.`);
        return false;
      }
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      addAuditLog('USER_LOGIN', 'Authentication', matchedUser.email, `Successful login as ${matchedUser.role}`, undefined, 'Session authorized');
      addToast('success', 'Welcome Back', `Signed in as ${matchedUser.name} (${matchedUser.role})`);
      setActiveTab('dashboard');
      return true;
    }

    // If generic credentials or demo user entered
    const defaultUser = users[0];
    setCurrentUser(defaultUser);
    setIsAuthenticated(true);
    addAuditLog('USER_LOGIN', 'Authentication', defaultUser.email, `Demo login as ${defaultUser.role}`);
    addToast('success', 'Welcome Back', `Signed in to ${currentTenant.name}`);
    setActiveTab('dashboard');
    return true;
  };

  const signup = (data: SignupData): boolean => {
    const newTenantId = 'tnt-' + (Date.now().toString(36));
    const newTenant: BusinessTenant = {
      id: newTenantId,
      name: data.businessName,
      legalEntity: `${data.businessName} Enterprises`,
      gstin: '27AABC' + Math.floor(1000 + Math.random() * 9000) + 'F1Z5',
      email: data.email,
      phone: data.phone || '+91 98200 00000',
      address: 'Central Logistics Hub, Sector 12',
      city: 'Mumbai',
      state: 'Maharashtra',
      currency: 'USD',
      plan: data.plan || 'Enterprise',
      status: 'active',
      createdDate: new Date().toISOString().substring(0, 10),
      totalSkusCount: products.length,
      monthlyRevenueEstimate: 150000
    };

    const newOwner: User = {
      id: 'usr-' + Date.now(),
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      role: 'Owner',
      department: 'Executive Office',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      lastActive: 'Just now',
      dateJoined: new Date().toISOString().substring(0, 10),
      tenantId: newTenantId,
      permissions: ['Master Tenant Owner', 'Billing & Subscription', 'Global Config', 'Full Access'],
      accessModules: ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
    };

    setCurrentTenant(newTenant);
    setUsers(prev => [newOwner, ...prev]);
    setCurrentUser(newOwner);
    setIsAuthenticated(true);

    addAuditLog('TENANT_CREATED', 'BusinessTenant', newTenantId, `Created business tenant ${newTenant.name}`, undefined, 'New SaaS Onboarding');
    addAuditLog('USER_REGISTERED', 'User', newOwner.email, `Created Owner account for ${newOwner.name}`);

    addToast('success', 'Business Created!', `Welcome to FMCG Distro. Your workspace for ${newTenant.name} is ready.`);
    setActiveTab('dashboard');
    return true;
  };

  const logout = () => {
    addAuditLog('USER_LOGOUT', 'Authentication', currentUser?.email || 'unknown', 'User logged out');
    setIsAuthenticated(false);
    addToast('info', 'Signed Out', 'You have been safely signed out of your distribution workspace.');
    setActiveTab('login');
  };

  const forgotPassword = (email: string): boolean => {
    addToast('info', 'Password Reset Sent', `If an account exists for ${email}, a secure reset link has been dispatched.`);
    return true;
  };

  const updateTenant = (updates: Partial<BusinessTenant>) => {
    setCurrentTenant(prev => {
      const updated = { ...prev, ...updates };
      addAuditLog('TENANT_UPDATED', 'BusinessTenant', prev.id, JSON.stringify(updates), undefined, 'Tenant Configuration Changed');
      return updated;
    });
    addToast('success', 'Organization Updated', 'Business settings saved successfully.');
  };

  // Staff & Roles Management Operations
  const addStaffMember = (staffData: { name: string; email: string; phone?: string; role: UserRole; department?: string; status?: StaffStatus }) => {
    const id = 'usr-' + Date.now();
    const accessModules = staffData.role === 'Owner' || staffData.role === 'Admin'
      ? ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
      : staffData.role === 'Warehouse'
      ? ['Dashboard', 'Purchase', 'Inventory', 'AI Invoice Scanner', 'Batch & Expiry']
      : staffData.role === 'Sales Staff'
      ? ['Dashboard', 'Sales', 'Customers']
      : staffData.role === 'Collection Staff'
      ? ['Dashboard', 'Customers', 'Collections', 'Reports']
      : staffData.role === 'Manager'
      ? ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Reports', 'AI Center']
      : ['Dashboard', 'Reports'];

    const newStaff: User = {
      id,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone || '+91 98000 00000',
      role: staffData.role,
      department: staffData.department || 'Operations',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: staffData.status || 'pending',
      lastActive: staffData.status === 'active' ? 'Just now' : 'Invitation sent',
      dateJoined: new Date().toISOString().substring(0, 10),
      tenantId: currentTenant.id,
      permissions: [`${staffData.role} Access`, 'Scoped Operations'],
      accessModules
    };

    setUsers(prev => [newStaff, ...prev]);

    addAuditLog(
      'INVITATION_SENT',
      'Staff',
      newStaff.email,
      `Invited ${newStaff.name} as ${newStaff.role} (${newStaff.department})`,
      undefined,
      'Staff Provisioning'
    );

    addToast('success', 'Invitation Sent Successfully', `Invitation dispatched to ${newStaff.email} with ${newStaff.role} role.`);
  };

  const updateStaffMember = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        addAuditLog('STAFF_UPDATED', 'Staff', u.email, JSON.stringify(updates), `Previous role: ${u.role}, status: ${u.status}`);
        return updated;
      }
      return u;
    }));
    addToast('success', 'Staff Member Updated', 'Employee details and privileges saved.');
  };

  const changeStaffRole = (id: string, newRole: UserRole, reason?: string) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;

    const prevRole = userToUpdate.role;
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          role: newRole
        };
      }
      return u;
    }));

    addAuditLog(
      'ROLE_CHANGED',
      'Staff',
      userToUpdate.email,
      `Changed role from ${prevRole} to ${newRole}`,
      prevRole,
      reason || 'Administrative role re-assignment'
    );

    addToast('success', 'Role Updated', `Changed ${userToUpdate.name}'s role to ${newRole}.`);
  };

  const suspendStaffMember = (id: string, reason?: string) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;

    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'suspended' } : u));

    addAuditLog(
      'STAFF_SUSPENDED',
      'Staff',
      userToUpdate.email,
      `Suspended access for ${userToUpdate.name}`,
      userToUpdate.status,
      reason || 'Security or operational suspension'
    );

    addToast('warning', 'Access Suspended', `${userToUpdate.name}'s system access has been suspended.`);
  };

  const reactivateStaffMember = (id: string) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;

    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));

    addAuditLog(
      'STAFF_REACTIVATED',
      'Staff',
      userToUpdate.email,
      `Reactivated access for ${userToUpdate.name}`,
      userToUpdate.status,
      'Staff access restored'
    );

    addToast('success', 'Account Reactivated', `${userToUpdate.name}'s account is now active.`);
  };

  const deactivateStaffMember = (id: string, reason?: string) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;

    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'deactivated' } : u));

    addAuditLog(
      'STAFF_DEACTIVATED',
      'Staff',
      userToUpdate.email,
      `Deactivated account for ${userToUpdate.name}`,
      userToUpdate.status,
      reason || 'Employment termination / de-provisioning'
    );

    addToast('error', 'Account Deactivated', `${userToUpdate.name} has been deactivated.`);
  };

  const resendInvitation = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
      addAuditLog('INVITATION_RESENT', 'Staff', target.email, `Resent invitation email to ${target.name}`);
      addToast('info', 'Invitation Re-dispatched', `Sent fresh onboarding credentials link to ${target.email}.`);
    }
  };

  const updatePermissionMatrixRule = (moduleId: AppModuleId, updates: Partial<RolePermissionRule>) => {
    setPermissionMatrix(prev => prev.map(rule => {
      if (rule.moduleId === moduleId) {
        const updated = { ...rule, ...updates };
        addAuditLog('PERMISSION_RULE_MODIFIED', 'SecurityMatrix', moduleId, JSON.stringify(updates), undefined, 'Role Access Configuration');
        return updated;
      }
      return rule;
    }));
    addToast('info', 'Permission Matrix Updated', 'Access rights rule successfully adjusted.');
  };

  // Elevated Permission Workflow
  const requestElevatedAction = (req: ElevatedActionRequest) => {
    setElevatedActionRequest(req);
  };

  const confirmElevatedAction = () => {
    if (elevatedActionRequest) {
      addAuditLog(
        'ELEVATED_ACTION_EXECUTED',
        elevatedActionRequest.resourceType,
        elevatedActionRequest.resourceId,
        `Elevated action confirmed: ${elevatedActionRequest.actionName}`,
        undefined,
        elevatedActionRequest.description
      );
      elevatedActionRequest.onConfirm();
      setElevatedActionRequest(null);
    }
  };

  const cancelElevatedAction = () => {
    if (elevatedActionRequest) {
      addToast('info', 'Action Cancelled', `Elevated operation "${elevatedActionRequest.actionName}" was cancelled.`);
      setElevatedActionRequest(null);
    }
  };

  // Master Data Methods
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const id = 'prod-' + (products.length + 1);
    const newProduct: Product = { ...prodData, id };
    setProducts(prev => [newProduct, ...prev]);
    addAuditLog('CREATE_PRODUCT', 'Product', newProduct.sku, `Created ${newProduct.name} at rate $${newProduct.sellingPrice}`);
    addToast('success', 'Product Created', `Added ${newProduct.name} (${newProduct.sku}) to catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates };
        addAuditLog('UPDATE_PRODUCT', 'Product', updated.sku, JSON.stringify(updates), `Was: inStock ${p.inStock}, rate $${p.sellingPrice}`);
        return updated;
      }
      return p;
    }));
    addToast('info', 'Product Updated', 'Changes saved successfully');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    if (prod) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addAuditLog('DELETE_PRODUCT', 'Product', prod.sku, 'Deleted from catalog', `Product: ${prod.name}`);
      addToast('warning', 'Product Removed', `Removed ${prod.name}`);
    }
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'code'>) => {
    const code = `CUST-00${customers.length + 1}`;
    const id = 'cust-' + (customers.length + 1);
    const newCust: Customer = { ...customerData, id, code };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog('CREATE_CUSTOMER', 'Customer', newCust.code, `Added ${newCust.name} in ${newCust.zone}`);
    addToast('success', 'Customer Added', `Registered ${newCust.name}`);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addToast('info', 'Customer Updated', 'Customer details saved');
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'code'>) => {
    const code = `SUP-${(suppliers.length + 1)}`;
    const id = 'sup-' + (suppliers.length + 1);
    const newSup: Supplier = { ...supplierData, id, code };
    setSuppliers(prev => [newSup, ...prev]);
    addAuditLog('CREATE_SUPPLIER', 'Supplier', newSup.code, `Added ${newSup.name}`);
    addToast('success', 'Supplier Added', `Registered ${newSup.name}`);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  // Stock Adjustment
  const recordStockAdjustment = (productId: string, batchNumber: string, quantityDelta: number, reason: string, isDamage: boolean = false) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    // Update Product
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newInStock = Math.max(0, p.inStock + (isDamage ? -quantityDelta : quantityDelta));
        const newDamaged = isDamage ? p.damaged + quantityDelta : p.damaged;
        let newStatus: Product['status'] = 'Healthy';
        if (newInStock === 0) newStatus = 'Out of Stock';
        else if (newInStock <= p.minThreshold) newStatus = 'Low';

        return {
          ...p,
          inStock: newInStock,
          damaged: newDamaged,
          status: newStatus
        };
      }
      return p;
    }));

    // Record Stock Movement
    const movement: StockMovement = {
      id: 'mov-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: isDamage ? 'Damage' : 'Adj',
      sku: prod.sku,
      productName: prod.name,
      quantity: isDamage ? -quantityDelta : quantityDelta,
      referenceNo: isDamage ? 'Damage Inspection' : `Adj: ${reason}`,
      note: reason,
      actor: `${currentUser.name} (${currentUser.role})`
    };
    setStockMovements(prev => [movement, ...prev]);

    addAuditLog(
      'STOCK_ADJUSTMENT',
      'Product',
      prod.sku,
      `Delta: ${quantityDelta} units. Reason: ${reason}`,
      `Previous Stock: ${prod.inStock}`,
      reason
    );

    addToast(
      isDamage ? 'warning' : 'success',
      'Stock Adjusted',
      `${prod.sku} stock adjusted by ${quantityDelta > 0 ? '+' : ''}${quantityDelta} (${reason})`
    );
  };

  // Expiry Actions
  const applyExpiryDiscount = (batchId: string, discountPercent: number) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    setProducts(prev => prev.map(p => {
      if (p.id === batch.productId) {
        const newPrice = Number((p.sellingPrice * (1 - discountPercent / 100)).toFixed(2));
        return {
          ...p,
          sellingPrice: newPrice,
          notes: `Discount applied: ${discountPercent}% off for batch #${batch.batchNumber}`
        };
      }
      return p;
    }));

    addAuditLog(
      'APPLY_EXPIRY_DISCOUNT',
      'Batch',
      batch.batchNumber,
      `Applied ${discountPercent}% discount to accelerate sale before expiry (${batch.expiryDate})`
    );

    addToast('success', 'FEFO Promotion Active', `Applied ${discountPercent}% discount to ${batch.productName} (Batch #${batch.batchNumber})`);
  };

  const returnBatchToSupplier = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    setBatches(prev => prev.filter(b => b.id !== batchId));
    setProducts(prev => prev.map(p => {
      if (p.id === batch.productId) {
        const newStock = Math.max(0, p.inStock - batch.quantity);
        return {
          ...p,
          inStock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock <= p.minThreshold ? 'Low' : 'Healthy'
        };
      }
      return p;
    }));

    const movement: StockMovement = {
      id: 'mov-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Return',
      sku: batch.sku,
      productName: batch.productName,
      quantity: -batch.quantity,
      referenceNo: `RTS-BATCH-${batch.batchNumber}`,
      note: 'Returned to Supplier (near expiry)',
      actor: `${currentUser.name} (${currentUser.role})`
    };
    setStockMovements(prev => [movement, ...prev]);

    addAuditLog('RETURN_TO_SUPPLIER', 'Batch', batch.batchNumber, `Returned ${batch.quantity} units to supplier for credit`);
    addToast('warning', 'RTS Initiated', `Batch #${batch.batchNumber} (${batch.quantity} units) marked for return to supplier`);
  };

  const writeOffBatch = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    setBatches(prev => prev.filter(b => b.id !== batchId));
    setProducts(prev => prev.map(p => {
      if (p.id === batch.productId) {
        const newStock = Math.max(0, p.inStock - batch.quantity);
        return {
          ...p,
          inStock: newStock,
          damaged: p.damaged + batch.quantity,
          status: newStock === 0 ? 'Out of Stock' : newStock <= p.minThreshold ? 'Low' : 'Healthy'
        };
      }
      return p;
    }));

    const movement: StockMovement = {
      id: 'mov-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Damage',
      sku: batch.sku,
      productName: batch.productName,
      quantity: -batch.quantity,
      referenceNo: `WRITEOFF-${batch.batchNumber}`,
      note: 'Expired / written-off inventory',
      actor: `${currentUser.name} (${currentUser.role})`
    };
    setStockMovements(prev => [movement, ...prev]);

    addAuditLog('WRITE_OFF_BATCH', 'Batch', batch.batchNumber, `Written off ${batch.quantity} units. Loss: $${(batch.quantity * batch.purchasePrice).toFixed(2)}`);
    addToast('error', 'Inventory Written Off', `Batch #${batch.batchNumber} has been written off and removed from sellable stock`);
  };

  // Sales
  const createSale = (saleData: Omit<SaleTransaction, 'id' | 'invoiceNumber' | 'time'>) => {
    const invoiceNum = `TRX-${9825 + sales.length}`;
    const newSale: SaleTransaction = {
      ...saleData,
      id: 'sale-' + Date.now(),
      invoiceNumber: invoiceNum,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Deduct stock for each line item
    setProducts(prev => prev.map(p => {
      const item = saleData.items.find(i => i.productId === p.id);
      if (item) {
        const totalDeducted = item.quantity + (item.freeQuantity || 0);
        const newStock = Math.max(0, p.inStock - totalDeducted);
        let newStatus: Product['status'] = 'Healthy';
        if (newStock === 0) newStatus = 'Out of Stock';
        else if (newStock <= p.minThreshold) newStatus = 'Low';

        return {
          ...p,
          inStock: newStock,
          status: newStatus
        };
      }
      return p;
    }));

    // Record Stock Movements
    saleData.items.forEach(item => {
      const movement: StockMovement = {
        id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Sale',
        sku: item.sku,
        productName: item.name,
        quantity: -(item.quantity + (item.freeQuantity || 0)),
        referenceNo: invoiceNum,
        actor: `${currentUser.name} (${currentUser.role})`
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    // Update Customer Outstanding if credit sale
    if (newSale.balanceDue > 0) {
      setCustomers(prev => prev.map(c => {
        if (c.id === newSale.customerId) {
          return {
            ...c,
            outstandingBalance: c.outstandingBalance + newSale.balanceDue,
            lastOrderDate: 'Today, ' + newSale.time
          };
        }
        return c;
      }));
    }

    setSales(prev => [newSale, ...prev]);
    addAuditLog('CREATE_SALE', 'SaleTransaction', invoiceNum, `Total: $${newSale.totalAmount.toFixed(2)}, Cust: ${newSale.customerName}, Paid: $${newSale.amountPaid}`);
    addToast('success', 'Sale Confirmed', `Invoice ${invoiceNum} generated ($${newSale.totalAmount.toFixed(2)})`);
  };

  // Purchases
  const createPurchase = (purchaseData: Omit<PurchaseTransaction, 'id' | 'invoiceNumber'>) => {
    const invoiceNum = `PO-2026-${882 + purchases.length}`;
    const newPurchase: PurchaseTransaction = {
      ...purchaseData,
      id: 'pur-' + Date.now(),
      invoiceNumber: invoiceNum
    };

    // Add inventory
    setProducts(prev => prev.map(p => {
      const item = purchaseData.items.find(i => i.productId === p.id);
      if (item) {
        const totalAdded = item.quantity + (item.freeQuantity || 0);
        const newStock = p.inStock + totalAdded;
        return {
          ...p,
          inStock: newStock,
          status: newStock <= p.minThreshold ? 'Low' : 'Healthy'
        };
      }
      return p;
    }));

    // Record Stock Movements
    purchaseData.items.forEach(item => {
      const movement: StockMovement = {
        id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Purchase',
        sku: item.sku,
        productName: item.name,
        quantity: item.quantity + (item.freeQuantity || 0),
        referenceNo: invoiceNum,
        actor: `${currentUser.name} (${currentUser.role})`
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    setPurchases(prev => [newPurchase, ...prev]);
    addAuditLog('CREATE_PURCHASE', 'PurchaseTransaction', invoiceNum, `Total: $${newPurchase.totalAmount.toFixed(2)}, Sup: ${newPurchase.supplierName}`);
    addToast('success', 'Purchase Recorded', `Inbound ${invoiceNum} added to inventory`);
  };

  // Collections
  const recordCollectionPayment = (customerId: string, amount: number, method: 'Cash' | 'Cheque' | 'UPI' | 'NEFT/RTGS', notes?: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    const receiptNum = `RCP-${1093 + collections.length}`;
    const newCollection: PaymentCollection = {
      id: 'col-' + Date.now(),
      receiptNumber: receiptNum,
      customerId,
      customerName: cust.name,
      invoiceNumber: 'ON-ACCOUNT',
      amount,
      paymentMethod: method,
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recordedBy: currentUser.name,
      notes
    };

    setCollections(prev => [newCollection, ...prev]);
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newOutstanding = Math.max(0, c.outstandingBalance - amount);
        const newOverdue = Math.max(0, c.overdueAmount - amount);
        return {
          ...c,
          outstandingBalance: newOutstanding,
          overdueAmount: newOverdue
        };
      }
      return c;
    }));

    addAuditLog('RECORD_PAYMENT', 'PaymentCollection', receiptNum, `Collected $${amount.toFixed(2)} from ${cust.name} via ${method}`);
    addToast('success', 'Payment Recorded', `Receipt ${receiptNum} issued for $${amount.toFixed(2)} from ${cust.name}`);
  };

  // AI Invoice Scanner Handlers
  const updateExtractedItem = (itemId: string, updates: any) => {
    setExtractedInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
    }));
  };

  const resolveUncertainItemMatch = (itemId: string, matchedProduct: Product, confidence: number) => {
    setExtractedInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            matchedProductId: matchedProduct.id,
            matchedProductName: matchedProduct.name,
            matchedSku: matchedProduct.sku,
            matchConfidence: confidence,
            matchStatus: 'Matched',
            isExpiryMissing: false,
            expiryDate: item.expiryDate === 'MISSING' ? '12/2026' : item.expiryDate,
            batchNumber: item.batchNumber === 'UNK' ? 'LIP-0824' : item.batchNumber
          };
        }
        return item;
      })
    }));
    addToast('success', 'Match Resolved', `Matched with master SKU: ${matchedProduct.sku}`);
  };

  const removeExtractedItem = (itemId: string) => {
    setExtractedInvoice(prev => ({
      ...prev,
      items: prev.items.filter(i => i.id !== itemId)
    }));
  };

  const addExtractedItem = (item: any) => {
    const newItem = {
      id: 'ext-' + Date.now(),
      ...item
    };
    setExtractedInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const confirmExtractedInvoice = () => {
    // Convert extracted items to a confirmed Purchase
    const purchaseItems = extractedInvoice.items.map(item => ({
      productId: item.matchedProductId || 'prod-1',
      sku: item.matchedSku || 'SKU-GEN',
      name: item.matchedProductName || item.extractedName,
      quantity: item.quantity,
      freeQuantity: 0,
      unitPrice: item.rate,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      totalAmount: item.quantity * item.rate
    }));

    const totalVal = purchaseItems.reduce((sum, i) => sum + i.totalAmount, 0);

    const newPurchase: PurchaseTransaction = {
      id: 'pur-' + Date.now(),
      invoiceNumber: extractedInvoice.invoiceNumber,
      supplierId: extractedInvoice.supplierId || 'sup-3',
      supplierName: extractedInvoice.supplierName,
      date: new Date().toISOString().substring(0, 10),
      items: purchaseItems,
      totalAmount: totalVal,
      paymentStatus: 'Pending',
      isAiScanned: true,
      status: 'Confirmed'
    };

    // Update product stock levels
    setProducts(prev => prev.map(p => {
      const matched = purchaseItems.find(i => i.productId === p.id);
      if (matched) {
        const newStock = p.inStock + matched.quantity;
        return {
          ...p,
          inStock: newStock,
          status: newStock <= p.minThreshold ? 'Low' : 'Healthy'
        };
      }
      return p;
    }));

    // Add batches
    const newBatches: Batch[] = purchaseItems.map(item => ({
      id: 'bat-' + Date.now() + Math.random().toString(36).substr(2, 4),
      productId: item.productId,
      sku: item.sku,
      productName: item.name,
      batchNumber: item.batchNumber,
      quantity: item.quantity,
      purchasePrice: item.unitPrice,
      expiryDate: item.expiryDate.includes('/') ? `2026-${item.expiryDate.replace('/', '-')}-01` : item.expiryDate,
      daysToExpiry: 120,
      mfgDate: '2026-08-01',
      status: 'healthy'
    }));
    setBatches(prev => [...prev, ...newBatches]);

    // Create Stock movements
    purchaseItems.forEach(item => {
      const movement: StockMovement = {
        id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Purchase',
        sku: item.sku,
        productName: item.name,
        quantity: item.quantity,
        referenceNo: extractedInvoice.invoiceNumber,
        actor: `${currentUser.name} (${currentUser.role})`
      };
      setStockMovements(prev => [movement, ...prev]);
    });

    setPurchases(prev => [newPurchase, ...prev]);
    setExtractedInvoice(prev => ({ ...prev, status: 'confirmed' }));

    addAuditLog('CONFIRM_AI_INVOICE', 'PurchaseTransaction', extractedInvoice.invoiceNumber, `Confirmed AI invoice with ${purchaseItems.length} lines. Inbound total: $${totalVal.toFixed(2)}`);
    addToast('success', 'Invoice Confirmed & Stock Updated', `Added ${purchaseItems.reduce((acc, i) => acc + i.quantity, 0)} units from ${extractedInvoice.supplierName} to stock ledger.`);
  };

  const resetExtractedInvoice = () => {
    setExtractedInvoice(INITIAL_EXTRACTED_INVOICE);
    addToast('info', 'Scanner Reset', 'Invoice scan data restored to demo state.');
  };

  // AI Assistant Query Engine
  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };

    setChatMessages(prev => [...prev, userMsg]);

    const lower = text.toLowerCase();
    setTimeout(() => {
      let reply: ChatMessage;

      if (lower.includes('city retailers') || (lower.includes('pending') && lower.includes('city'))) {
        const cust = customers.find(c => c.name.toLowerCase().includes('city'));
        const pendingTotal = cust ? cust.outstandingBalance : 14250.00;

        reply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Currently, there is $${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} pending from City Retailers. This spans across 4 overdue invoices.`,
          structuredData: {
            type: 'pending_invoices',
            title: 'TOP PENDING INVOICES',
            totalHighlight: `$${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            items: [
              { label: 'INV-802', value: '$6,400', percentage: 45, color: '#8B2626' },
              { label: 'INV-815', value: '$4,250', percentage: 30, color: '#D4AF37' },
              { label: 'INV-829', value: '$2,100', percentage: 15, color: '#1A1A1A' },
              { label: 'INV-833', value: '$1,500', percentage: 10, color: '#78746D' }
            ],
            actionButtons: [
              { label: 'View Collection List', icon: 'receipt_long', actionType: 'navigate_collections', payload: { customerId: 'cust-1' } },
              { label: 'Send Reminder', icon: 'mail', actionType: 'send_reminder', payload: { customerId: 'cust-1' } }
            ]
          }
        };
      } else if (lower.includes('sold the most') || lower.includes('top product') || lower.includes('best selling')) {
        reply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Sparkling Cola 500ml x24 (BEV-092-COL) is your highest velocity product this month with 2,420 units sold ($36,300 total revenue), followed by Liquid Detergent 2L.`,
          structuredData: {
            type: 'top_products',
            title: 'TOP SELLING PRODUCTS (MTD)',
            items: [
              { label: 'BEV-092-COL (Cola x24)', value: '2,420 units ($36.3k)', percentage: 85, color: '#1A1A1A' },
              { label: 'HOU-882-DET (Detergent 2L)', value: '890 units ($7.1k)', percentage: 45, color: '#234E3E' },
              { label: 'DOV-SOAP-100 (Dove 100g)', value: '740 units ($1.3k)', percentage: 38, color: '#8C733E' },
              { label: 'SNA-110-CHI (Chips 150g)', value: '620 units ($2.4k)', percentage: 30, color: '#9C5B23' }
            ],
            actionButtons: [
              { label: 'View Sales Report', icon: 'assessment', actionType: 'navigate_reports' }
            ]
          }
        };
      } else if (lower.includes('expiry') || lower.includes('risk') || lower.includes('expiring')) {
        reply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `You have 3 high-risk batches nearing expiry within 15 days. Immediate FEFO clearance or supplier returns are recommended.`,
          structuredData: {
            type: 'expiry_risks',
            title: 'CRITICAL EXPIRY RISK BATCHES',
            items: [
              { label: 'DAI-YOG-01 (Greek Yogurt Plain)', value: '45 units (4 Days Left)', badge: 'FEFO 30% Promo', color: '#8B2626' },
              { label: 'DAI-405-MIL (Full Cream Milk 1L)', value: '12 Damaged (8 Days Left)', badge: 'Write-off', color: '#8B2626' },
              { label: 'BEV-JUI-12 (Orange Juice 250ml)', value: '120 units (12 Days Left)', badge: 'FEFO 15% Promo', color: '#D4AF37' }
            ],
            actionButtons: [
              { label: 'Go to Expiry Center', icon: 'event_busy', actionType: 'navigate_inventory' }
            ]
          }
        };
      } else if (lower.includes('reorder') || lower.includes('low stock') || lower.includes('threshold')) {
        reply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `AI Stock Analysis identified 2 items requiring urgent replenishment: Parle-G 80g (stock depleted in ~2 days) and Full Cream Milk 1L (currently 0 stock).`,
          structuredData: {
            type: 'reorder_summary',
            title: 'SUGGESTED REORDER QUANTITIES',
            items: [
              { label: 'PAR-GLU-80 (Parle-G 80g)', value: 'Suggested PO: 500 units', color: '#8C733E' },
              { label: 'DAI-405-MIL (UHT Milk 1L)', value: 'Suggested PO: 250 units', color: '#8B2626' },
              { label: 'SNA-110-CHI (Chips 150g)', value: 'Suggested PO: 300 units', color: '#9C5B23' }
            ],
            actionButtons: [
              { label: 'Generate AI POs', icon: 'auto_awesome', actionType: 'trigger_ai_optimizer' }
            ]
          }
        };
      } else {
        reply = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I've analyzed your distributor database for "${text}". Total revenue today is $12,450 (+12% vs yesterday), active stock value is $120,000 across 12 SKUs, and total receivables stand at $45,300. How else can I assist with your supply chain decisions?`
        };
      }

      setChatMessages(prev => [...prev, reply]);
    }, 600);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setBatches(INITIAL_BATCHES);
    setCustomers(INITIAL_CUSTOMERS);
    setSuppliers(INITIAL_SUPPLIERS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    setSales(INITIAL_SALES);
    setPurchases(INITIAL_PURCHASES);
    setExtractedInvoice(INITIAL_EXTRACTED_INVOICE);
    setPredictiveInsights(INITIAL_PREDICTIVE_INSIGHTS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCurrentTenant(INITIAL_TENANT);
    setPermissionMatrix(INITIAL_PERMISSION_MATRIX);
    setIsAuthenticated(true);
    addToast('info', 'System Reset', 'All data reverted to default sample dataset.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        navigateTo,
        isAuthenticated,
        login,
        signup,
        logout,
        forgotPassword,
        currentTenant,
        updateTenant,
        currentUser,
        setCurrentUser,
        users,
        addStaffMember,
        updateStaffMember,
        changeStaffRole,
        suspendStaffMember,
        reactivateStaffMember,
        deactivateStaffMember,
        resendInvitation,
        permissionMatrix,
        updatePermissionMatrixRule,
        elevatedActionRequest,
        requestElevatedAction,
        confirmElevatedAction,
        cancelElevatedAction,
        globalSearch,
        setGlobalSearch,
        products,
        batches,
        customers,
        suppliers,
        stockMovements,
        sales,
        purchases,
        collections,
        auditLogs,
        predictiveInsights,
        chatMessages,
        extractedInvoice,
        isAiOptimizerOpen,
        setIsAiOptimizerOpen,
        isAddStockOpen,
        setIsAddStockOpen,
        isNewSaleOpen,
        setIsNewSaleOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        selectedCustomerIdForPayment,
        setSelectedCustomerIdForPayment,
        isStockAdjustmentOpen,
        setIsStockAdjustmentOpen,
        selectedProductForAdjustment,
        setSelectedProductForAdjustment,
        activeInvoiceToPrint,
        setActiveInvoiceToPrint,
        toasts,
        addToast,
        removeToast,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        updateCustomer,
        addSupplier,
        updateSupplier,
        recordStockAdjustment,
        applyExpiryDiscount,
        returnBatchToSupplier,
        writeOffBatch,
        createSale,
        createPurchase,
        recordCollectionPayment,
        updateExtractedItem,
        resolveUncertainItemMatch,
        removeExtractedItem,
        addExtractedItem,
        confirmExtractedInvoice,
        resetExtractedInvoice,
        sendChatMessage,
        resetToDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
