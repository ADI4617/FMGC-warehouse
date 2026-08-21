import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import {
  userRepository,
  productRepository,
  batchRepository,
  customerRepository,
  supplierRepository,
  salesRepository,
  purchaseRepository,
  collectionRepository,
  stockMovementRepository,
  auditLogRepository,
  insightRepository
} from '../repositories/allRepositories.js';
import { tenantRepository } from '../repositories/tenantRepository.js';

// Auth Service
export const authService = {
  async login(email: string, password: string, ip?: string) {
    const user = userRepository.findByEmail(email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended' || user.status === 'deactivated') {
      throw AppError.forbidden(`Account is ${user.status}. Contact administrator.`);
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tenant = tenantRepository.findById(user.tenant_id);

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId: user.tenant_id,
        role: user.role,
        email: user.email,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as '24h' }
    );

    // Update last_active
    userRepository.update(user.id, user.tenant_id, { last_active: 'Just now' });

    // Audit log
    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: user.tenant_id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: user.name,
      actor_role: user.role,
      action: 'USER_LOGIN',
      entity: 'Authentication',
      entity_id: user.email,
      previous_value: null,
      new_value: `Successful login as ${user.role}`,
      reason: 'Session authorized',
      ip_address: ip || '127.0.0.1'
    });

    const { password_hash, ...userWithoutPassword } = user;
    return {
      token,
      user: {
        ...userWithoutPassword,
        permissions: JSON.parse(user.permissions || '[]'),
        accessModules: JSON.parse(user.access_modules || '[]'),
      },
      tenant
    };
  },

  async signup(data: { fullName: string; businessName: string; email: string; phone?: string; password: string; plan?: string }) {
    const existing = userRepository.findByEmail(data.email);
    if (existing) {
      throw AppError.conflict('An account with this email already exists');
    }

    const tenantId = 'tnt-' + Date.now().toString(36);
    const userId = 'usr-' + Date.now();
    const passwordHash = await bcrypt.hash(data.password, 12);

    const newTenant = {
      id: tenantId,
      name: data.businessName,
      legal_entity: `${data.businessName} Enterprises`,
      gstin: '27AABC' + Math.floor(1000 + Math.random() * 9000) + 'F1Z5',
      email: data.email,
      phone: data.phone || '+91 98200 00000',
      address: 'Central Logistics Hub, Sector 12',
      city: 'Mumbai',
      state: 'Maharashtra',
      currency: 'INR',
      plan: data.plan || 'Enterprise',
      status: 'active',
      created_date: new Date().toISOString().substring(0, 10),
      total_skus_count: 0,
      monthly_revenue_estimate: 1500000
    };

    tenantRepository.create(newTenant);

    const defaultModules = ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings'];
    const defaultPermissions = ['Master Tenant Owner', 'Billing & Subscription', 'Global Config', 'Full Access'];

    const newUser = {
      id: userId,
      tenant_id: tenantId,
      name: data.fullName,
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone || '',
      role: 'Owner',
      department: 'Executive Office',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      last_active: 'Just now',
      date_joined: new Date().toISOString().substring(0, 10),
      permissions: JSON.stringify(defaultPermissions),
      access_modules: JSON.stringify(defaultModules)
    };

    userRepository.create(newUser);

    const token = jwt.sign(
      {
        userId: newUser.id,
        tenantId: newUser.tenant_id,
        role: newUser.role,
        email: newUser.email,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as '24h' }
    );

    return {
      token,
      user: {
        id: newUser.id,
        tenantId: newUser.tenant_id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        department: newUser.department,
        avatar: newUser.avatar,
        status: newUser.status,
        lastActive: newUser.last_active,
        dateJoined: newUser.date_joined,
        permissions: defaultPermissions,
        accessModules: defaultModules
      },
      tenant: newTenant
    };
  }
};

