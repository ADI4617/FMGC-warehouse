import { saleRepository } from '../repositories/saleRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { customerRepository } from '../repositories/customerRepository.js';
import { collectionRepository } from '../repositories/collectionRepository.js';
import { stockMovementRepository } from '../repositories/stockMovementRepository.js';
import { predictiveInsightRepository } from '../repositories/predictiveInsightRepository.js';
import { batchRepository } from '../repositories/batchRepository.js';

export const dashboardService = {
  getKpis(tenantId: string) {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = today.substring(0, 7) + '-01';
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const revenueToday = saleRepository.totalRevenue(tenantId, today, today);
    const revenueYesterday = saleRepository.totalRevenue(tenantId, yesterday, yesterday);
    const revenueMonth = saleRepository.totalRevenue(tenantId, monthStart, today);
    const salesToday = saleRepository.countByTenant(tenantId, today, today);
    const totalReceivables = customerRepository.sumOutstanding(tenantId);
    const stockValue = productRepository.sumStockValue(tenantId);
    const lowStockCount = productRepository.countLowStock(tenantId);
    const collectedToday = collectionRepository.totalCollected(tenantId, today, today);

    const revenueChange = revenueYesterday > 0
      ? (((revenueToday - revenueYesterday) / revenueYesterday) * 100).toFixed(1)
      : null;

    return {
      revenueToday,
      revenueMonth,
      salesToday,
      totalReceivables,
      stockValue,
      lowStockCount,
      collectedToday,
      revenueChange: revenueChange ? parseFloat(revenueChange) : null,
    };
  },

  getRevenueChart(tenantId: string, days = 7) {
    return saleRepository.revenueByDate(tenantId, days);
  },

  getRecentMovements(tenantId: string, limit = 10) {
    return stockMovementRepository.findByTenant(tenantId, { limit });
  },

  getInsights(tenantId: string) {
    batchRepository.updateDaysToExpiry(tenantId);
    return predictiveInsightRepository.findByTenant(tenantId);
  },
};
