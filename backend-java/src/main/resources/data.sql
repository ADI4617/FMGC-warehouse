-- FMGC Warehouse Seed Data
-- Password hash for 'password123' at bcrypt cost 12

-- Tenant
INSERT INTO tenants(id,name,legal_entity,gstin,email,phone,address,city,state,currency,plan,status,created_date,total_skus_count,monthly_revenue_estimate)
VALUES ('tnt-001','Apex FMCG Distributors Ltd.','Apex Consumer Goods Distribution Pvt Ltd','27AABCA1234F1Z8','ops@apexfmcg.com','+91 22 2840 9100','Warehouse Block 4-C, Logistics Corridor, Andheri East','Mumbai','Maharashtra','INR','Enterprise','active','2025-04-12',12,3450000)
ON CONFLICT (id) DO NOTHING;

-- Users
INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-1','tnt-001','Rajesh Kumar','rajesh.k@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 98201 44521','Admin','Executive Operations',NULL,'active','2025-06-15','2025-04-12','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-2','tnt-001','Sarah Jenkins','sarah.j@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 98200 11000','Owner','Executive Office',NULL,'active','2025-06-15','2025-04-12','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-3','tnt-001','Amit Sharma','amit.s@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 98334 11290','Warehouse','Central Warehouse Depot',NULL,'active','2025-06-14','2025-04-15','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-4','tnt-001','Priya Patil','priya.p@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 98192 77482','Sales Staff','Field Sales - West Sector',NULL,'active','2025-06-15','2025-04-20','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-5','tnt-001','Sneha Joshi','sneha.j@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 98765 43210','Collection Staff','Collections',NULL,'active','2025-06-13','2025-05-01','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-6','tnt-001','Vikram Singh','vikram.s@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','+91 91234 56789','Manager','Operations',NULL,'active','2025-06-15','2025-04-12','[]','[]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules)
VALUES ('usr-7','tnt-001','Demo Viewer','viewer@apexfmcg.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCkJ.A6A.MUhN8O07c9.FYO','','Viewer','External',NULL,'active','2025-06-10','2025-06-01','[]','[]')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-1','tnt-001','SKU-001','Amul Butter 500g','Dairy','Amul','Pack',220.00,260.00,280.00,145,2,50,'0401',12.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-2','tnt-001','SKU-002','Britannia Biscuits NutriChoice','Biscuits','Britannia','Pack',85.00,105.00,115.00,12,0,25,'1905',18.00,'Low',1,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-3','tnt-001','SKU-003','Surf Excel 1kg','Detergent','HUL','Pack',175.00,210.00,230.00,89,0,30,'3402',18.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-4','tnt-001','SKU-004','Colgate MaxFresh 200g','Personal Care','Colgate','Tube',62.00,78.00,85.00,0,0,40,'3306',18.00,'Out of Stock',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-5','tnt-001','SKU-005','Maggi Noodles 70g (Pack of 12)','Noodles','Nestle','Pack',108.00,132.00,144.00,210,4,60,'1902',18.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-6','tnt-001','SKU-006','Tata Salt 1kg','Salt','Tata','Pack',18.00,24.00,26.00,320,0,100,'2501',5.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-7','tnt-001','SKU-007','Fortune Sunflower Oil 5L','Edible Oil','Adani Wilmar','Bottle',620.00,710.00,750.00,45,0,20,'1512',5.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-8','tnt-001','SKU-008','Parle-G Biscuits 800g','Biscuits','Parle','Pack',58.00,72.00,80.00,8,0,30,'1905',18.00,'Low',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-9','tnt-001','SKU-009','Lifebuoy Soap 100g (Pack of 4)','Personal Care','HUL','Pack',72.00,90.00,100.00,160,0,50,'3401',18.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-10','tnt-001','SKU-010','Haldirams Bhujia 400g','Snacks','Haldirams','Pack',95.00,120.00,130.00,75,3,40,'2106',12.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-11','tnt-001','SKU-011','Dabur Honey 500g','Health Food','Dabur','Bottle',180.00,220.00,245.00,38,0,20,'0409',0.00,'Healthy',1,NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes)
VALUES ('prod-12','tnt-001','SKU-012','Vim Dishwash Bar 500g','Household','HUL','Bar',32.00,45.00,50.00,190,0,60,'3402',18.00,'Healthy',0,NULL)
ON CONFLICT (id) DO NOTHING;

