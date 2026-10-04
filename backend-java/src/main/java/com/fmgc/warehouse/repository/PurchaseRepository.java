package com.fmgc.warehouse.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.model.Purchase;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class PurchaseRepository {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public PurchaseRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    private RowMapper<Purchase> mapper() {
        return (rs, row) -> {
            Purchase p = new Purchase();
            p.setId(rs.getString("id"));
            p.setTenantId(rs.getString("tenant_id"));
            p.setInvoiceNumber(rs.getString("invoice_number"));
            p.setSupplierId(rs.getString("supplier_id"));
            p.setSupplierName(rs.getString("supplier_name"));
            p.setDate(rs.getString("date"));
            try {
                String itemsJson = rs.getString("items");
                if (itemsJson != null && !itemsJson.isBlank()) {
                    p.setItems(objectMapper.readValue(itemsJson, new TypeReference<List<Map<String, Object>>>() {}));
                }
            } catch (Exception ignored) {}
            p.setTotalAmount(rs.getBigDecimal("total_amount"));
            p.setPaymentStatus(rs.getString("payment_status"));
            p.setAiScanned(rs.getInt("is_ai_scanned") == 1);
            p.setStatus(rs.getString("status"));
            p.setDocumentUrl(rs.getString("document_url"));
            return p;
        };
    }

    public List<Purchase> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM purchases WHERE tenant_id = ? ORDER BY date DESC", mapper(), tenantId);
    }

    public void save(Purchase p) {
        try {
            String itemsJson = p.getItems() != null ? objectMapper.writeValueAsString(p.getItems()) : "[]";
            jdbc.update("INSERT INTO purchases(id,tenant_id,invoice_number,supplier_id,supplier_name,date,items,total_amount,payment_status,is_ai_scanned,status,document_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                    p.getId(), p.getTenantId(), p.getInvoiceNumber(), p.getSupplierId(),
                    p.getSupplierName(), p.getDate(), itemsJson, p.getTotalAmount(),
                    p.getPaymentStatus(), p.isAiScanned() ? 1 : 0, p.getStatus(), p.getDocumentUrl());
        } catch (Exception e) {
            throw new RuntimeException("Failed to save purchase", e);
        }
    }

    public String getNextInvoiceNumber(String tenantId) {
        String year = String.valueOf(java.time.LocalDate.now().getYear());
        String pattern = "PO-" + year + "-%";
        String max = jdbc.queryForObject(
            "SELECT MAX(invoice_number) FROM purchases WHERE tenant_id = ? AND invoice_number LIKE ?",
            String.class, tenantId, pattern);
        int next = 1;
        if (max != null) {
            try {
                next = Integer.parseInt(max.substring(8)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("PO-%s-%03d", year, next);
    }
}
