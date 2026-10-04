package com.fmgc.warehouse.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public UserRepository(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    private RowMapper<User> mapper() {
        return (rs, row) -> {
            User u = new User();
            u.setId(rs.getString("id"));
            u.setTenantId(rs.getString("tenant_id"));
            u.setName(rs.getString("name"));
            u.setEmail(rs.getString("email"));
            u.setPasswordHash(rs.getString("password_hash"));
            u.setPhone(rs.getString("phone"));
            u.setRole(rs.getString("role"));
            u.setDepartment(rs.getString("department"));
            u.setAvatar(rs.getString("avatar"));
            u.setStatus(rs.getString("status"));
            u.setLastActive(rs.getString("last_active"));
            u.setDateJoined(rs.getString("date_joined"));
            try {
                String perms = rs.getString("permissions");
                if (perms != null && !perms.isBlank()) {
                    u.setPermissions(objectMapper.readValue(perms, new TypeReference<List<String>>() {}));
                }
                String modules = rs.getString("access_modules");
                if (modules != null && !modules.isBlank()) {
                    u.setAccessModules(objectMapper.readValue(modules, new TypeReference<List<String>>() {}));
                }
            } catch (Exception ignored) {}
            return u;
        };
    }

    public Optional<User> findByEmail(String email) {
        List<User> results = jdbc.query("SELECT * FROM users WHERE email = ?", mapper(), email);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Optional<User> findById(String id) {
        List<User> results = jdbc.query("SELECT * FROM users WHERE id = ?", mapper(), id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<User> findByTenantId(String tenantId) {
        return jdbc.query("SELECT * FROM users WHERE tenant_id = ? ORDER BY name", mapper(), tenantId);
    }

    public void save(User u) {
        try {
            String perms = u.getPermissions() != null ? objectMapper.writeValueAsString(u.getPermissions()) : "[]";
            String modules = u.getAccessModules() != null ? objectMapper.writeValueAsString(u.getAccessModules()) : "[]";
            jdbc.update("INSERT INTO users(id,tenant_id,name,email,password_hash,phone,role,department,avatar,status,last_active,date_joined,permissions,access_modules) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    u.getId(), u.getTenantId(), u.getName(), u.getEmail(), u.getPasswordHash(),
                    u.getPhone(), u.getRole(), u.getDepartment(), u.getAvatar(), u.getStatus(),
                    u.getLastActive(), u.getDateJoined(), perms, modules);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save user", e);
        }
    }

    public void update(User u) {
        try {
            String perms = u.getPermissions() != null ? objectMapper.writeValueAsString(u.getPermissions()) : "[]";
            String modules = u.getAccessModules() != null ? objectMapper.writeValueAsString(u.getAccessModules()) : "[]";
            jdbc.update("UPDATE users SET name=?,role=?,phone=?,department=?,status=?,permissions=?,access_modules=? WHERE id=? AND tenant_id=?",
                    u.getName(), u.getRole(), u.getPhone(), u.getDepartment(), u.getStatus(),
                    perms, modules, u.getId(), u.getTenantId());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user", e);
        }
    }

    public boolean existsByEmail(String email) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, email);
        return count != null && count > 0;
    }
}
