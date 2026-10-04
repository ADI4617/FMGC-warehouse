package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.BatchActionRequest;
import com.fmgc.warehouse.dto.request.StockAdjustRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Batch;
import com.fmgc.warehouse.model.Product;
import com.fmgc.warehouse.model.StockMovement;
import com.fmgc.warehouse.repository.BatchRepository;
import com.fmgc.warehouse.repository.ProductRepository;
import com.fmgc.warehouse.repository.StockMovementRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class InventoryService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");
    private static final DateTimeFormatter DT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public InventoryService(BatchRepository batchRepository, ProductRepository productRepository,
                            StockMovementRepository stockMovementRepository) {
        this.batchRepository = batchRepository;
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<Batch> getBatches(String tenantId) {
        return batchRepository.findByTenantId(tenantId);
    }

    public List<StockMovement> getMovements(String tenantId) {
        return stockMovementRepository.findByTenantId(tenantId);
    }

    public void adjustStock(StockAdjustRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        Product p = productRepository.findById(req.getProductId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Product not found"));
        int newStock;
        String type;
        if ("subtract".equalsIgnoreCase(req.getType())) {
            newStock = p.getInStock() - req.getQuantity();
            if (newStock < 0) newStock = 0;
            type = "Adjustment Out";
        } else {
            newStock = p.getInStock() + req.getQuantity();
            type = "Adjustment In";
        }
        productRepository.updateStock(req.getProductId(), principal.getTenantId(), newStock);
        saveMovement(principal.getTenantId(), type, p.getSku(), p.getName(), req.getQuantity(), null, req.getReason(), principal.getEmail());
    }

    public void applyExpiryDiscount(BatchActionRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse", "Manager");
        Batch batch = batchRepository.findById(req.getBatchId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Batch not found"));
        if (batch.getDaysToExpiry() == null || batch.getDaysToExpiry() > 30) {
            throw new AppException(400, "VALIDATION_ERROR", "Expiry discount can only be applied when days_to_expiry <= 30");
        }
        // Mark batch status
        batchRepository.updateStatus(req.getBatchId(), "discounted");
        saveMovement(principal.getTenantId(), "Expiry Discount", batch.getSku(), batch.getProductName(),
                batch.getQuantity(), req.getBatchId(), "Expiry discount applied", principal.getEmail());
    }

    public void writeOffBatch(BatchActionRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse");
        Batch batch = batchRepository.findById(req.getBatchId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Batch not found"));
        Product p = productRepository.findById(batch.getProductId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Product not found"));
        int writeOffQty = batch.getQuantity();
        // Move qty to damaged, zero batch qty
        p.setDamaged((p.getDamaged() != null ? p.getDamaged() : 0) + writeOffQty);
        p.setInStock(Math.max(0, p.getInStock() - writeOffQty));
        productRepository.update(p);
        batchRepository.updateQuantity(req.getBatchId(), 0);
        batchRepository.updateStatus(req.getBatchId(), "written_off");
        saveMovement(principal.getTenantId(), "Damage", batch.getSku(), batch.getProductName(),
                writeOffQty, req.getBatchId(), req.getReason(), principal.getEmail());
    }

    public void returnToSupplier(BatchActionRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Warehouse");
        Batch batch = batchRepository.findById(req.getBatchId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Batch not found"));
        Product p = productRepository.findById(batch.getProductId(), principal.getTenantId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Product not found"));
        int returnQty = batch.getQuantity();
        p.setInStock(Math.max(0, p.getInStock() - returnQty));
        productRepository.update(p);
        batchRepository.updateQuantity(req.getBatchId(), 0);
        batchRepository.updateStatus(req.getBatchId(), "returned");
        saveMovement(principal.getTenantId(), "Return to Supplier", batch.getSku(), batch.getProductName(),
                returnQty, req.getBatchId(), req.getReason(), principal.getEmail());
    }

    public void saveMovement(String tenantId, String type, String sku, String productName,
                              int quantity, String referenceNo, String note, String actor) {
        StockMovement sm = new StockMovement();
        sm.setId(UUID.randomUUID().toString());
        sm.setTenantId(tenantId);
        sm.setTimestamp(LocalDateTime.now().format(DT_FMT));
        sm.setTimeFormatted(LocalTime.now().format(TIME_FMT));
        sm.setType(type);
        sm.setSku(sku);
        sm.setProductName(productName);
        sm.setQuantity(quantity);
        sm.setReferenceNo(referenceNo);
        sm.setNote(note);
        sm.setActor(actor);
        stockMovementRepository.save(sm);
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
