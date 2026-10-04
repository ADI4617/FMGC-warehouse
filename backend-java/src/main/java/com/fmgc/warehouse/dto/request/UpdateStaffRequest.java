package com.fmgc.warehouse.dto.request;

import java.util.List;

public class UpdateStaffRequest {
    private String name;
    private String role;
    private String phone;
    private String department;
    private String status;
    private List<String> permissions;
    private List<String> accessModules;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }
    public List<String> getAccessModules() { return accessModules; }
    public void setAccessModules(List<String> accessModules) { this.accessModules = accessModules; }
}
