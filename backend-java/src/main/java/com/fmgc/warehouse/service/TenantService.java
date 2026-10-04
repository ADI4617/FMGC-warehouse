package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.UpdateTenantRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Tenant;
import com.fmgc.warehouse.repository.TenantRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class TenantService {

    private final TenantRepository tenantRepository;

    public TenantService(TenantRepository tenantRepository) {
        this.tenantRepository = tenantRepository;
    }

    public Tenant getTenant(String tenantId) {
        return tenantRepository.findById(tenantId)
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Tenant not found"));
    }

    public Tenant updateTenant(UpdateTenantRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin");
        Tenant tenant = tenantRepository.findById(principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Tenant not found"));
        if (req.getName() != null) tenant.setName(req.getName());
        if (req.getLegalEntity() != null) tenant.setLegalEntity(req.getLegalEntity());
        if (req.getGstin() != null) tenant.setGstin(req.getGstin());
        if (req.getEmail() != null) tenant.setEmail(req.getEmail());
        if (req.getPhone() != null) tenant.setPhone(req.getPhone());
        if (req.getAddress() != null) tenant.setAddress(req.getAddress());
        if (req.getCity() != null) tenant.setCity(req.getCity());
        if (req.getState() != null) tenant.setState(req.getState());
        if (req.getCurrency() != null) tenant.setCurrency(req.getCurrency());
        tenantRepository.update(tenant);
        return tenant;
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
