package com.fmgc.warehouse.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fmgc.warehouse.dto.request.CreatePurchaseRequest;
import com.fmgc.warehouse.dto.request.PurchaseItemDto;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Batch;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.model.Purchase;
import com.fmgc.warehouse.model.Supplier;
import com.fmgc.warehouse.repository.BatchRepository;
import com.fmgc.warehouse.repository.ProductRepository;
import com.fmgc.warehouse.repository.PurchaseRepository;
import com.fmgc.warehouse.repository.SupplierRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final InventoryService inventoryService;
    private final ObjectMapper objectMapper;

    public PurchaseService(PurchaseRepository purchaseRepository, SupplierRepository supplierRepository,
                           ProductRepository productRepository, BatchRepository batchRepository,
                           InventoryService inventoryService, ObjectMapper objectMapper) {
        this.purchaseRepository = purchaseRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.batchRepository = batchRepository;
        this.inventoryService = inventoryService;
        this.objectMapper = objectMapper;
    }

    public List<Purchase> getPurchases(String tenantId) {
        return purchaseRepository.findByTenantId(tenantId);
    }

    @Transactional
    public Purchase createPurchase(CreatePurchaseRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        Supplier supplier = supplierRepository.findById(req.getSupplierId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Supplier not found"));

        String invoiceNumber = purchaseRepository.getNextInvoiceNumber(principal.getTenantId());
        String status = req.getStatus() != null ? req.getStatus() : "Confirmed";

        Purchase purchase = new Purchase();
        purchase.setId(UUID.randomUUID().toString());
        purchase.setTenantId(principal.getTenantId());
        purchase.setInvoiceNumber(invoiceNumber);
        purchase.setSupplierId(supplier.getId());
        purchase.setSupplierName(supplier.getName());
        purchase.setDate(LocalDate.now().toString());
        purchase.setTotalAmount(req.getTotalAmount() != null ? req.getTotalAmount() : BigDecimal.ZERO);
        purchase.setPaymentStatus(req.getPaymentStatus() != null ? req.getPaymentStatus() : "Pending");
        purchase.setAiScanned(false);
        purchase.setStatus(status);
        purchase.setDocumentUrl(req.getDocumentUrl());
        try {
            String itemsJson = objectMapper.writeValueAsString(req.getItems());
            purchase.setItems(objectMapper.readValue(itemsJson, new com.fasterxml.jackson.core.type.TypeReference<List<Map<String, Object>>>() {}));
        } catch (Exception ignored) {}
        purchaseRepository.save(purchase);

        // If Confirmed: add stock, create batches, update supplier
        if ("Confirmed".equalsIgnoreCase(status) && req.getItems() != null) {
            for (PurchaseItemDto item : req.getItems()) {
                if (item.getProductId() != null && item.getQuantity() != null && item.getQuantity() > 0) {
                    addStockFromPurchase(item, principal.getTenantId(), invoiceNumber, principal.getEmail());
                }
            }
            // Update supplier totals
            BigDecimal newTotal = supplier.getTotalPurchases() != null ?
                    supplier.getTotalPurchases().add(purchase.getTotalAmount()) : purchase.getTotalAmount();
            supplierRepository.updateTotals(supplier.getId(), principal.getTenantId(),
                    supplier.getPayableBalance() != null ? supplier.getPayableBalance().add(purchase.getTotalAmount()) : purchase.getTotalAmount(),
                    newTotal);
        }

        return purchase;
    }

    private void addStockFromPurchase(PurchaseItemDto item, String tenantId, String refNo, String actor) {
        productRepository.findById(item.getProductId(), tenantId).ifPresent(p -> {
            int newStock = p.getInStock() + item.getQuantity();
            productRepository.updateStock(item.getProductId(), tenantId, newStock);
        });

        // Create batch
        Batch batch = new Batch();
        batch.setId(UUID.randomUUID().toString());
        batch.setTenantId(tenantId);
        batch.setProductId(item.getProductId());
        batch.setSku(item.getSku());
        batch.setProductName(item.getProductName());
        batch.setBatchNumber(item.getBatchNumber() != null ? item.getBatchNumber() : "BATCH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        batch.setQuantity(item.getQuantity());
        batch.setPurchasePrice(item.getUnitPrice());
        batch.setExpiryDate(item.getExpiryDate());
        batch.setMfgDate(item.getMfgDate());
        batch.setFefoPriority(item.getExpiryDate() != null);
        batch.setStatus("active");
        batchRepository.save(batch);

        // Create stock movement
        inventoryService.saveMovement(tenantId, "Purchase", item.getSku() != null ? item.getSku() : "",
                item.getProductName() != null ? item.getProductName() : "", item.getQuantity(), refNo, "Purchase: " + refNo, actor);
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
