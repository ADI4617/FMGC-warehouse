package com.fmgc.warehouse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.dto.request.CreateSaleRequest;
import com.fmgc.warehouse.dto.request.SaleItemDto;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Batch;
import com.fmgc.warehouse.model.Customer;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.model.Sale;
import com.fmgc.warehouse.repository.BatchRepository;
import com.fmgc.warehouse.repository.CustomerRepository;
import com.fmgc.warehouse.repository.ProductRepository;
import com.fmgc.warehouse.repository.SaleRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");

    public SaleService(SaleRepository saleRepository, CustomerRepository customerRepository,
                       ProductRepository productRepository, BatchRepository batchRepository,
                       InventoryService inventoryService, ObjectMapper objectMapper) {
        this.saleRepository = saleRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.inventoryService = inventoryService;
        this.objectMapper = objectMapper;
    }

    public List<Sale> getSales(String tenantId) {
        return saleRepository.findByTenantId(tenantId);
    }

    @Transactional
    public Sale createSale(CreateSaleRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Sales Staff", "Manager");
        Customer customer = customerRepository.findById(req.getCustomerId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Customer not found"));

        String invoiceNumber = saleRepository.getNextInvoiceNumber(principal.getTenantId());
        BigDecimal totalAmount = req.getTotalAmount() != null ? req.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal amountPaid = req.getAmountPaid() != null ? req.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal balanceDue = totalAmount.subtract(amountPaid);
        if (balanceDue.compareTo(BigDecimal.ZERO) < 0) balanceDue = BigDecimal.ZERO;

        // Deduct stock FEFO per item
        if (req.getItems() != null) {
            for (SaleItemDto item : req.getItems()) {
                if (item.getProductId() != null && item.getQuantity() != null && item.getQuantity() > 0) {
                    deductStockFefo(item.getProductId(), principal.getTenantId(), item.getQuantity(),
                            invoiceNumber, principal.getEmail(), item.getProductName(), item.getSku());
                }
            }
        }

        Sale sale = new Sale();
        sale.setId(UUID.randomUUID().toString());
        sale.setTenantId(principal.getTenantId());
        sale.setInvoiceNumber(invoiceNumber);
        sale.setCustomerId(customer.getId());
        sale.setCustomerName(customer.getName());
        sale.setStoreName(customer.getStoreName());
        sale.setDate(LocalDate.now().toString());
        sale.setTime(LocalTime.now().format(TIME_FMT));
        // Convert items to List<Map>
        try {
            String itemsJson = objectMapper.writeValueAsString(req.getItems());
            sale.setItems(objectMapper.readValue(itemsJson, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {}));
        } catch (Exception ignored) {}
        sale.setSubtotal(req.getSubtotal());
        sale.setDiscountAmount(req.getDiscountAmount());
        sale.setTaxAmount(req.getTaxAmount());
        sale.setTotalAmount(totalAmount);
        sale.setAmountPaid(amountPaid);
        sale.setBalanceDue(balanceDue);
        sale.setPaymentMethod(req.getPaymentMethod());
        sale.setPaymentStatus(balanceDue.compareTo(BigDecimal.ZERO) == 0 ? "Paid" : "Partial");
        sale.setCreatedBy(principal.getEmail());
        saleRepository.save(sale);

        // Update customer outstanding balance
        if (balanceDue.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal newOutstanding = customer.getOutstandingBalance().add(balanceDue);
            customerRepository.updateBalance(customer.getId(), principal.getTenantId(),
                    newOutstanding, customer.getOverdueAmount());
        }

        return sale;
    }

    private void deductStockFefo(String productId, String tenantId, int qty, String refNo, String actor, String productName, String sku) {
        List<Batch> batches = batchRepository.findByProductIdFefo(productId, tenantId);
        int remaining = qty;
        for (Batch batch : batches) {
            if (remaining <= 0) break;
            int deduct = Math.min(remaining, batch.getQuantity());
            batchRepository.updateQuantity(batch.getId(), batch.getQuantity() - deduct);
            remaining -= deduct;
        }
        // Update product stock
        productRepository.findById(productId, tenantId).ifPresent(p -> {
            int newStock = Math.max(0, p.getInStock() - qty);
            productRepository.updateStock(productId, tenantId, newStock);
        });
        // Create stock movement
        inventoryService.saveMovement(tenantId, "Sale", sku != null ? sku : "", productName != null ? productName : "", qty, refNo, "Sale: " + refNo, actor);
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
