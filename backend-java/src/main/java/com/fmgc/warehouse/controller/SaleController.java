package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.CreateSaleRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getSales(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(saleService.getSales(up.getTenantId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createSale(@Valid @RequestBody CreateSaleRequest req,
                                                      @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(saleService.createSale(req, up), "Sale created"));
    }
}
