package com.fmgc.warehouse.security;

public class UserPrincipal {
    private final String userId;
    private final String tenantId;
    private final String role;
    private final String email;

    public UserPrincipal(String userId, String tenantId, String role, String email) {
        this.userId = userId;
        this.tenantId = tenantId;
        this.role = role;
        this.email = email;
    }

    public String getUserId() { return userId; }
    public String getTenantId() { return tenantId; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
}
