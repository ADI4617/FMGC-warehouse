package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.AiChatRequest;
import com.fmgc.warehouse.dto.request.AiScanRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    /**
     * POST /api/v1/ai/chat
     * Body: { "message": "user question" }
     * Returns: { "success": true, "data": { "response": "AI answer" } }
     */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<?>> chat(
            @Valid @RequestBody AiChatRequest req,
            @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.chat(req, up.getTenantId())));
    }

    /**
     * POST /api/v1/ai/scan-invoice
     * Body: { "imageBase64": "...", "mimeType": "image/jpeg" }
     * Returns: { "success": true, "data": { "extractedData": "[{...}]" } }
     */
    @PostMapping("/scan-invoice")
    public ResponseEntity<ApiResponse<?>> scanInvoice(
            @RequestBody AiScanRequest req,
            @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.scanInvoice(req.toAiChatRequest(), up.getTenantId())));
    }

    /**
     * GET /api/v1/ai/optimizations
     * Returns: { "success": true, "data": { "recommendations": "...", "lowStockCount": N, ... } }
     */
    @GetMapping("/optimizations")
    public ResponseEntity<ApiResponse<?>> getOptimizations(
            @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.getOptimizations(up.getTenantId())));
    }
}