// Staff Service
export const staffService = {
  getStaff(tenantId: string) {
    const list = userRepository.findAllByTenant(tenantId);
    return list.map(u => ({
      id: u.id,
      tenantId: u.tenant_id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      department: u.department,
      avatar: u.avatar,
      status: u.status,
      lastActive: u.last_active,
      dateJoined: u.date_joined,
      permissions: JSON.parse(u.permissions || '[]'),
      accessModules: JSON.parse(u.access_modules || '[]')
    }));
  },

  async inviteStaff(tenantId: string, data: { name: string; email: string; phone?: string; role: string; department?: string; status?: string }) {
    const existing = userRepository.findByEmail(data.email);
    if (existing) {
      throw AppError.conflict('A user with this email already exists');
    }

    const defaultPassword = 'password123';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    const id = 'usr-' + Date.now();

    const accessModules = data.role === 'Owner' || data.role === 'Admin'
      ? ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Customers', 'Suppliers', 'Collections', 'Reports', 'AI Center', 'Staff & Roles', 'Audit Logs', 'Settings']
      : data.role === 'Warehouse'
      ? ['Dashboard', 'Purchase', 'Inventory', 'AI Invoice Scanner', 'Batch & Expiry']
      : data.role === 'Sales Staff'
      ? ['Dashboard', 'Sales', 'Customers']
      : data.role === 'Collection Staff'
      ? ['Dashboard', 'Customers', 'Collections', 'Reports']
      : data.role === 'Manager'
      ? ['Dashboard', 'Sales', 'Purchase', 'Inventory', 'Reports', 'AI Center']
      : ['Dashboard', 'Reports'];

    userRepository.create({
      id,
      tenant_id: tenantId,
      name: data.name,
      email: data.email,
      password_hash: passwordHash,
      phone: data.phone || '',
      role: data.role,
      department: data.department || 'Operations',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: data.status || 'pending',
      last_active: data.status === 'active' ? 'Just now' : 'Invitation sent',
      date_joined: new Date().toISOString().substring(0, 10),
      permissions: JSON.stringify([`${data.role} Access`, 'Scoped Operations']),
      access_modules: JSON.stringify(accessModules)
    });

    return { id, email: data.email, name: data.name, role: data.role };
  },

  updateStaff(tenantId: string, id: string, updates: Record<string, any>) {
    const user = userRepository.findById(id, tenantId);
    if (!user) throw AppError.notFound('Staff member not found');
    userRepository.update(id, tenantId, updates);
    return { success: true };
  }
};

