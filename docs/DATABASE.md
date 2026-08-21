# Database Schema

## Tables

### tenants
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |
| legal_entity | TEXT | |
| gstin | TEXT | |
| email | TEXT | NOT NULL |
| phone | TEXT | |
| address | TEXT | |
| city | TEXT | |
| state | TEXT | |
| currency | TEXT | DEFAULT 'USD' |
| plan | TEXT | DEFAULT 'Enterprise' |
| status | TEXT | DEFAULT 'active' |
| created_date | TEXT | |
| total_skus_count | INTEGER | DEFAULT 0 |
| monthly_revenue_estimate | REAL | DEFAULT 0 |

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK tenants(id) |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| password_hash | TEXT | NOT NULL |
| phone | TEXT | |
| role | TEXT | NOT NULL |
| department | TEXT | |
| avatar | TEXT | |
| status | TEXT | DEFAULT 'pending' |
| last_active | TEXT | |
| date_joined | TEXT | |
| permissions | TEXT | JSON array |
| access_modules | TEXT | JSON array |
| UNIQUE(email) |

### products
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| sku | TEXT | NOT NULL |
| name | TEXT | NOT NULL |
| category | TEXT | |
| brand | TEXT | |
| unit | TEXT | |
| purchase_price | REAL | |
| selling_price | REAL | |
| mrp | REAL | |
| in_stock | INTEGER | DEFAULT 0 |
| damaged | INTEGER | DEFAULT 0 |
| min_threshold | INTEGER | DEFAULT 0 |
| hsn_code | TEXT | |
| gst_rate | REAL | DEFAULT 0 |
| status | TEXT | DEFAULT 'Healthy' |
| ai_predicted_shortage | INTEGER | DEFAULT 0 |
| notes | TEXT | |
| UNIQUE(tenant_id, sku) |

### batches
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| product_id | TEXT | NOT NULL, FK |
| sku | TEXT | |
| product_name | TEXT | |
| batch_number | TEXT | |
| quantity | INTEGER | |
| purchase_price | REAL | |
| expiry_date | TEXT | |
| days_to_expiry | INTEGER | |
| mfg_date | TEXT | |
| is_fefo_priority | INTEGER | DEFAULT 0 |
| status | TEXT | DEFAULT 'healthy' |

### customers
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| code | TEXT | NOT NULL |
| name | TEXT | NOT NULL |
| store_name | TEXT | |
| contact_person | TEXT | |
| phone | TEXT | |
| email | TEXT | |
| address | TEXT | |
| zone | TEXT | |
| credit_limit | REAL | DEFAULT 0 |
| outstanding_balance | REAL | DEFAULT 0 |
| overdue_amount | REAL | DEFAULT 0 |
| payment_terms_days | INTEGER | DEFAULT 30 |
| status | TEXT | DEFAULT 'active' |
| last_order_date | TEXT | |
| UNIQUE(tenant_id, code) |

### suppliers
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| code | TEXT | NOT NULL |
| name | TEXT | NOT NULL |
| contact_person | TEXT | |
| phone | TEXT | |
| email | TEXT | |
| gstin | TEXT | |
| address | TEXT | |
| payable_balance | REAL | DEFAULT 0 |
| total_purchases | REAL | DEFAULT 0 |
| rating | REAL | DEFAULT 0 |
| lead_time_days | INTEGER | DEFAULT 0 |
| UNIQUE(tenant_id, code) |

### sales
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| invoice_number | TEXT | NOT NULL |
| customer_id | TEXT | FK |
| customer_name | TEXT | |
| store_name | TEXT | |
| date | TEXT | |
| time | TEXT | |
| items | TEXT | JSON array |
| subtotal | REAL | |
| discount_amount | REAL | |
| tax_amount | REAL | |
| total_amount | REAL | |
| amount_paid | REAL | |
| balance_due | REAL | |
| payment_method | TEXT | |
| payment_status | TEXT | |
| created_by | TEXT | |

### purchases
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| invoice_number | TEXT | NOT NULL |
| supplier_id | TEXT | FK |
| supplier_name | TEXT | |
| date | TEXT | |
| items | TEXT | JSON array |
| total_amount | REAL | |
| payment_status | TEXT | |
| is_ai_scanned | INTEGER | DEFAULT 0 |
| status | TEXT | DEFAULT 'Draft' |
| document_url | TEXT | |

### stock_movements
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| timestamp | TEXT | |
| time_formatted | TEXT | |
| type | TEXT | |
| sku | TEXT | |
| product_name | TEXT | |
| quantity | INTEGER | |
| reference_no | TEXT | |
| note | TEXT | |
| actor | TEXT | |

### collections
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| receipt_number | TEXT | NOT NULL |
| customer_id | TEXT | FK |
| customer_name | TEXT | |
| invoice_number | TEXT | |
| amount | REAL | |
| payment_method | TEXT | |
| date | TEXT | |
| time | TEXT | |
| recorded_by | TEXT | |
| notes | TEXT | |

### audit_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| timestamp | TEXT | |
| actor | TEXT | |
| actor_role | TEXT | |
| action | TEXT | |
| entity | TEXT | |
| entity_id | TEXT | |
| previous_value | TEXT | |
| new_value | TEXT | |
| reason | TEXT | |
| ip_address | TEXT | |

### predictive_insights
| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| tenant_id | TEXT | NOT NULL, FK |
| type | TEXT | |
| title | TEXT | |
| description | TEXT | |
| sku | TEXT | |
| action_label | TEXT | |
| action_payload | TEXT | JSON |
| severity | TEXT | |
| timestamp | TEXT | |

## Indexes
- `idx_users_email` ON users(email)
- `idx_users_tenant` ON users(tenant_id)
- `idx_products_tenant_sku` ON products(tenant_id, sku)
- `idx_batches_tenant_product` ON batches(tenant_id, product_id)
- `idx_batches_expiry` ON batches(expiry_date)
- `idx_sales_tenant_date` ON sales(tenant_id, date)
- `idx_purchases_tenant` ON purchases(tenant_id)
- `idx_customers_tenant` ON customers(tenant_id)
- `idx_stock_movements_tenant` ON stock_movements(tenant_id)
- `idx_audit_logs_tenant` ON audit_logs(tenant_id, timestamp)
- `idx_collections_tenant` ON collections(tenant_id)
