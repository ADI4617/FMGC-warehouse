package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.CreateCustomerRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Customer;
import com.fmgc.warehouse.repository.CustomerRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getCustomers(String tenantId) {
        return customerRepository.findByTenantId(tenantId);
    }

    public Customer createCustomer(CreateCustomerRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Sales Staff", "Collection Staff", "Manager");
        String code = customerRepository.getNextCode(principal.getTenantId());
        Customer c = new Customer();
        c.setId(UUID.randomUUID().toString());
        c.setTenantId(principal.getTenantId());
        c.setCode(code);
        c.setName(req.getName());
        c.setStoreName(req.getStoreName());
        c.setContactPerson(req.getContactPerson());
        c.setPhone(req.getPhone());
        c.setEmail(req.getEmail());
        c.setAddress(req.getAddress());
        c.setZone(req.getZone());
        c.setCreditLimit(req.getCreditLimit() != null ? req.getCreditLimit() : BigDecimal.ZERO);
        c.setOutstandingBalance(BigDecimal.ZERO);
        c.setOverdueAmount(BigDecimal.ZERO);
        c.setPaymentTermsDays(req.getPaymentTermsDays() != null ? req.getPaymentTermsDays() : 30);
        c.setStatus("active");
        customerRepository.save(c);
        return c;
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