// Inventory & FEFO Service
export const inventoryService = {
  getProducts(tenantId: string) {
    return productRepository.findAll(tenantId).map(p => ({
      id: p.id,
      tenantId: p.tenant_id,
      sku: p.sku,
      name: p.name,
      category: p.category,
      brand: p.brand,
      unit: p.unit,
      purchasePrice: p.purchase_price,
      sellingPrice: p.selling_price,
      mrp: p.mrp,
      inStock: p.in_stock,
      damaged: p.damaged,
      minThreshold: p.min_threshold,
      hsnCode: p.hsn_code,
      gstRate: p.gst_rate,
      status: p.status,
      aiPredictedShortage: Boolean(p.ai_predicted_shortage),
      notes: p.notes
    }));
  },

  getBatches(tenantId: string) {
    return batchRepository.findAll(tenantId).map(b => ({
      id: b.id,
      tenantId: b.tenant_id,
      productId: b.product_id,
      sku: b.sku,
      productName: b.product_name,
      batchNumber: b.batch_number,
      quantity: b.quantity,
      purchasePrice: b.purchase_price,
      expiryDate: b.expiry_date,
      daysToExpiry: b.days_to_expiry,
      mfgDate: b.mfg_date,
      isFefoPriority: Boolean(b.is_fefo_priority),
      status: b.status
    }));
  },

  getMovements(tenantId: string) {
    return stockMovementRepository.findAll(tenantId).map(m => ({
      id: m.id,
      tenantId: m.tenant_id,
      timestamp: m.timestamp,
      timeFormatted: m.time_formatted,
      type: m.type,
      sku: m.sku,
      productName: m.product_name,
      quantity: m.quantity,
      referenceNo: m.reference_no,
      note: m.note,
      actor: m.actor
    }));
  },

  adjustStock(tenantId: string, actor: string, data: { productId: string; batchNumber?: string; quantityDelta: number; reason: string; isDamage?: boolean }) {
    const prod = productRepository.findById(data.productId, tenantId);
    if (!prod) throw AppError.notFound('Product not found');

    const newInStock = Math.max(0, prod.in_stock + (data.isDamage ? -data.quantityDelta : data.quantityDelta));
    const newDamaged = data.isDamage ? prod.damaged + data.quantityDelta : prod.damaged;
    let newStatus = 'Healthy';
    if (newInStock === 0) newStatus = 'Out of Stock';
    else if (newInStock <= prod.min_threshold) newStatus = 'Low';

    productRepository.update(prod.id, tenantId, {
      in_stock: newInStock,
      damaged: newDamaged,
      status: newStatus
    });

    const movement = {
      id: 'mov-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: data.isDamage ? 'Damage' : 'Adj',
      sku: prod.sku,
      product_name: prod.name,
      quantity: data.isDamage ? -data.quantityDelta : data.quantityDelta,
      reference_no: data.isDamage ? 'Damage Inspection' : `Adj: ${data.reason}`,
      note: data.reason,
      actor
    };
    stockMovementRepository.create(movement);

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Operations',
      action: 'STOCK_ADJUSTMENT',
      entity: 'Product',
      entity_id: prod.sku,
      previous_value: `Stock: ${prod.in_stock}`,
      new_value: `Delta: ${data.quantityDelta} units. Reason: ${data.reason}`,
      reason: data.reason
    });

    return { inStock: newInStock, damaged: newDamaged, status: newStatus };
  },

  applyExpiryDiscount(tenantId: string, actor: string, batchId: string, discountPercent: number) {
    const batch = batchRepository.findById(batchId, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');

    const prod = productRepository.findById(batch.product_id, tenantId);
    if (prod) {
      const newPrice = Number((prod.selling_price * (1 - discountPercent / 100)).toFixed(2));
      productRepository.update(prod.id, tenantId, {
        selling_price: newPrice,
        notes: `FEFO Discount applied: ${discountPercent}% off for batch #${batch.batch_number}`
      });
    }

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Operations',
      action: 'APPLY_EXPIRY_DISCOUNT',
      entity: 'Batch',
      entity_id: batch.batch_number,
      previous_value: null,
      new_value: `Applied ${discountPercent}% discount to accelerate sale before expiry (${batch.expiry_date})`,
      reason: 'FEFO Risk Liquidation'
    });

    return { success: true };
  },

  writeOffBatch(tenantId: string, actor: string, batchId: string) {
    const batch = batchRepository.findById(batchId, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');

    batchRepository.delete(batchId, tenantId);

    const prod = productRepository.findById(batch.product_id, tenantId);
    if (prod) {
      const newStock = Math.max(0, prod.in_stock - batch.quantity);
      productRepository.update(prod.id, tenantId, {
        in_stock: newStock,
        damaged: prod.damaged + batch.quantity,
        status: newStock === 0 ? 'Out of Stock' : newStock <= prod.min_threshold ? 'Low' : 'Healthy'
      });
    }

    stockMovementRepository.create({
      id: 'mov-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Damage',
      sku: batch.sku,
      product_name: batch.product_name,
      quantity: -batch.quantity,
      reference_no: `WRITEOFF-${batch.batch_number}`,
      note: 'Expired / written-off inventory',
      actor
    });

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Operations',
      action: 'WRITE_OFF_BATCH',
      entity: 'Batch',
      entity_id: batch.batch_number,
      previous_value: `Quantity: ${batch.quantity}`,
      new_value: `Written off ${batch.quantity} units. Loss: ₹${(batch.quantity * batch.purchase_price).toFixed(2)}`,
      reason: 'Expired inventory write-off'
    });

    return { success: true };
  },

  returnBatchToSupplier(tenantId: string, actor: string, batchId: string) {
    const batch = batchRepository.findById(batchId, tenantId);
    if (!batch) throw AppError.notFound('Batch not found');

    batchRepository.delete(batchId, tenantId);

    const prod = productRepository.findById(batch.product_id, tenantId);
    if (prod) {
      const newStock = Math.max(0, prod.in_stock - batch.quantity);
      productRepository.update(prod.id, tenantId, {
        in_stock: newStock,
        status: newStock === 0 ? 'Out of Stock' : newStock <= prod.min_threshold ? 'Low' : 'Healthy'
      });
    }

    stockMovementRepository.create({
      id: 'mov-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString(),
      time_formatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Return',
      sku: batch.sku,
      product_name: batch.product_name,
      quantity: -batch.quantity,
      reference_no: `RTS-BATCH-${batch.batch_number}`,
      note: 'Returned to Supplier (near expiry)',
      actor
    });

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Operations',
      action: 'RETURN_TO_SUPPLIER',
      entity: 'Batch',
      entity_id: batch.batch_number,
      previous_value: `Quantity: ${batch.quantity}`,
      new_value: `Returned ${batch.quantity} units to supplier for credit`,
      reason: 'RTS near-expiry return'
    });

    return { success: true };
  }
};

