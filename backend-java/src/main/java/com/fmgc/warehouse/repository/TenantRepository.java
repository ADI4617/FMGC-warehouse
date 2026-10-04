package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Tenant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class TenantRepository {

    private final JdbcTemplate jdbc;

    public TenantRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Tenant> mapper = (rs, row) -> {
        Tenant t = new Tenant();
        t.setId(rs.getString("id"));
        t.setName(rs.getString("name"));
        t.setLegalEntity(rs.getString("legal_entity"));
        t.setGstin(rs.getString("gstin"));
        t.setEmail(rs.getString("email"));
        t.setPhone(rs.getString("phone"));
        t.setAddress(rs.getString("address"));
        t.setCity(rs.getString("city"));
        t.setState(rs.getString("state"));
        t.setCurrency(rs.getString("currency"));
        t.setPlan(rs.getString("plan"));
        t.setStatus(rs.getString("status"));
        t.setCreatedDate(rs.getString("created_date"));
        t.setTotalSkusCount(rs.getObject("total_skus_count", Integer.class));
        t.setMonthlyRevenueEstimate(rs.getBigDecimal("monthly_revenue_estimate"));
        return t;
    };

    public Optional<Tenant> findById(String id) {
        List<Tenant> results = jdbc.query("SELECT * FROM tenants WHERE id = ?", mapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void save(Tenant t) {
        jdbc.update("INSERT INTO tenants(id,name,legal_entity,gstin,email,phone,address,city,state,currency,plan,status,created_date,total_skus_count,monthly_revenue_estimate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                t.getId(), t.getName(), t.getLegalEntity(), t.getGstin(), t.getEmail(), t.getPhone(),
                t.getAddress(), t.getCity(), t.getState(), t.getCurrency(), t.getPlan(), t.getStatus(),
                t.getCreatedDate(), t.getTotalSkusCount(), t.getMonthlyRevenueEstimate());
    }

    public void update(Tenant t) {
        jdbc.update("UPDATE tenants SET name=?,legal_entity=?,gstin=?,email=?,phone=?,address=?,city=?,state=?,currency=? WHERE id=?",
                t.getName(), t.getLegalEntity(), t.getGstin(), t.getEmail(), t.getPhone(),
                t.getAddress(), t.getCity(), t.getState(), t.getCurrency(), t.getId());
    }
}
