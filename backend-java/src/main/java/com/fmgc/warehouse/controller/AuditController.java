package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAuditLogs(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        if (!Arrays.asList("Owner", "Admin").contains(up.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
        return ResponseEntity.ok(ApiResponse.ok(auditService.getAuditLogs(up.getTenantId())));
    }
}
