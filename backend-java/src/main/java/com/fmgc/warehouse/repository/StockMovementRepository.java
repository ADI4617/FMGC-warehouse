package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.StockMovement;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StockMovementRepository {

    private final JdbcTemplate jdbc;

    public StockMovementRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<StockMovement> mapper = (rs, row) -> {
        StockMovement sm = new StockMovement();
        sm.setId(rs.getString("id"));
        sm.setTenantId(rs.getString("tenant_id"));
        sm.setTimestamp(rs.getString("timestamp"));
        sm.setTimeFormatted(rs.getString("time_formatted"));
        sm.setType(rs.getString("type"));
        sm.setSku(rs.getString("sku"));
        sm.setProductName(rs.getString("product_name"));
        sm.setQuantity(rs.getObject("quantity", Integer.class));
        sm.setReferenceNo(rs.getString("reference_no"));
        sm.setNote(rs.getString("note"));
        sm.setActor(rs.getString("actor"));
        return sm;
    };

    public List<StockMovement> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM stock_movements WHERE tenant_id = ? ORDER BY timestamp DESC", mapper, tenantId);
    }

    public List<StockMovement> findRecentByTenantId(String tenantId, int limit) {
        return jdbc.query("SELECT * FROM stock_movements WHERE tenant_id = ? ORDER BY timestamp DESC LIMIT ?", mapper, tenantId, limit);
    }

    public void save(StockMovement sm) {
        jdbc.update("INSERT INTO stock_movements(id,tenant_id,timestamp,time_formatted,type,sku,product_name,quantity,reference_no,note,actor) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                sm.getId(), sm.getTenantId(), sm.getTimestamp(), sm.getTimeFormatted(),
                sm.getType(), sm.getSku(), sm.getProductName(), sm.getQuantity(),
                sm.getReferenceNo(), sm.getNote(), sm.getActor());
    }
}
