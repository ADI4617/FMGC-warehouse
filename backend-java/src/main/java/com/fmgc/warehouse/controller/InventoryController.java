package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.BatchActionRequest;
import com.fmgc.warehouse.dto.request.StockAdjustRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<?>> getBatches(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.getBatches(up.getTenantId())));
    }

    @GetMapping("/movements")
    public ResponseEntity<ApiResponse<?>> getMovements(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.getMovements(up.getTenantId())));
    }

    @PostMapping("/adjust")
    public ResponseEntity<ApiResponse<?>> adjustStock(@Valid @RequestBody StockAdjustRequest req,
                                                       @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        inventoryService.adjustStock(req, up);
        return ResponseEntity.ok(ApiResponse.ok(null, "Stock adjusted"));
    }

    @PostMapping("/expiry-discount")
    public ResponseEntity<ApiResponse<?>> applyExpiryDiscount(@Valid @RequestBody BatchActionRequest req,
                                                               @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        inventoryService.applyExpiryDiscount(req, up);
        return ResponseEntity.ok(ApiResponse.ok(null, "Expiry discount applied"));
    }

    @PostMapping("/write-off")
    public ResponseEntity<ApiResponse<?>> writeOff(@Valid @RequestBody BatchActionRequest req,
                                                    @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        inventoryService.writeOffBatch(req, up);
        return ResponseEntity.ok(ApiResponse.ok(null, "Batch written off"));
    }

    @PostMapping("/return-to-supplier")
    public ResponseEntity<ApiResponse<?>> returnToSupplier(@Valid @RequestBody BatchActionRequest req,
                                                            @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        inventoryService.returnToSupplier(req, up);
        return ResponseEntity.ok(ApiResponse.ok(null, "Batch returned to supplier"));
    }
}