-- Batches
INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-1','tnt-001','prod-1','SKU-001','Amul Butter 500g','AMUL-2025-04-B1',145,220.00,'2025-08-15',NULL,'2025-04-15',1,'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-2','tnt-001','prod-2','SKU-002','Britannia Biscuits NutriChoice','BRIT-2025-02-B1',12,85.00,'2025-07-20',NULL,'2025-02-20',1,'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-3','tnt-001','prod-5','SKU-005','Maggi Noodles 70g (Pack of 12)','NEST-2025-03-M1',210,108.00,'2026-03-10',NULL,'2025-03-10',1,'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-4','tnt-001','prod-7','SKU-007','Fortune Sunflower Oil 5L','FORT-2025-01-O1',45,620.00,'2026-01-31',NULL,'2025-01-31',1,'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-5','tnt-001','prod-11','SKU-011','Dabur Honey 500g','DABR-2024-12-H1',38,180.00,'2026-12-01',NULL,'2024-12-01',1,'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status)
VALUES ('bat-6','tnt-001','prod-10','SKU-010','Haldirams Bhujia 400g','HALD-2025-05-B1',75,95.00,'2025-11-30',NULL,'2025-05-30',1,'active')
ON CONFLICT (id) DO NOTHING;

-- Customers
INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date)
VALUES ('cust-1','tnt-001','CUST-001','Rajan General Stores','Rajan General Stores','Rajan Mehta','+91 98765 12345','rajan@rajanstores.com','14, Market Yard, Dadar West, Mumbai - 400028','Zone A',50000.00,12500.00,12500.00,30,'active','2025-06-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date)
VALUES ('cust-2','tnt-001','CUST-002','Sharma Kirana Mart','Sharma Kirana Mart','Suresh Sharma','+91 99881 22233','sharma@kiranmart.com','Plot 7, Linking Road, Bandra, Mumbai - 400050','Zone B',75000.00,0.00,0.00,45,'active','2025-06-12')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date)
VALUES ('cust-3','tnt-001','CUST-003','Fresh Mart Superstore','Fresh Mart Superstore','Anita Kapoor','+91 98100 33445','anita@freshmart.in','A-12, SV Road, Malad West, Mumbai - 400064','Zone A',100000.00,28000.00,0.00,60,'active','2025-06-08')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date)
VALUES ('cust-4','tnt-001','CUST-004','Daily Needs Pvt Ltd','Daily Needs Pvt Ltd','Mohan Verma','+91 88776 55443','mohan@dailyneeds.co','B-4, MIDC Industrial Area, Andheri East, Mumbai - 400093','Zone C',200000.00,55000.00,18000.00,30,'active','2025-06-14')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date)
VALUES ('cust-5','tnt-001','CUST-005','Metro Cash & Carry','Metro Cash & Carry','Priya Singh','+91 77665 44332','priya@metro.in','Sector 11, CBD Belapur, Navi Mumbai - 400614','Zone D',500000.00,0.00,0.00,15,'active','2025-06-15')
ON CONFLICT (id) DO NOTHING;

