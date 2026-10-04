package com.fmgc.warehouse.repository;

import com.fmgc.warehouse.model.Collection;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CollectionRepository {

    private final JdbcTemplate jdbc;

    public CollectionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<Collection> mapper = (rs, row) -> {
        Collection c = new Collection();
        c.setId(rs.getString("id"));
        c.setTenantId(rs.getString("tenant_id"));
        c.setReceiptNumber(rs.getString("receipt_number"));
        c.setCustomerId(rs.getString("customer_id"));
        c.setCustomerName(rs.getString("customer_name"));
        c.setInvoiceNumber(rs.getString("invoice_number"));
        c.setAmount(rs.getBigDecimal("amount"));
        c.setPaymentMethod(rs.getString("payment_method"));
        c.setDate(rs.getString("date"));
        c.setTime(rs.getString("time"));
        c.setRecordedBy(rs.getString("recorded_by"));
        c.setNotes(rs.getString("notes"));
        return c;
    };

    public List<Collection> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM collections WHERE tenant_id = ? ORDER BY date DESC, time DESC", mapper, tenantId);
    }

    public void save(Collection c) {
        jdbc.update("INSERT INTO collections(id,tenant_id,receipt_number,customer_id,customer_name,invoice_number,amount,payment_method,date,time,recorded_by,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
                c.getId(), c.getTenantId(), c.getReceiptNumber(), c.getCustomerId(),
                c.getCustomerName(), c.getInvoiceNumber(), c.getAmount(), c.getPaymentMethod(),
                c.getDate(), c.getTime(), c.getRecordedBy(), c.getNotes());
    }

    public String getNextReceiptNumber(String tenantId) {
        String max = jdbc.queryForObject(
            "SELECT MAX(receipt_number) FROM collections WHERE tenant_id = ? AND receipt_number LIKE 'RCP-%'",
            String.class, tenantId);
        int next = 1;
        if (max != null) {
            try {
                next = Integer.parseInt(max.substring(4)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("RCP-%04d", next);
    }
}
