package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.AiChatRequest;
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

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<?>> chat(@Valid @RequestBody AiChatRequest req,
                                                @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.chat(req, up.getTenantId())));
    }

    @PostMapping("/scan-invoice")
    public ResponseEntity<ApiResponse<?>> scanInvoice(@RequestBody AiChatRequest req,
                                                       @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.scanInvoice(req, up.getTenantId())));
    }

    @GetMapping("/optimizations")
    public ResponseEntity<ApiResponse<?>> getOptimizations(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(aiService.getOptimizations(up.getTenantId())));
    }
}
