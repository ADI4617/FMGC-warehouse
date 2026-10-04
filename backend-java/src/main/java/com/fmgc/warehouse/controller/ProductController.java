package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.CreateProductRequest;
import com.fmgc.warehouse.dto.request.UpdateProductRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getProducts(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(productService.getProducts(up.getTenantId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> createProduct(@Valid @RequestBody CreateProductRequest req,
                                                         @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(productService.createProduct(req, up), "Product created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateProduct(@PathVariable String id,
                                                         @RequestBody UpdateProductRequest req,
                                                         @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(productService.updateProduct(id, req, up), "Product updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> deleteProduct(@PathVariable String id,
                                                          @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        productService.deleteProduct(id, up);
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted"));
    }
}
