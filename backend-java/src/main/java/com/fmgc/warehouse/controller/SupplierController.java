package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.CreateSupplierRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getSuppliers(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(supplierService.getSuppliers(up.getTenantId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createSupplier(@Valid @RequestBody CreateSupplierRequest req,
                                                          @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(supplierService.createSupplier(req, up), "Supplier created"));
    }
}
