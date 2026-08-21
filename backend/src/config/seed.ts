import bcrypt from 'bcryptjs';
import { getDb, initializeDatabase } from './database.js';
import { logger } from './logger.js';

const TENANT_ID = 'tnt-001';
const DEFAULT_PASSWORD = 'password123';

export async function seedDatabase(): Promise<void> {
  const db = getDb();

  // Check if already seeded
  const existing = db.prepare('SELECT COUNT(*) as count FROM tenants').get() as { count: number };
  if (existing.count > 0) {
    logger.info('Database already seeded, skipping');
    return;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  logger.info('Seeding database with demo data (Currency: INR ₹)...');

  const insertTenant = db.prepare(`
    INSERT INTO tenants (id, name, legal_entity, gstin, email, phone, address, city, state, currency, plan, status, created_date, total_skus_count, monthly_revenue_estimate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTenant.run(
    TENANT_ID, 'Apex FMCG Distributors Ltd.', 'Apex Consumer Goods Distribution Pvt Ltd',
    '27AABCA1234F1Z8', 'ops@apexfmcg.com', '+91 22 2840 9100',
    'Warehouse Block 4-C, Logistics Corridor, Andheri East', 'Mumbai', 'Maharashtra',
    'INR', 'Enterprise', 'active', '2025-04-12', 12, 3450000
  );

  // Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, tenant_id, name, email, password_hash, phone, role, department, avatar, status, last_active, date_joined, permissions, access_modules)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    { id: 'usr-1', name: 'Rajesh Kumar', email: 'rajesh.k@apexfmcg.com', phone: '+91 98201 44521', role: 'Admin', dept: 'Executive Operations', status: 'active', perms: '["All Modules","User Provisioning","Audit Ledgers","Data Exports"]', modules: '["Dashboard","Sales","Purchase","Inventory","Customers","Suppliers","Collections","Reports","AI Center","Staff & Roles","Audit Logs","Settings"]' },
    { id: 'usr-2', name: 'Sarah Jenkins', email: 'sarah.j@apexfmcg.com', phone: '+91 98200 11000', role: 'Owner', dept: 'Executive Office', status: 'active', perms: '["Master Tenant Owner","Billing & Subscription","Global Config","Full Access"]', modules: '["Dashboard","Sales","Purchase","Inventory","Customers","Suppliers","Collections","Reports","AI Center","Staff & Roles","Audit Logs","Settings"]' },
    { id: 'usr-3', name: 'Amit Sharma', email: 'amit.s@apexfmcg.com', phone: '+91 98334 11290', role: 'Warehouse', dept: 'Central Warehouse Depot', status: 'active', perms: '["Stock Inward","AI Invoice Match","Batch & Expiry Track","Damage Logging"]', modules: '["Dashboard","Purchase","Inventory","AI Invoice Scanner","Batch & Expiry"]' },
    { id: 'usr-4', name: 'Priya Patil', email: 'priya.p@apexfmcg.com', phone: '+91 98192 77482', role: 'Sales Staff', dept: 'Field Sales - West Sector', status: 'active', perms: '["POS Billing","Retailer Ledger Lookup","Order Entry","Route Dispatch"]', modules: '["Dashboard","Sales","Customers"]' },
    { id: 'usr-5', name: 'Sneha Joshi', email: 'sneha.j@apexfmcg.com', phone: '+91 98765 43210', role: 'Collection Staff', dept: 'Collections', status: 'active', perms: '["Payment Collection","Receipt Generation"]', modules: '["Dashboard","Customers","Collections","Reports"]' },
    { id: 'usr-6', name: 'Vikram Singh', email: 'vikram.s@apexfmcg.com', phone: '+91 91234 56789', role: 'Manager', dept: 'Operations', status: 'active', perms: '["Operations Management","Reporting"]', modules: '["Dashboard","Sales","Purchase","Inventory","Reports","AI Center"]' },
    { id: 'usr-7', name: 'Demo Viewer', email: 'viewer@apexfmcg.com', phone: '', role: 'Viewer', dept: 'External', status: 'active', perms: '["Read Only"]', modules: '["Dashboard","Reports"]' },
  ];

  for (const u of users) {
    insertUser.run(u.id, TENANT_ID, u.name, u.email, passwordHash, u.phone, u.role, u.dept, '', u.status, 'Today', '2025-05-10', u.perms, u.modules);
  }

  // Products (in INR ₹)
  const insertProduct = db.prepare(`
    INSERT INTO products (id, tenant_id, sku, name, category, brand, unit, purchase_price, selling_price, mrp, in_stock, damaged, min_threshold, hsn_code, gst_rate, status, ai_predicted_shortage, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    { id: 'prod-1', sku: 'DOV-SOAP-100', name: 'Dove Beauty Bar Soap 100g', category: 'Personal Care', brand: 'Dove (Unilever)', unit: 'Box (144 pcs)', pp: 95.00, sp: 140.00, mrp: 160.00, stock: 856, dmg: 12, thresh: 200, hsn: '3401', gst: 18, status: 'Healthy', ai: 0 },
    { id: 'prod-2', sku: 'BEV-092-COL', name: 'Sparkling Cola 500ml x24', category: 'Beverages', brand: 'Coca-Cola', unit: 'Case (24 btls)', pp: 720.00, sp: 960.00, mrp: 1100.00, stock: 420, dmg: 0, thresh: 100, hsn: '2202', gst: 12, status: 'Healthy', ai: 0 },
    { id: 'prod-3', sku: 'DAI-YOG-01', name: 'Greek Yogurt Plain 200g', category: 'Dairy', brand: 'Amul', unit: 'Pack (12 cups)', pp: 180.00, sp: 270.00, mrp: 300.00, stock: 45, dmg: 3, thresh: 50, hsn: '0403', gst: 5, status: 'Low', ai: 1 },
    { id: 'prod-4', sku: 'PAR-GLU-80', name: 'Parle-G Glucose Biscuits 80g', category: 'Snacks', brand: 'Parle', unit: 'Carton (120 pkts)', pp: 22.00, sp: 30.00, mrp: 35.00, stock: 38, dmg: 0, thresh: 300, hsn: '1905', gst: 5, status: 'Low', ai: 1 },
    { id: 'prod-5', sku: 'HOU-882-DET', name: 'Liquid Detergent 2L', category: 'Household', brand: 'Surf Excel', unit: 'Bottle', pp: 380.00, sp: 520.00, mrp: 599.00, stock: 310, dmg: 5, thresh: 80, hsn: '3402', gst: 18, status: 'Healthy', ai: 0 },
    { id: 'prod-6', sku: 'DAI-405-MIL', name: 'Full Cream Milk 1L', category: 'Dairy', brand: 'Amul', unit: 'Tetra Pack', pp: 58.00, sp: 72.00, mrp: 75.00, stock: 0, dmg: 12, thresh: 100, hsn: '0401', gst: 0, status: 'Out of Stock', ai: 1 },
    { id: 'prod-7', sku: 'SNA-110-CHI', name: "Lay's Classic Salted Chips 150g", category: 'Snacks', brand: "Lay's (PepsiCo)", unit: 'Carton (48 pkts)', pp: 120.00, sp: 160.00, mrp: 180.00, stock: 192, dmg: 0, thresh: 100, hsn: '2005', gst: 12, status: 'Healthy', ai: 0 },
    { id: 'prod-8', sku: 'BEV-JUI-12', name: 'Orange Juice 250ml Pack', category: 'Beverages', brand: 'Tropicana', unit: 'Pack (30 units)', pp: 110.00, sp: 150.00, mrp: 175.00, stock: 120, dmg: 0, thresh: 60, hsn: '2009', gst: 12, status: 'Healthy', ai: 0 },
    { id: 'prod-9', sku: 'PC-SH-200', name: 'Head & Shoulders Shampoo 200ml', category: 'Personal Care', brand: 'P&G', unit: 'Bottle', pp: 240.00, sp: 340.00, mrp: 390.00, stock: 225, dmg: 2, thresh: 50, hsn: '3305', gst: 18, status: 'Healthy', ai: 0 },
    { id: 'prod-10', sku: 'GRO-ATT-1K', name: 'Aashirvaad Atta 1kg', category: 'Groceries', brand: 'ITC', unit: 'Bag', pp: 52.00, sp: 68.00, mrp: 75.00, stock: 480, dmg: 0, thresh: 150, hsn: '1101', gst: 0, status: 'Healthy', ai: 0 },
    { id: 'prod-11', sku: 'PC-TPST-150', name: 'Colgate MaxFresh Toothpaste 150g', category: 'Personal Care', brand: 'Colgate', unit: 'Tube', pp: 85.00, sp: 120.00, mrp: 135.00, stock: 344, dmg: 0, thresh: 80, hsn: '3306', gst: 18, status: 'Healthy', ai: 0 },
    { id: 'prod-12', sku: 'BEV-TEA-250', name: 'Tata Gold Tea 250g', category: 'Beverages', brand: 'Tata Consumer', unit: 'Pack', pp: 195.00, sp: 260.00, mrp: 290.00, stock: 155, dmg: 0, thresh: 50, hsn: '0902', gst: 5, status: 'Healthy', ai: 0 },
  ];

  for (const p of products) {
    insertProduct.run(p.id, TENANT_ID, p.sku, p.name, p.category, p.brand, p.unit, p.pp, p.sp, p.mrp, p.stock, p.dmg, p.thresh, p.hsn, p.gst, p.status, p.ai, null);
  }

  // Batches
  const insertBatch = db.prepare(`
    INSERT INTO batches (id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, days_to_expiry, mfg_date, is_fefo_priority, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const batches = [
    { id: 'bat-1', pid: 'prod-3', sku: 'DAI-YOG-01', pname: 'Greek Yogurt Plain 200g', bn: 'YOG-0824', qty: 45, pp: 180.00, exp: '2026-08-25', dte: 4, mfg: '2026-08-01', fefo: 1, status: 'near_expiry' },
    { id: 'bat-2', pid: 'prod-6', sku: 'DAI-405-MIL', pname: 'Full Cream Milk 1L', bn: 'MIL-0712', qty: 12, pp: 58.00, exp: '2026-08-29', dte: 8, mfg: '2026-07-12', fefo: 1, status: 'near_expiry' },
    { id: 'bat-3', pid: 'prod-8', sku: 'BEV-JUI-12', pname: 'Orange Juice 250ml Pack', bn: 'OJ-0901', qty: 120, pp: 110.00, exp: '2026-09-03', dte: 12, mfg: '2026-06-01', fefo: 0, status: 'near_expiry' },
    { id: 'bat-4', pid: 'prod-1', sku: 'DOV-SOAP-100', pname: 'Dove Beauty Bar Soap 100g', bn: 'DOV-0625', qty: 200, pp: 95.00, exp: '2027-06-25', dte: 305, mfg: '2026-01-01', fefo: 0, status: 'healthy' },
    { id: 'bat-5', pid: 'prod-2', sku: 'BEV-092-COL', pname: 'Sparkling Cola 500ml x24', bn: 'COL-1124', qty: 420, pp: 720.00, exp: '2027-11-24', dte: 460, mfg: '2026-05-01', fefo: 0, status: 'healthy' },
    { id: 'bat-6', pid: 'prod-5', sku: 'HOU-882-DET', pname: 'Liquid Detergent 2L', bn: 'DET-0326', qty: 310, pp: 380.00, exp: '2028-03-26', dte: 580, mfg: '2026-03-01', fefo: 0, status: 'healthy' },
  ];

  for (const b of batches) {
    insertBatch.run(b.id, TENANT_ID, b.pid, b.sku, b.pname, b.bn, b.qty, b.pp, b.exp, b.dte, b.mfg, b.fefo ? 1 : 0, b.status);
  }

  // Customers
  const insertCustomer = db.prepare(`
    INSERT INTO customers (id, tenant_id, code, name, store_name, contact_person, phone, email, address, zone, credit_limit, outstanding_balance, overdue_amount, payment_terms_days, status, last_order_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const customers = [
    { id: 'cust-1', code: 'CUST-001', name: 'City Retailers', store: 'City Corner Store', cp: 'Ramesh Gupta', ph: '+91 98765 43210', email: 'city.retailers@email.com', addr: '42 MG Road, Andheri West', zone: 'West Zone', cl: 500000, ob: 142500, oa: 64000, ptd: 30, status: 'active', lod: 'Today, 09:15 AM' },
    { id: 'cust-2', code: 'CUST-002', name: 'Metro Mart', store: 'Metro Supermart', cp: 'Sunita Deshpande', ph: '+91 87654 32109', email: 'metro.mart@email.com', addr: '101 Link Road, Bandra', zone: 'North Zone', cl: 750000, ob: 82000, oa: 0, ptd: 45, status: 'active', lod: 'Yesterday, 03:30 PM' },
    { id: 'cust-3', code: 'CUST-003', name: 'QuickStop Convenience', store: 'QuickStop 24/7', cp: 'Ajay Mehta', ph: '+91 76543 21098', email: 'quickstop@email.com', addr: '15 Station Road, Dadar', zone: 'Central', cl: 250000, ob: 36500, oa: 12000, ptd: 15, status: 'active', lod: '2 days ago' },
    { id: 'cust-4', code: 'CUST-004', name: 'FreshBasket Grocers', store: 'FreshBasket Organic', cp: 'Kavita Iyer', ph: '+91 65432 10987', email: 'freshbasket@email.com', addr: '78 Hill Road, Powai', zone: 'East Zone', cl: 400000, ob: 192000, oa: 85000, ptd: 30, status: 'active', lod: '3 days ago' },
    { id: 'cust-5', code: 'CUST-005', name: 'ValuePlus Stores', store: 'ValuePlus Outlet', cp: 'Nitin Shah', ph: '+91 54321 09876', email: 'valueplus@email.com', addr: '200 SV Road, Borivali', zone: 'South Zone', cl: 600000, ob: 0, oa: 0, ptd: 30, status: 'active', lod: '1 week ago' },
  ];

  for (const c of customers) {
    insertCustomer.run(c.id, TENANT_ID, c.code, c.name, c.store, c.cp, c.ph, c.email, c.addr, c.zone, c.cl, c.ob, c.oa, c.ptd, c.status, c.lod);
  }

  // Suppliers
  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (id, tenant_id, code, name, contact_person, phone, email, gstin, address, payable_balance, total_purchases, rating, lead_time_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const suppliers = [
    { id: 'sup-1', code: 'SUP-1', name: 'Parle Agro & Biscuits Co.', cp: 'Deepak Parle', ph: '+91 22 2491 0000', email: 'supply@parle.com', gstin: '27AAACF8899K1Z4', addr: 'Vile Parle East, Mumbai', pb: 42000, tp: 1200000, rating: 4.5, ltd: 2 },
    { id: 'sup-2', code: 'SUP-2', name: 'Hindustan Unilever Ltd.', cp: 'Ashish Verma', ph: '+91 22 3983 0000', email: 'distribution@hul.co.in', gstin: '27AACCH0648R1ZM', addr: 'Andheri East, Mumbai', pb: 185000, tp: 3500000, rating: 4.8, ltd: 3 },
    { id: 'sup-3', code: 'SUP-3', name: 'Amul Dairy Cooperative', cp: 'Suresh Patel', ph: '+91 2692 258506', email: 'supply@amul.coop', gstin: '24AAATA8756L1ZW', addr: 'Anand, Gujarat', pb: 28000, tp: 850000, rating: 4.2, ltd: 1 },
    { id: 'sup-4', code: 'SUP-4', name: 'ITC Limited - Foods Division', cp: 'Raghav Nair', ph: '+91 33 2288 9371', email: 'foods.supply@itc.in', gstin: '19AABCI1223P1Z2', addr: 'Virginia House, Kolkata', pb: 0, tp: 450000, rating: 4.6, ltd: 4 },
  ];

  for (const s of suppliers) {
    insertSupplier.run(s.id, TENANT_ID, s.code, s.name, s.cp, s.ph, s.email, s.gstin, s.addr, s.pb, s.tp, s.rating, s.ltd);
  }

  // Sales (in ₹)
  const insertSale = db.prepare(`
    INSERT INTO sales (id, tenant_id, invoice_number, customer_id, customer_name, store_name, date, time, items, subtotal, discount_amount, tax_amount, total_amount, amount_paid, balance_due, payment_method, payment_status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const salesData = [
    { id: 'sale-1', inv: 'TRX-9821', cid: 'cust-1', cn: 'City Retailers', sn: 'City Corner Store', d: '2026-08-21', t: '09:15 AM', items: JSON.stringify([{productId:'prod-2',sku:'BEV-092-COL',name:'Sparkling Cola 500ml x24',quantity:10,freeQuantity:0,unitPrice:960,discountPercent:0,totalAmount:9600}]), sub: 9600, da: 0, ta: 1152, tot: 10752, ap: 10752, bd: 0, pm: 'Cash', ps: 'Paid', cb: 'Priya Patil' },
    { id: 'sale-2', inv: 'TRX-9822', cid: 'cust-2', cn: 'Metro Mart', sn: 'Metro Supermart', d: '2026-08-21', t: '10:30 AM', items: JSON.stringify([{productId:'prod-1',sku:'DOV-SOAP-100',name:'Dove Beauty Bar Soap 100g',quantity:50,freeQuantity:5,unitPrice:140,discountPercent:0,totalAmount:7000}]), sub: 7000, da: 0, ta: 1260, tot: 8260, ap: 4000, bd: 4260, pm: 'Credit', ps: 'Partial', cb: 'Priya Patil' },
    { id: 'sale-3', inv: 'TRX-9823', cid: 'cust-3', cn: 'QuickStop Convenience', sn: 'QuickStop 24/7', d: '2026-08-20', t: '02:00 PM', items: JSON.stringify([{productId:'prod-7',sku:'SNA-110-CHI',name:"Lay's Classic Salted Chips 150g",quantity:20,freeQuantity:0,unitPrice:160,discountPercent:5,totalAmount:3040}]), sub: 3040, da: 160, ta: 364.80, tot: 3404.80, ap: 3404.80, bd: 0, pm: 'UPI', ps: 'Paid', cb: 'Rajesh Kumar' },
  ];

  for (const s of salesData) {
    insertSale.run(s.id, TENANT_ID, s.inv, s.cid, s.cn, s.sn, s.d, s.t, s.items, s.sub, s.da, s.ta, s.tot, s.ap, s.bd, s.pm, s.ps, s.cb);
  }

  // Purchases
  const insertPurchase = db.prepare(`
    INSERT INTO purchases (id, tenant_id, invoice_number, supplier_id, supplier_name, date, items, total_amount, payment_status, is_ai_scanned, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const purchasesData = [
    { id: 'pur-1', inv: 'PO-2026-880', sid: 'sup-2', sn: 'Hindustan Unilever Ltd.', d: '2026-08-18', items: JSON.stringify([{productId:'prod-1',sku:'DOV-SOAP-100',name:'Dove Beauty Bar Soap 100g',quantity:144,freeQuantity:12,unitPrice:95,batchNumber:'DOV-0625',expiryDate:'2027-06-25',totalAmount:13680}]), ta: 13680, ps: 'Paid', ai: 0, st: 'Confirmed' },
    { id: 'pur-2', inv: 'PO-2026-881', sid: 'sup-1', sn: 'Parle Agro & Biscuits Co.', d: '2026-08-19', items: JSON.stringify([{productId:'prod-4',sku:'PAR-GLU-80',name:'Parle-G Glucose Biscuits 80g',quantity:240,freeQuantity:20,unitPrice:22,batchNumber:'PAR-0819',expiryDate:'2027-02-28',totalAmount:5280}]), ta: 5280, ps: 'Pending', ai: 0, st: 'Confirmed' },
  ];

  for (const p of purchasesData) {
    insertPurchase.run(p.id, TENANT_ID, p.inv, p.sid, p.sn, p.d, p.items, p.ta, p.ps, p.ai ? 1 : 0, p.st);
  }

  // Stock movements
  const insertMovement = db.prepare(`
    INSERT INTO stock_movements (id, tenant_id, timestamp, time_formatted, type, sku, product_name, quantity, reference_no, note, actor)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const movements = [
    { id: 'mov-1', ts: '2026-08-21T09:15:00', tf: '09:15 AM', type: 'Sale', sku: 'BEV-092-COL', pn: 'Sparkling Cola 500ml x24', qty: -10, ref: 'TRX-9821', note: null, actor: 'Priya Patil (Sales Staff)' },
    { id: 'mov-2', ts: '2026-08-21T10:30:00', tf: '10:30 AM', type: 'Sale', sku: 'DOV-SOAP-100', pn: 'Dove Beauty Bar Soap 100g', qty: -55, ref: 'TRX-9822', note: null, actor: 'Priya Patil (Sales Staff)' },
    { id: 'mov-3', ts: '2026-08-18T14:00:00', tf: '02:00 PM', type: 'Purchase', sku: 'DOV-SOAP-100', pn: 'Dove Beauty Bar Soap 100g', qty: 156, ref: 'PO-2026-880', note: null, actor: 'Amit Sharma (Warehouse)' },
    { id: 'mov-4', ts: '2026-08-19T11:00:00', tf: '11:00 AM', type: 'Purchase', sku: 'PAR-GLU-80', pn: 'Parle-G Glucose Biscuits 80g', qty: 260, ref: 'PO-2026-881', note: null, actor: 'Amit Sharma (Warehouse)' },
  ];

  for (const m of movements) {
    insertMovement.run(m.id, TENANT_ID, m.ts, m.tf, m.type, m.sku, m.pn, m.qty, m.ref, m.note, m.actor);
  }

  // Collections (in ₹)
  const insertCollection = db.prepare(`
    INSERT INTO collections (id, tenant_id, receipt_number, customer_id, customer_name, invoice_number, amount, payment_method, date, time, recorded_by, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCollection.run('col-1', TENANT_ID, 'RCP-1092', 'cust-3', 'QuickStop Convenience', 'TRX-9821', 50000, 'Cash', '2026-08-19', '14:00 PM', 'Elena Rostova', 'Cash payment received on route');

  // Audit logs
  const insertAudit = db.prepare(`
    INSERT INTO audit_logs (id, tenant_id, timestamp, actor, actor_role, action, entity, entity_id, previous_value, new_value, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const audits = [
    { id: 'aud-1', ts: '2026-08-21 09:15:00', actor: 'Priya Patil', ar: 'Sales Staff', action: 'CREATE_SALE', entity: 'SaleTransaction', eid: 'TRX-9821', pv: null, nv: 'Total: ₹10,752.00, Cust: City Retailers', reason: 'Sale completed' },
    { id: 'aud-2', ts: '2026-08-18 14:00:00', actor: 'Amit Sharma', ar: 'Warehouse', action: 'CREATE_PURCHASE', entity: 'PurchaseTransaction', eid: 'PO-2026-880', pv: null, nv: 'Total: ₹13,680.00, Sup: HUL', reason: 'Purchase inward' },
  ];

  for (const a of audits) {
    insertAudit.run(a.id, TENANT_ID, a.ts, a.actor, a.ar, a.action, a.entity, a.eid, a.pv, a.nv, a.reason);
  }

  // Predictive insights
  const insertInsight = db.prepare(`
    INSERT INTO predictive_insights (id, tenant_id, type, title, description, sku, action_label, action_payload, severity, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insights = [
    { id: 'ins-1', type: 'reorder', title: 'Reorder Alert: Parle-G Biscuits', desc: 'Stock will deplete in approximately 2 days based on current sales velocity.', sku: 'PAR-GLU-80', al: 'Generate PO', ap: '{}', sev: 'high', ts: '2026-08-21T08:00:00' },
    { id: 'ins-2', type: 'expiry', title: 'FEFO Alert: Greek Yogurt', desc: '45 units expiring in 4 days. Recommend 30% markdown clearance.', sku: 'DAI-YOG-01', al: 'Apply Discount', ap: '{}', sev: 'high', ts: '2026-08-21T08:00:00' },
    { id: 'ins-3', type: 'collection', title: 'Overdue: FreshBasket Grocers', desc: '₹85,000 overdue from FreshBasket Grocers. Payment terms exceeded by 12 days.', sku: null, al: 'Send Reminder', ap: '{}', sev: 'medium', ts: '2026-08-21T08:00:00' },
  ];

  for (const i of insights) {
    insertInsight.run(i.id, TENANT_ID, i.type, i.title, i.desc, i.sku, i.al, i.ap, i.sev, i.ts);
  }

  logger.info('Database seeded successfully in INR ₹', { tenant: TENANT_ID, users: users.length, products: products.length });
}

// Allow running directly
if (process.argv[1]?.includes('seed')) {
  initializeDatabase();
  seedDatabase().then(() => {
    logger.info('Seed complete');
    process.exit(0);
  });
}
