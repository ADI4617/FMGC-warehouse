package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Batch;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BatchRepository {

    private final JdbcTemplate jdbc;

    public BatchRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Batch> mapper = (rs, row) -> {
        Batch b = new Batch();
        b.setId(rs.getString("id"));
        b.setTenantId(rs.getString("tenant_id"));
        b.setProductId(rs.getString("product_id"));
        b.setSku(rs.getString("sku"));
        b.setProductName(rs.getString("product_name"));
        b.setBatchNumber(rs.getString("batch_number"));
        b.setQuantity(rs.getObject("quantity", Integer.class));
        b.setPurchasePrice(rs.getBigDecimal("purchase_price"));
        b.setExpiryDate(rs.getString("expiry_date"));
        // Recompute days_to_expiry dynamically
        b.setDaysToExpiry(rs.getObject("days_to_expiry", Integer.class));
        b.setMfgDate(rs.getString("mfg_date"));
        b.setFefoPriority(rs.getInt("is_fefo_priority") == 1);
        b.setStatus(rs.getString("status"));
        return b;
    };

    public List<Batch> findByTenantId(String tenantId) {
        return jdbc.query(
            "SELECT id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, " +
            "CASE WHEN expiry_date IS NOT NULL THEN (expiry_date::date - CURRENT_DATE) ELSE NULL END AS days_to_expiry, " +
            "mfg_date, is_fefo_priority, status FROM batches WHERE tenant_id = ? ORDER BY expiry_date ASC",
            mapper, tenantId);
    }

    public Optional<Batch> findById(String id, String tenantId) {
        List<Batch> results = jdbc.query(
            "SELECT id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, " +
            "CASE WHEN expiry_date IS NOT NULL THEN (expiry_date::date - CURRENT_DATE) ELSE NULL END AS days_to_expiry, " +
            "mfg_date, is_fefo_priority, status FROM batches WHERE id = ? AND tenant_id = ?",
            mapper, id, tenantId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Batch> findByProductIdFefo(String productId, String tenantId) {
        return jdbc.query(
            "SELECT id, tenant_id, product_id, sku, product_name, batch_number, quantity, purchase_price, expiry_date, " +
            "CASE WHEN expiry_date IS NOT NULL THEN (expiry_date::date - CURRENT_DATE) ELSE NULL END AS days_to_expiry, " +
            "mfg_date, is_fefo_priority, status FROM batches WHERE product_id = ? AND tenant_id = ? AND quantity > 0 ORDER BY expiry_date ASC NULLS LAST",
            mapper, productId, tenantId);
    }

    public void save(Batch b) {
        jdbc.update("INSERT INTO batches(id,tenant_id,product_id,sku,product_name,batch_number,quantity,purchase_price,expiry_date,days_to_expiry,mfg_date,is_fefo_priority,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                b.getId(), b.getTenantId(), b.getProductId(), b.getSku(), b.getProductName(),
                b.getBatchNumber(), b.getQuantity(), b.getPurchasePrice(), b.getExpiryDate(),
                b.getDaysToExpiry(), b.getMfgDate(), b.isFefoPriority() ? 1 : 0, b.getStatus());
    }

    public void updateQuantity(String batchId, int quantity) {
        jdbc.update("UPDATE batches SET quantity = ? WHERE id = ?", quantity, batchId);
    }

    public void updateStatus(String batchId, String status) {
        jdbc.update("UPDATE batches SET status = ? WHERE id = ?", status, batchId);
    }

    public int countNearExpiry(String tenantId) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM batches WHERE tenant_id = ? AND expiry_date IS NOT NULL AND (expiry_date::date - CURRENT_DATE) <= 15",
            Integer.class, tenantId);
        return count != null ? count : 0;
    }
}