// Sales Service
export const salesService = {
  getSales(tenantId: string) {
    return salesRepository.findAll(tenantId).map(s => ({
      id: s.id,
      tenantId: s.tenant_id,
      invoiceNumber: s.invoice_number,
      customerId: s.customer_id,
      customerName: s.customer_name,
      storeName: s.store_name,
      date: s.date,
      time: s.time,
      items: JSON.parse(s.items || '[]'),
      subtotal: s.subtotal,
      discountAmount: s.discount_amount,
      taxAmount: s.tax_amount,
      totalAmount: s.total_amount,
      amountPaid: s.amount_paid,
      balanceDue: s.balance_due,
      paymentMethod: s.payment_method,
      paymentStatus: s.payment_status,
      createdBy: s.created_by
    }));
  },

  createSale(tenantId: string, actor: string, saleData: any) {
    const count = salesRepository.findAll(tenantId).length;
    const invoiceNum = `TRX-${9825 + count}`;
    const newSale = {
      id: 'sale-' + Date.now(),
      tenant_id: tenantId,
      invoice_number: invoiceNum,
      customer_id: saleData.customerId,
      customer_name: saleData.customerName,
      store_name: saleData.storeName || '',
      date: saleData.date || new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: JSON.stringify(saleData.items),
      subtotal: saleData.subtotal,
      discount_amount: saleData.discountAmount || 0,
      tax_amount: saleData.taxAmount || 0,
      total_amount: saleData.totalAmount,
      amount_paid: saleData.amountPaid || 0,
      balance_due: saleData.balanceDue || 0,
      payment_method: saleData.paymentMethod,
      payment_status: saleData.paymentStatus || 'Paid',
      created_by: actor
    };

    // Deduct stock for items
    for (const item of saleData.items) {
      const prod = productRepository.findById(item.productId, tenantId);
      if (prod) {
        const totalDeducted = item.quantity + (item.freeQuantity || 0);
        const newStock = Math.max(0, prod.in_stock - totalDeducted);
        productRepository.update(prod.id, tenantId, {
          in_stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock <= prod.min_threshold ? 'Low' : 'Healthy'
        });

        stockMovementRepository.create({
          id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 4),
          tenant_id: tenantId,
          timestamp: new Date().toISOString(),
          time_formatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Sale',
          sku: item.sku,
          product_name: item.name,
          quantity: -totalDeducted,
          reference_no: invoiceNum,
          actor
        });
      }
    }

    // Update customer outstanding balance if credit sale
    if (saleData.balanceDue > 0) {
      const cust = customerRepository.findById(saleData.customerId, tenantId);
      if (cust) {
        customerRepository.update(cust.id, tenantId, {
          outstanding_balance: cust.outstanding_balance + saleData.balanceDue,
          last_order_date: 'Today, ' + newSale.time
        });
      }
    }

    salesRepository.create(newSale);

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Sales',
      action: 'CREATE_SALE',
      entity: 'SaleTransaction',
      entity_id: invoiceNum,
      previous_value: null,
      new_value: `Total: ₹${saleData.totalAmount.toFixed(2)}, Cust: ${saleData.customerName}`,
      reason: 'Sale invoice generated'
    });

    return { ...newSale, items: saleData.items };
  }
};

