package com.fmgc.warehouse.service;

import com.fmgc.warehouse.model.PredictiveInsight;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.model.StockMovement;
import com.fmgc.warehouse.repository.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final BatchRepository batchRepository;
    private final StockMovementRepository stockMovementRepository;
    private final PredictiveInsightRepository predictiveInsightRepository;
    private final JdbcTemplate jdbc;

    public DashboardService(SaleRepository saleRepository, ProductRepository productRepository,
                             CustomerRepository customerRepository, SupplierRepository supplierRepository,
                             BatchRepository batchRepository, StockMovementRepository stockMovementRepository,
                             PredictiveInsightRepository predictiveInsightRepository, JdbcTemplate jdbc) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.batchRepository = batchRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.predictiveInsightRepository = predictiveInsightRepository;
        this.jdbc = jdbc;
    }

    public Map<String, Object> getDashboard(String tenantId) {
        Map<String, Object> result = new HashMap<>();

        BigDecimal totalRevenue = saleRepository.sumTotalRevenue(tenantId);
        result.put("totalRevenue", totalRevenue);

        BigDecimal totalStockValue = jdbc.queryForObject(
            "SELECT COALESCE(SUM(in_stock * selling_price), 0) FROM products WHERE tenant_id = ?",
            BigDecimal.class, tenantId);
        result.put("totalStockValue", totalStockValue != null ? totalStockValue : BigDecimal.ZERO);

        BigDecimal totalReceivables = jdbc.queryForObject(
            "SELECT COALESCE(SUM(outstanding_balance), 0) FROM customers WHERE tenant_id = ?",
            BigDecimal.class, tenantId);
        result.put("totalReceivables", totalReceivables != null ? totalReceivables : BigDecimal.ZERO);

        BigDecimal totalPayables = jdbc.queryForObject(
            "SELECT COALESCE(SUM(payable_balance), 0) FROM suppliers WHERE tenant_id = ?",
            BigDecimal.class, tenantId);
        result.put("totalPayables", totalPayables != null ? totalPayables : BigDecimal.ZERO);

        result.put("lowStockCount", productRepository.countLowStock(tenantId));
        result.put("nearExpiryCount", batchRepository.countNearExpiry(tenantId));

        List<StockMovement> recentMovements = stockMovementRepository.findRecentByTenantId(tenantId, 10);
        result.put("recentMovements", recentMovements);

        List<Product> topProducts = productRepository.findTopBySellingPrice(tenantId, 5);
        result.put("topProducts", topProducts);

        List<Map<String, Object>> revenueChart = saleRepository.getRevenueChart(tenantId);
        result.put("revenueChart", revenueChart);

        List<PredictiveInsight> insights = predictiveInsightRepository.findByTenantId(tenantId);
        result.put("insights", insights);

        return result;
    }
}