-- Suppliers
INSERT INTO suppliers(id,tenant_id,code,name,contact_person,phone,email,gstin,address,payable_balance,total_purchases,rating,lead_time_days)
VALUES ('sup-1','tnt-001','SUP-1','Amul Dairy Products Ltd','Ramesh Patel','+91 02692 258501','ramesh@amul.com','24AAACA1234B1ZP','Amul Dairy, Anand, Gujarat - 388001',45000.00,380000.00,4.8,3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers(id,tenant_id,code,name,contact_person,phone,email,gstin,address,payable_balance,total_purchases,rating,lead_time_days)
VALUES ('sup-2','tnt-001','SUP-2','HUL Distribution Center','Kavita Rao','+91 22 3983 0000','kavita@hul.com','27AAACH1234J1ZR','HUL House, Lower Parel, Mumbai - 400013',0.00,520000.00,4.9,2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers(id,tenant_id,code,name,contact_person,phone,email,gstin,address,payable_balance,total_purchases,rating,lead_time_days)
VALUES ('sup-3','tnt-001','SUP-3','Nestle India Ltd','Arun Kumar','+91 124 4007100','arun@nestle.in','06AAACN1234K1ZP','Nestle House, Gurgaon, Haryana - 122001',22000.00,290000.00,4.7,4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO suppliers(id,tenant_id,code,name,contact_person,phone,email,gstin,address,payable_balance,total_purchases,rating,lead_time_days)
VALUES ('sup-4','tnt-001','SUP-4','ITC Limited - Foods Division','Sunita Reddy','+91 33 2288 9371','sunita@itc.in','19AAACI1234M1Z2','Virginia House, Kolkata, West Bengal - 700071',0.00,175000.00,4.6,5)
ON CONFLICT (id) DO NOTHING;

-- Sales
INSERT INTO sales(id,tenant_id,invoice_number,customer_id,customer_name,store_name,date,time,items,subtotal,discount_amount,tax_amount,total_amount,amount_paid,balance_due,payment_method,payment_status,created_by)
VALUES ('sale-1','tnt-001','TRX-0001','cust-4','Daily Needs Pvt Ltd','Daily Needs Pvt Ltd','2025-06-14','10:30 AM','[{"productId":"prod-1","sku":"SKU-001","productName":"Amul Butter 500g","quantity":20,"unitPrice":260.00,"total":5200.00,"gstRate":12,"gstAmount":559.98},{"productId":"prod-5","sku":"SKU-005","productName":"Maggi Noodles 70g (Pack of 12)","quantity":30,"unitPrice":132.00,"total":3960.00,"gstRate":18,"gstAmount":606.00}]',8474.32,0.00,1285.68,9760.00,9760.00,0.00,'UPI','Paid','priya.p@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sales(id,tenant_id,invoice_number,customer_id,customer_name,store_name,date,time,items,subtotal,discount_amount,tax_amount,total_amount,amount_paid,balance_due,payment_method,payment_status,created_by)
VALUES ('sale-2','tnt-001','TRX-0002','cust-3','Fresh Mart Superstore','Fresh Mart Superstore','2025-06-12','02:15 PM','[{"productId":"prod-3","sku":"SKU-003","productName":"Surf Excel 1kg","quantity":15,"unitPrice":210.00,"total":3150.00,"gstRate":18,"gstAmount":482.00},{"productId":"prod-9","sku":"SKU-009","productName":"Lifebuoy Soap 100g (Pack of 4)","quantity":25,"unitPrice":90.00,"total":2250.00,"gstRate":18,"gstAmount":344.00},{"productId":"prod-12","sku":"SKU-012","productName":"Vim Dishwash Bar 500g","quantity":20,"unitPrice":45.00,"total":900.00,"gstRate":18,"gstAmount":137.72}]',5423.28,0.00,963.72,6387.00,0.00,6387.00,'Credit','Pending','priya.p@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO sales(id,tenant_id,invoice_number,customer_id,customer_name,store_name,date,time,items,subtotal,discount_amount,tax_amount,total_amount,amount_paid,balance_due,payment_method,payment_status,created_by)
VALUES ('sale-3','tnt-001','TRX-0003','cust-5','Metro Cash & Carry','Metro Cash & Carry','2025-06-15','11:00 AM','[{"productId":"prod-6","sku":"SKU-006","productName":"Tata Salt 1kg","quantity":100,"unitPrice":24.00,"total":2400.00,"gstRate":5,"gstAmount":114.29},{"productId":"prod-7","sku":"SKU-007","productName":"Fortune Sunflower Oil 5L","quantity":10,"unitPrice":710.00,"total":7100.00,"gstRate":5,"gstAmount":338.10},{"productId":"prod-10","sku":"SKU-010","productName":"Haldirams Bhujia 400g","quantity":20,"unitPrice":120.00,"total":2400.00,"gstRate":12,"gstAmount":257.14}]',11347.62,200.00,709.52,11857.14,11857.14,0.00,'NEFT','Paid','priya.p@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

-- Purchases
INSERT INTO purchases(id,tenant_id,invoice_number,supplier_id,supplier_name,date,items,total_amount,payment_status,is_ai_scanned,status,document_url)
VALUES ('pur-1','tnt-001','PO-2025-001','sup-1','Amul Dairy Products Ltd','2025-06-01','[{"productId":"prod-1","sku":"SKU-001","productName":"Amul Butter 500g","quantity":200,"unitPrice":220.00,"total":44000.00,"batchNumber":"AMUL-2025-04-B1","expiryDate":"2025-08-15","mfgDate":"2025-04-15"}]',44000.00,'Paid',0,'Confirmed',NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO purchases(id,tenant_id,invoice_number,supplier_id,supplier_name,date,items,total_amount,payment_status,is_ai_scanned,status,document_url)
VALUES ('pur-2','tnt-001','PO-2025-002','sup-3','Nestle India Ltd','2025-06-05','[{"productId":"prod-5","sku":"SKU-005","productName":"Maggi Noodles 70g (Pack of 12)","quantity":300,"unitPrice":108.00,"total":32400.00,"batchNumber":"NEST-2025-03-M1","expiryDate":"2026-03-10","mfgDate":"2025-03-10"},{"productId":"prod-11","sku":"SKU-011","productName":"Dabur Honey 500g","quantity":50,"unitPrice":180.00,"total":9000.00,"batchNumber":"DABR-2024-12-H1","expiryDate":"2026-12-01","mfgDate":"2024-12-01"}]',41400.00,'Pending',0,'Confirmed',NULL)
ON CONFLICT (id) DO NOTHING;

-- Stock Movements
INSERT INTO stock_movements(id,tenant_id,timestamp,time_formatted,type,sku,product_name,quantity,reference_no,note,actor)
VALUES ('mov-1','tnt-001','2025-06-14 10:30:00','10:30 AM','Sale','SKU-001','Amul Butter 500g',20,'TRX-0001','Sale: TRX-0001','priya.p@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_movements(id,tenant_id,timestamp,time_formatted,type,sku,product_name,quantity,reference_no,note,actor)
VALUES ('mov-2','tnt-001','2025-06-14 10:30:00','10:30 AM','Sale','SKU-005','Maggi Noodles 70g (Pack of 12)',30,'TRX-0001','Sale: TRX-0001','priya.p@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_movements(id,tenant_id,timestamp,time_formatted,type,sku,product_name,quantity,reference_no,note,actor)
VALUES ('mov-3','tnt-001','2025-06-01 09:00:00','09:00 AM','Purchase','SKU-001','Amul Butter 500g',200,'PO-2025-001','Purchase: PO-2025-001','amit.s@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO stock_movements(id,tenant_id,timestamp,time_formatted,type,sku,product_name,quantity,reference_no,note,actor)
VALUES ('mov-4','tnt-001','2025-06-05 11:00:00','11:00 AM','Purchase','SKU-005','Maggi Noodles 70g (Pack of 12)',300,'PO-2025-002','Purchase: PO-2025-002','amit.s@apexfmcg.com')
ON CONFLICT (id) DO NOTHING;

-- Collections
INSERT INTO collections(id,tenant_id,receipt_number,customer_id,customer_name,invoice_number,amount,payment_method,date,time,recorded_by,notes)
VALUES ('col-1','tnt-001','RCP-0001','cust-1','Rajan General Stores','TRX-0002',5000.00,'Cash','2025-06-13','03:00 PM','sneha.j@apexfmcg.com','Partial payment received')
ON CONFLICT (id) DO NOTHING;

-- Audit Logs
INSERT INTO audit_logs(id,tenant_id,timestamp,actor,actor_role,action,entity,entity_id,previous_value,new_value,reason,ip_address)
VALUES ('aud-1','tnt-001','2025-06-15 09:00:00','rajesh.k@apexfmcg.com','Admin','USER_LOGIN','User','usr-1',NULL,NULL,NULL,'192.168.1.100')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs(id,tenant_id,timestamp,actor,actor_role,action,entity,entity_id,previous_value,new_value,reason,ip_address)
VALUES ('aud-2','tnt-001','2025-06-14 10:30:00','priya.p@apexfmcg.com','Sales Staff','CREATE_SALE','Sale','sale-1',NULL,'{"invoiceNumber":"TRX-0001","totalAmount":9760.00}',NULL,'192.168.1.105')
ON CONFLICT (id) DO NOTHING;

-- Predictive Insights
INSERT INTO predictive_insights(id,tenant_id,type,title,description,sku,action_label,action_payload,severity,timestamp)
VALUES ('ins-1','tnt-001','shortage','Low Stock Alert: Britannia NutriChoice','SKU-002 has only 12 units remaining, below threshold of 25. Predicted to run out in 3 days based on current sales velocity.','SKU-002','Create Purchase Order','{"supplierId":"sup-3","productId":"prod-2"}','high','2025-06-15 08:00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO predictive_insights(id,tenant_id,type,title,description,sku,action_label,action_payload,severity,timestamp)
VALUES ('ins-2','tnt-001','expiry','Near Expiry: Britannia NutriChoice Batch','Batch BRIT-2025-02-B1 expires on 2025-07-20. Consider applying discount to move inventory faster.','SKU-002','Apply Expiry Discount','{"batchId":"bat-2"}','medium','2025-06-15 08:00:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO predictive_insights(id,tenant_id,type,title,description,sku,action_label,action_payload,severity,timestamp)
VALUES ('ins-3','tnt-001','collection','Overdue Collection: Daily Needs Pvt Ltd','Customer CUST-004 has overdue amount of Rs 18,000. Last payment was received 45 days ago.',NULL,'Record Collection','{"customerId":"cust-4"}','high','2025-06-15 08:00:00')
ON CONFLICT (id) DO NOTHING;
