package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.PredictiveInsight;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PredictiveInsightRepository {

    private final JdbcTemplate jdbc;

    public PredictiveInsightRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<PredictiveInsight> mapper = (rs, row) -> {
        PredictiveInsight pi = new PredictiveInsight();
        pi.setId(rs.getString("id"));
        pi.setTenantId(rs.getString("tenant_id"));
        pi.setType(rs.getString("type"));
        pi.setTitle(rs.getString("title"));
        pi.setDescription(rs.getString("description"));
        pi.setSku(rs.getString("sku"));
        pi.setActionLabel(rs.getString("action_label"));
        pi.setActionPayload(rs.getString("action_payload"));
        pi.setSeverity(rs.getString("severity"));
        pi.setTimestamp(rs.getString("timestamp"));
        return pi;
    };

    public List<PredictiveInsight> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM predictive_insights WHERE tenant_id = ? ORDER BY timestamp DESC", mapper, tenantId);
    }
}