// Purchase Service
export const purchaseService = {
  getPurchases(tenantId: string) {
    return purchaseRepository.findAll(tenantId).map(p => ({
      id: p.id,
      tenantId: p.tenant_id,
      invoiceNumber: p.invoice_number,
      supplierId: p.supplier_id,
      supplierName: p.supplier_name,
      date: p.date,
      items: JSON.parse(p.items || '[]'),
      totalAmount: p.total_amount,
      paymentStatus: p.payment_status,
      isAiScanned: Boolean(p.is_ai_scanned),
      status: p.status,
      documentUrl: p.document_url
    }));
  },

  createPurchase(tenantId: string, actor: string, purchaseData: any) {
    const count = purchaseRepository.findAll(tenantId).length;
    const invoiceNum = purchaseData.invoiceNumber || `PO-2026-${882 + count}`;

    const newPurchase = {
      id: 'pur-' + Date.now(),
      tenant_id: tenantId,
      invoice_number: invoiceNum,
      supplier_id: purchaseData.supplierId,
      supplier_name: purchaseData.supplierName,
      date: purchaseData.date || new Date().toISOString().substring(0, 10),
      items: JSON.stringify(purchaseData.items),
      total_amount: purchaseData.totalAmount,
      payment_status: purchaseData.paymentStatus || 'Pending',
      is_ai_scanned: purchaseData.isAiScanned ? 1 : 0,
      status: purchaseData.status || 'Confirmed',
      document_url: purchaseData.documentUrl || null
    };

    // Add stock and batches
    for (const item of purchaseData.items) {
      const prod = productRepository.findById(item.productId, tenantId);
      if (prod) {
        const totalAdded = item.quantity + (item.freeQuantity || 0);
        const newStock = prod.in_stock + totalAdded;
        productRepository.update(prod.id, tenantId, {
          in_stock: newStock,
          status: newStock <= prod.min_threshold ? 'Low' : 'Healthy'
        });

        // Add batch
        batchRepository.create({
          id: 'bat-' + Date.now() + Math.random().toString(36).substr(2, 4),
          tenant_id: tenantId,
          product_id: item.productId,
          sku: item.sku,
          product_name: item.name,
          batch_number: item.batchNumber || 'PO-BATCH',
          quantity: item.quantity,
          purchase_price: item.unitPrice,
          expiry_date: item.expiryDate || '2027-12-31',
          days_to_expiry: 180,
          mfg_date: new Date().toISOString().substring(0, 10),
          is_fefo_priority: 0,
          status: 'healthy'
        });

        stockMovementRepository.create({
          id: 'mov-' + Date.now() + Math.random().toString(36).substr(2, 4),
          tenant_id: tenantId,
          timestamp: new Date().toISOString(),
          time_formatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Purchase',
          sku: item.sku,
          product_name: item.name,
          quantity: totalAdded,
          reference_no: invoiceNum,
          note: null,
          actor
        });
      }
    }

    purchaseRepository.create(newPurchase);

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Warehouse',
      action: 'CREATE_PURCHASE',
      entity: 'PurchaseTransaction',
      entity_id: invoiceNum,
      previous_value: null,
      new_value: `Total: ₹${purchaseData.totalAmount.toFixed(2)}, Sup: ${purchaseData.supplierName}`,
      reason: 'Inward PO created'
    });

    return { ...newPurchase, items: purchaseData.items };
  }
};

// Collections Service
export const collectionService = {
  getCollections(tenantId: string) {
    return collectionRepository.findAll(tenantId).map(c => ({
      id: c.id,
      tenantId: c.tenant_id,
      receiptNumber: c.receipt_number,
      customerId: c.customer_id,
      customerName: c.customer_name,
      invoiceNumber: c.invoice_number,
      amount: c.amount,
      paymentMethod: c.payment_method,
      date: c.date,
      time: c.time,
      recordedBy: c.recorded_by,
      notes: c.notes
    }));
  },

  recordPayment(tenantId: string, actor: string, data: { customerId: string; amount: number; paymentMethod: string; notes?: string }) {
    const cust = customerRepository.findById(data.customerId, tenantId);
    if (!cust) throw AppError.notFound('Customer not found');

    const count = collectionRepository.findAll(tenantId).length;
    const receiptNum = `RCP-${1093 + count}`;

    const newCollection = {
      id: 'col-' + Date.now(),
      tenant_id: tenantId,
      receipt_number: receiptNum,
      customer_id: cust.id,
      customer_name: cust.name,
      invoice_number: 'ON-ACCOUNT',
      amount: data.amount,
      payment_method: data.paymentMethod,
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recorded_by: actor,
      notes: data.notes || null
    };

    collectionRepository.create(newCollection);

    // Reduce customer balances
    const newOutstanding = Math.max(0, cust.outstanding_balance - data.amount);
    const newOverdue = Math.max(0, cust.overdue_amount - data.amount);
    customerRepository.update(cust.id, tenantId, {
      outstanding_balance: newOutstanding,
      overdue_amount: newOverdue
    });

    auditLogRepository.create({
      id: 'aud-' + Date.now(),
      tenant_id: tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      actor_role: 'Collections',
      action: 'RECORD_PAYMENT',
      entity: 'PaymentCollection',
      entity_id: receiptNum,
      previous_value: `Outstanding: ₹${cust.outstanding_balance}`,
      new_value: `Collected ₹${data.amount.toFixed(2)} via ${data.paymentMethod}`,
      reason: 'Customer payment recorded'
    });

    return newCollection;
  }
};

