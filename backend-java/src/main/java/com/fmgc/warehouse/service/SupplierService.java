package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.CreateSupplierRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Supplier;
import com.fmgc.warehouse.repository.SupplierRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getSuppliers(String tenantId) {
        return supplierRepository.findByTenantId(tenantId);
    }

    public Supplier createSupplier(CreateSupplierRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        String code = supplierRepository.getNextCode(principal.getTenantId());
        Supplier s = new Supplier();
        s.setId(UUID.randomUUID().toString());
        s.setTenantId(principal.getTenantId());
        s.setCode(code);
        s.setName(req.getName());
        s.setContactPerson(req.getContactPerson());
        s.setPhone(req.getPhone());
        s.setEmail(req.getEmail());
        s.setGstin(req.getGstin());
        s.setAddress(req.getAddress());
        s.setPayableBalance(BigDecimal.ZERO);
        s.setTotalPurchases(BigDecimal.ZERO);
        s.setRating(req.getRating());
        s.setLeadTimeDays(req.getLeadTimeDays());
        supplierRepository.save(s);
        return s;
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
