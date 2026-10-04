package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Customer;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CustomerRepository {

    private final JdbcTemplate jdbc;

    public CustomerRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Customer> mapper = (rs, row) -> {
        Customer c = new Customer();
        c.setId(rs.getString("id"));
        c.setTenantId(rs.getString("tenant_id"));
        c.setCode(rs.getString("code"));
        c.setName(rs.getString("name"));
        c.setStoreName(rs.getString("store_name"));
        c.setContactPerson(rs.getString("contact_person"));
        c.setPhone(rs.getString("phone"));
        c.setEmail(rs.getString("email"));
        c.setAddress(rs.getString("address"));
        c.setZone(rs.getString("zone"));
        c.setCreditLimit(rs.getBigDecimal("credit_limit"));
        c.setOutstandingBalance(rs.getBigDecimal("outstanding_balance"));
        c.setOverdueAmount(rs.getBigDecimal("overdue_amount"));
        c.setPaymentTermsDays(rs.getObject("payment_terms_days", Integer.class));
        c.setStatus(rs.getString("status"));
        c.setLastOrderDate(rs.getString("last_order_date"));
        return c;
    };

    public List<Customer> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM customers WHERE tenant_id = ? ORDER BY name", mapper, tenantId);
    }

    public Optional<Customer> findById(String id, String tenantId) {
        List<Customer> results = jdbc.query("SELECT * FROM customers WHERE id = ? AND tenant_id = ?", mapper, id, tenantId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void save(Customer c) {
        jdbc.update("INSERT INTO customers(id,tenant_id,code,name,store_name,contact_person,phone,email,address,zone,credit_limit,outstanding_balance,overdue_amount,payment_terms_days,status,last_order_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                c.getId(), c.getTenantId(), c.getCode(), c.getName(), c.getStoreName(),
                c.getContactPerson(), c.getPhone(), c.getEmail(), c.getAddress(), c.getZone(),
                c.getCreditLimit(), c.getOutstandingBalance(), c.getOverdueAmount(),
                c.getPaymentTermsDays(), c.getStatus(), c.getLastOrderDate());
    }

    public void updateBalance(String customerId, String tenantId, java.math.BigDecimal outstanding, java.math.BigDecimal overdue) {
        jdbc.update("UPDATE customers SET outstanding_balance = ?, overdue_amount = ? WHERE id = ? AND tenant_id = ?",
                outstanding, overdue, customerId, tenantId);
    }

    public String getNextCode(String tenantId) {
        Integer max = jdbc.queryForObject(
            "SELECT COALESCE(MAX(CAST(SUBSTRING(code FROM 6) AS INTEGER)), 0) FROM customers WHERE tenant_id = ? AND code LIKE 'CUST-%'",
            Integer.class, tenantId);
        int next = (max == null ? 0 : max) + 1;
        return String.format("CUST-%03d", next);
    }
}
