package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.AuditLog;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuditLogRepository {

    private final JdbcTemplate jdbc;

    public AuditLogRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<AuditLog> mapper = (rs, row) -> {
        AuditLog a = new AuditLog();
        a.setId(rs.getString("id"));
        a.setTenantId(rs.getString("tenant_id"));
        a.setTimestamp(rs.getString("timestamp"));
        a.setActor(rs.getString("actor"));
        a.setActorRole(rs.getString("actor_role"));
        a.setAction(rs.getString("action"));
        a.setEntity(rs.getString("entity"));
        a.setEntityId(rs.getString("entity_id"));
        a.setPreviousValue(rs.getString("previous_value"));
        a.setNewValue(rs.getString("new_value"));
        a.setReason(rs.getString("reason"));
        a.setIpAddress(rs.getString("ip_address"));
        return a;
    };

    public List<AuditLog> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM audit_logs WHERE tenant_id = ? ORDER BY timestamp DESC", mapper, tenantId);
    }

    public void save(AuditLog a) {
        jdbc.update("INSERT INTO audit_logs(id,tenant_id,timestamp,actor,actor_role,action,entity,entity_id,previous_value,new_value,reason,ip_address) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                a.getId(), a.getTenantId(), a.getTimestamp(), a.getActor(), a.getActorRole(),
                a.getAction(), a.getEntity(), a.getEntityId(), a.getPreviousValue(),
                a.getNewValue(), a.getReason(), a.getIpAddress());
    }
}
