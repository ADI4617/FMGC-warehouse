package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbc;

    public ProductRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Product> mapper = (rs, row) -> {
        Product p = new Product();
        p.setId(rs.getString("id"));
        p.setTenantId(rs.getString("tenant_id"));
        p.setSku(rs.getString("sku"));
        p.setName(rs.getString("name"));
        p.setCategory(rs.getString("category"));
        p.setBrand(rs.getString("brand"));
        p.setUnit(rs.getString("unit"));
        p.setPurchasePrice(rs.getBigDecimal("purchase_price"));
        p.setSellingPrice(rs.getBigDecimal("selling_price"));
        p.setMrp(rs.getBigDecimal("mrp"));
        p.setInStock(rs.getObject("in_stock", Integer.class));
        p.setDamaged(rs.getObject("damaged", Integer.class));
        p.setMinThreshold(rs.getObject("min_threshold", Integer.class));
        p.setHsnCode(rs.getString("hsn_code"));
        p.setGstRate(rs.getBigDecimal("gst_rate"));
        p.setStatus(rs.getString("status"));
        p.setAiPredictedShortage(rs.getInt("ai_predicted_shortage") == 1);
        p.setNotes(rs.getString("notes"));
        return p;
    };

    public List<Product> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM products WHERE tenant_id = ? ORDER BY name", mapper, tenantId);
    }

    public Optional<Product> findById(String id, String tenantId) {
        List<Product> results = jdbc.query("SELECT * FROM products WHERE id = ? AND tenant_id = ?", mapper, id, tenantId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Optional<Product> findBySku(String sku, String tenantId) {
        List<Product> results = jdbc.query("SELECT * FROM products WHERE sku = ? AND tenant_id = ?", mapper, sku, tenantId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void save(Product p) {
        jdbc.update("INSERT INTO products(id,tenant_id,sku,name,category,brand,unit,purchase_price,selling_price,mrp,in_stock,damaged,min_threshold,hsn_code,gst_rate,status,ai_predicted_shortage,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                p.getId(), p.getTenantId(), p.getSku(), p.getName(), p.getCategory(), p.getBrand(),
                p.getUnit(), p.getPurchasePrice(), p.getSellingPrice(), p.getMrp(), p.getInStock(),
                p.getDamaged(), p.getMinThreshold(), p.getHsnCode(), p.getGstRate(), p.getStatus(),
                p.isAiPredictedShortage() ? 1 : 0, p.getNotes());
    }

    public void update(Product p) {
        jdbc.update("UPDATE products SET name=?,category=?,brand=?,unit=?,purchase_price=?,selling_price=?,mrp=?,in_stock=?,damaged=?,min_threshold=?,hsn_code=?,gst_rate=?,status=?,ai_predicted_shortage=?,notes=? WHERE id=? AND tenant_id=?",
                p.getName(), p.getCategory(), p.getBrand(), p.getUnit(), p.getPurchasePrice(),
                p.getSellingPrice(), p.getMrp(), p.getInStock(), p.getDamaged(), p.getMinThreshold(),
                p.getHsnCode(), p.getGstRate(), p.getStatus(), p.isAiPredictedShortage() ? 1 : 0,
                p.getNotes(), p.getId(), p.getTenantId());
    }

    public void delete(String id, String tenantId) {
        jdbc.update("DELETE FROM products WHERE id = ? AND tenant_id = ?", id, tenantId);
    }

    public void updateStock(String productId, String tenantId, int newStock) {
        jdbc.update("UPDATE products SET in_stock = ? WHERE id = ? AND tenant_id = ?", newStock, productId, tenantId);
    }

    public List<Product> findTopBySellingPrice(String tenantId, int limit) {
        return jdbc.query("SELECT * FROM products WHERE tenant_id = ? ORDER BY selling_price DESC LIMIT ?", mapper, tenantId, limit);
    }

    public int countLowStock(String tenantId) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM products WHERE tenant_id = ? AND in_stock <= min_threshold", Integer.class, tenantId);
        return count != null ? count : 0;
    }

    public boolean existsBySku(String sku, String tenantId) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM products WHERE sku = ? AND tenant_id = ?", Integer.class, sku, tenantId);
        return count != null && count > 0;
    }

    public int countByTenantId(String tenantId) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM products WHERE tenant_id = ?", Integer.class, tenantId);
        return count != null ? count : 0;
    }
}
