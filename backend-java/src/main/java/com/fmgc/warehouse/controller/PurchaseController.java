package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.CreatePurchaseRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getPurchases(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(purchaseService.getPurchases(up.getTenantId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createPurchase(@Valid @RequestBody CreatePurchaseRequest req,
                                                          @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(purchaseService.createPurchase(req, up), "Purchase created"));
    }
}