// Customer & Supplier CRUD Services
export const customerService = {
  getCustomers(tenantId: string) {
    return customerRepository.findAll(tenantId).map(c => ({
      id: c.id,
      tenantId: c.tenant_id,
      code: c.code,
      name: c.name,
      storeName: c.store_name,
      contactPerson: c.contact_person,
      phone: c.phone,
      email: c.email,
      address: c.address,
      zone: c.zone,
      creditLimit: c.credit_limit,
      outstandingBalance: c.outstanding_balance,
      overdueAmount: c.overdue_amount,
      paymentTermsDays: c.payment_terms_days,
      status: c.status,
      lastOrderDate: c.last_order_date
    }));
  },

  createCustomer(tenantId: string, actor: string, data: any) {
    const count = customerRepository.findAll(tenantId).length;
    const code = `CUST-00${count + 1}`;
    const id = 'cust-' + (count + 1);

    const newCust = {
      id,
      tenant_id: tenantId,
      code,
      name: data.name,
      store_name: data.storeName || '',
      contact_person: data.contactPerson || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      zone: data.zone || 'Central',
      credit_limit: data.creditLimit || 0,
      outstanding_balance: data.outstandingBalance || 0,
      overdue_amount: data.overdueAmount || 0,
      payment_terms_days: data.paymentTermsDays || 30,
      status: data.status || 'active',
      last_order_date: 'New'
    };

    customerRepository.create(newCust);
    return newCust;
  }
};

export const supplierService = {
  getSuppliers(tenantId: string) {
    return supplierRepository.findAll(tenantId).map(s => ({
      id: s.id,
      tenantId: s.tenant_id,
      code: s.code,
      name: s.name,
      contactPerson: s.contact_person,
      phone: s.phone,
      email: s.email,
      gstin: s.gstin,
      address: s.address,
      payableBalance: s.payable_balance,
      totalPurchases: s.total_purchases,
      rating: s.rating,
      leadTimeDays: s.lead_time_days
    }));
  },

  createSupplier(tenantId: string, actor: string, data: any) {
    const count = supplierRepository.findAll(tenantId).length;
    const code = `SUP-${count + 1}`;
    const id = 'sup-' + (count + 1);

    const newSup = {
      id,
      tenant_id: tenantId,
      code,
      name: data.name,
      contact_person: data.contactPerson || '',
      phone: data.phone || '',
      email: data.email || '',
      gstin: data.gstin || '',
      address: data.address || '',
      payable_balance: data.payableBalance || 0,
      total_purchases: data.totalPurchases || 0,
      rating: data.rating || 5,
      lead_time_days: data.leadTimeDays || 2
    };

    supplierRepository.create(newSup);
    return newSup;
  }
};

// Dashboard KPI Service
export const dashboardService = {
  getStats(tenantId: string) {
    const products = productRepository.findAll(tenantId);
    const sales = salesRepository.findAll(tenantId);
    const customers = customerRepository.findAll(tenantId);
    const batches = batchRepository.findAll(tenantId);
    const suppliers = supplierRepository.findAll(tenantId);

    const totalStockValue = products.reduce((sum, p) => sum + (p.in_stock * p.selling_price), 0);
    const totalReceivables = customers.reduce((sum, c) => sum + c.outstanding_balance, 0);
    const totalPayables = suppliers.reduce((sum, s) => sum + s.payable_balance, 0);
    const lowStockCount = products.filter(p => p.in_stock <= p.min_threshold).length;
    const nearExpiryCount = batches.filter(b => b.days_to_expiry <= 15).length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);

    return {
      totalRevenue,
      totalStockValue,
      totalReceivables,
      totalPayables,
      lowStockCount,
      nearExpiryCount,
      activeSkuCount: products.length,
      customerCount: customers.length,
      currency: 'INR'
    };
  }
};

// Audit Logs Service
export const auditService = {
  getLogs(tenantId: string) {
    return auditLogRepository.findAll(tenantId).map(l => ({
      id: l.id,
      tenantId: l.tenant_id,
      timestamp: l.timestamp,
      actor: l.actor,
      actorRole: l.actor_role,
      action: l.action,
      entity: l.entity,
      entityId: l.entity_id,
      previousValue: l.previous_value,
      newValue: l.new_value,
      reason: l.reason,
      ipAddress: l.ip_address
    }));
  }
};
