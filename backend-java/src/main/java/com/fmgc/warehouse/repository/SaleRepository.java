package com.fmgc.warehouse.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.model.Sale;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class SaleRepository {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public SaleRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    private RowMapper<Sale> mapper() {
        return (rs, row) -> {
            Sale s = new Sale();
            s.setId(rs.getString("id"));
            s.setTenantId(rs.getString("tenant_id"));
            s.setInvoiceNumber(rs.getString("invoice_number"));
            s.setCustomerId(rs.getString("customer_id"));
            s.setCustomerName(rs.getString("customer_name"));
            s.setStoreName(rs.getString("store_name"));
            s.setDate(rs.getString("date"));
            s.setTime(rs.getString("time"));
            try {
                String itemsJson = rs.getString("items");
                if (itemsJson != null && !itemsJson.isBlank()) {
                    s.setItems(objectMapper.readValue(itemsJson, new TypeReference<List<Map<String, Object>>>() {}));
                }
            } catch (Exception ignored) {}
            s.setSubtotal(rs.getBigDecimal("subtotal"));
            s.setDiscountAmount(rs.getBigDecimal("discount_amount"));
            s.setTaxAmount(rs.getBigDecimal("tax_amount"));
            s.setTotalAmount(rs.getBigDecimal("total_amount"));
            s.setAmountPaid(rs.getBigDecimal("amount_paid"));
            s.setBalanceDue(rs.getBigDecimal("balance_due"));
            s.setPaymentMethod(rs.getString("payment_method"));
            s.setPaymentStatus(rs.getString("payment_status"));
            s.setCreatedBy(rs.getString("created_by"));
            return s;
        };
    }

    public List<Sale> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM sales WHERE tenant_id = ? ORDER BY date DESC, time DESC", mapper(), tenantId);
    }

    public void save(Sale s) {
        try {
            String itemsJson = s.getItems() != null ? objectMapper.writeValueAsString(s.getItems()) : "[]";
            jdbc.update("INSERT INTO sales(id,tenant_id,invoice_number,customer_id,customer_name,store_name,date,time,items,subtotal,discount_amount,tax_amount,total_amount,amount_paid,balance_due,payment_method,payment_status,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    s.getId(), s.getTenantId(), s.getInvoiceNumber(), s.getCustomerId(),
                    s.getCustomerName(), s.getStoreName(), s.getDate(), s.getTime(),
                    itemsJson, s.getSubtotal(), s.getDiscountAmount(), s.getTaxAmount(),
                    s.getTotalAmount(), s.getAmountPaid(), s.getBalanceDue(),
                    s.getPaymentMethod(), s.getPaymentStatus(), s.getCreatedBy());
        } catch (Exception e) {
            throw new RuntimeException("Failed to save sale", e);
        }
    }

    public String getNextInvoiceNumber(String tenantId) {
        String max = jdbc.queryForObject(
            "SELECT MAX(invoice_number) FROM sales WHERE tenant_id = ? AND invoice_number LIKE 'TRX-%'",
            String.class, tenantId);
        int next = 1;
        if (max != null) {
            try {
                next = Integer.parseInt(max.substring(4)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("TRX-%04d", next);
    }

    public BigDecimal sumTotalRevenue(String tenantId) {
        BigDecimal result = jdbc.queryForObject("SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE tenant_id = ?", BigDecimal.class, tenantId);
        return result != null ? result : BigDecimal.ZERO;
    }

    public List<Map<String, Object>> getRevenueChart(String tenantId) {
        return jdbc.queryForList(
            "SELECT date, COALESCE(SUM(total_amount), 0) AS total FROM sales WHERE tenant_id = ? AND date >= CAST(CURRENT_DATE - 6 AS VARCHAR) GROUP BY date ORDER BY date",
            tenantId);
    }
}
