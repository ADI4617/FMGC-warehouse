package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.RecordCollectionRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Collection;
import com.fmgc.warehouse.model.Customer;
import com.fmgc.warehouse.repository.CollectionRepository;
import com.fmgc.warehouse.repository.CustomerRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final CustomerRepository customerRepository;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");

    public CollectionService(CollectionRepository collectionRepository, CustomerRepository customerRepository) {
        this.collectionRepository = collectionRepository;
        this.customerRepository = customerRepository;
    }

    public List<Collection> getCollections(String tenantId) {
        return collectionRepository.findByTenantId(tenantId);
    }

    @Transactional
    public Collection recordCollection(RecordCollectionRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Collection Staff", "Manager");
        Customer customer = customerRepository.findById(req.getCustomerId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Customer not found"));

        String receiptNumber = collectionRepository.getNextReceiptNumber(principal.getTenantId());

        Collection c = new Collection();
        c.setId(UUID.randomUUID().toString());
        c.setTenantId(principal.getTenantId());
        c.setReceiptNumber(receiptNumber);
        c.setCustomerId(customer.getId());
        c.setCustomerName(customer.getName());
        c.setInvoiceNumber(req.getInvoiceNumber());
        c.setAmount(req.getAmount());
        c.setPaymentMethod(req.getPaymentMethod());
        c.setDate(LocalDate.now().toString());
        c.setTime(LocalTime.now().format(TIME_FMT));
        c.setRecordedBy(principal.getEmail());
        c.setNotes(req.getNotes());
        collectionRepository.save(c);

        // Decrement customer outstanding and overdue (min 0)
        BigDecimal newOutstanding = customer.getOutstandingBalance().subtract(req.getAmount());
        if (newOutstanding.compareTo(BigDecimal.ZERO) < 0) newOutstanding = BigDecimal.ZERO;
        BigDecimal newOverdue = customer.getOverdueAmount().subtract(req.getAmount());
        if (newOverdue.compareTo(BigDecimal.ZERO) < 0) newOverdue = BigDecimal.ZERO;
        customerRepository.updateBalance(customer.getId(), principal.getTenantId(), newOutstanding, newOverdue);

        return c;
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
