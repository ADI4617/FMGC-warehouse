package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Supplier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SupplierRepository {

    private final JdbcTemplate jdbc;

    public SupplierRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Supplier> mapper = (rs, row) -> {
        Supplier s = new Supplier();
        s.setId(rs.getString("id"));
        s.setTenantId(rs.getString("tenant_id"));
        s.setCode(rs.getString("code"));
        s.setName(rs.getString("name"));
        s.setContactPerson(rs.getString("contact_person"));
        s.setPhone(rs.getString("phone"));
        s.setEmail(rs.getString("email"));
        s.setGstin(rs.getString("gstin"));
        s.setAddress(rs.getString("address"));
        s.setPayableBalance(rs.getBigDecimal("payable_balance"));
        s.setTotalPurchases(rs.getBigDecimal("total_purchases"));
        s.setRating(rs.getBigDecimal("rating"));
        s.setLeadTimeDays(rs.getObject("lead_time_days", Integer.class));
        return s;
    };

    public List<Supplier> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM suppliers WHERE tenant_id = ? ORDER BY name", mapper, tenantId);
    }

    public Optional<Supplier> findById(String id, String tenantId) {
        List<Supplier> results = jdbc.query("SELECT * FROM suppliers WHERE id = ? AND tenant_id = ?", mapper, id, tenantId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void save(Supplier s) {
        jdbc.update("INSERT INTO suppliers(id,tenant_id,code,name,contact_person,phone,email,gstin,address,payable_balance,total_purchases,rating,lead_time_days) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                s.getId(), s.getTenantId(), s.getCode(), s.getName(), s.getContactPerson(),
                s.getPhone(), s.getEmail(), s.getGstin(), s.getAddress(),
                s.getPayableBalance(), s.getTotalPurchases(), s.getRating(), s.getLeadTimeDays());
    }

    public void updateTotals(String supplierId, String tenantId, java.math.BigDecimal payable, java.math.BigDecimal totalPurchases) {
        jdbc.update("UPDATE suppliers SET payable_balance = ?, total_purchases = ? WHERE id = ? AND tenant_id = ?",
                payable, totalPurchases, supplierId, tenantId);
    }

    public String getNextCode(String tenantId) {
        Integer max = jdbc.queryForObject(
            "SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM 5) AS INTEGER)), 0) FROM suppliers WHERE tenant_id = ? AND code LIKE 'SUP-%'",
            Integer.class, tenantId);
        int next = (max == null ? 0 : max) + 1;
        return "SUP-" + next;
    }
}
