import { saleRepository } from '../repositories/saleRepository.js';
import { collectionRepository } from '../repositories/collectionRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { batchRepository } from '../repositories/batchRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { getDb } from '../config/database.js';

export const reportService = {
  salesSummary(tenantId: string, startDate: string, endDate: string) {
    const sales = saleRepository.findByTenant(tenantId, { startDate, endDate });

    const totalRevenue = sales.reduce((s: number, r: any) => s + r.total_amount, 0);
    const totalDiscount = sales.reduce((s: number, r: any) => s + r.discount_amount, 0);
    const totalTax = sales.reduce((s: number, r: any) => s + r.tax_amount, 0);
    const totalPaid = sales.reduce((s: number, r: any) => s + r.amount_paid, 0);
    const totalUnpaid = sales.reduce((s: number, r: any) => s + r.balance_due, 0);

    const byPaymentMethod = sales.reduce((acc: Record<string, number>, r: any) => {
      acc[r.payment_method] = (acc[r.payment_method] ?? 0) + r.total_amount;
      return acc;
    }, {});

    // Product breakdown from items JSON
    const productMap: Record<string, { name: string; sku: string; qty: number; revenue: number }> = {};
    for (const sale of sales) {
      const items = JSON.parse(sale.items || '[]');
      for (const item of items) {
        if (!productMap[item.sku]) {
          productMap[item.sku] = { name: item.name, sku: item.sku, qty: 0, revenue: 0 };
        }
        productMap[item.sku].qty += item.quantity;
        productMap[item.sku].revenue += item.totalAmount;
      }
    }

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      period: { startDate, endDate },
      totalTransactions: sales.length,
      totalRevenue,
      totalDiscount,
      totalTax,
      totalPaid,
      totalUnpaid,
      byPaymentMethod,
      topProducts,
    };
  },

  inventoryReport(tenantId: string) {
    const products = productRepository.findByTenant(tenantId);
    batchRepository.updateDaysToExpiry(tenantId);
    const nearExpiry = batchRepository.findNearExpiry(tenantId, 30);
    const movements = stockMovementRepository.findByTenant(tenantId, { limit: 50 });

    const totalValue = products.reduce((s: number, p: any) => s + (p.in_stock * p.purchase_price), 0);
    const lowStock = products.filter((p: any) => p.status === 'Low' || p.status === 'Out of Stock');

    return {
      totalProducts: products.length,
      totalStockValue: totalValue,
      lowStockItems: lowStock,
      nearExpiryBatches: nearExpiry,
      recentMovements: movements,
    };
  },

  collectionsReport(tenantId: string, startDate: string, endDate: string) {
    const collections = collectionRepository.findByTenant(tenantId, { startDate, endDate });
    const total = collections.reduce((s: number, c: any) => s + c.amount, 0);

    const byMethod = collections.reduce((acc: Record<string, number>, c: any) => {
      acc[c.payment_method] = (acc[c.payment_method] ?? 0) + c.amount;
      return acc;
    }, {});

    const byCustomer = collections.reduce((acc: Record<string, { name: string; total: number }>, c: any) => {
      if (!acc[c.customer_id]) acc[c.customer_id] = { name: c.customer_name, total: 0 };
      acc[c.customer_id].total += c.amount;
      return acc;
    }, {});

    return {
      period: { startDate, endDate },
      totalCollections: collections.length,
      totalAmountCollected: total,
      byPaymentMethod: byMethod,
      byCustomer: Object.values(byCustomer).sort((a, b) => b.total - a.total),
      records: collections,
    };
  },

  receivablesReport(tenantId: string) {
    const rows = getDb().prepare(`
      SELECT id, code, name, store_name, zone, outstanding_balance, overdue_amount, credit_limit, payment_terms_days, last_order_date
      FROM customers
      WHERE tenant_id = ? AND outstanding_balance > 0
      ORDER BY overdue_amount DESC
    `).all(tenantId) as any[];

    const totalOutstanding = rows.reduce((s, r) => s + r.outstanding_balance, 0);
    const totalOverdue = rows.reduce((s, r) => s + r.overdue_amount, 0);

    return {
      totalOutstanding,
      totalOverdue,
      customers: rows,
    };
  },
};
