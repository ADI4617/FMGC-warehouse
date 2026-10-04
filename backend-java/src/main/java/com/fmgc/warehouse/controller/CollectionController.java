package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.RecordCollectionRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.CollectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getCollections(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(collectionService.getCollections(up.getTenantId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> recordCollection(@Valid @RequestBody RecordCollectionRequest req,
                                                            @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(collectionService.recordCollection(req, up), "Collection recorded"));
    }
}
