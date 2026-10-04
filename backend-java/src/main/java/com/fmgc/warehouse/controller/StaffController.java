package com.fmgc.warehouse.controller;

import com.fmgc.warehouse.dto.request.AddStaffRequest;
import com.fmgc.warehouse.dto.request.UpdateStaffRequest;
import com.fmgc.warehouse.dto.response.ApiResponse;
import com.fmgc.warehouse.security.UserPrincipal;
import com.fmgc.warehouse.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getStaff(@AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(staffService.getStaff(up.getTenantId(), up)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> addStaff(@Valid @RequestBody AddStaffRequest req,
                                                    @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(staffService.addStaff(req, up), "Staff added"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> updateStaff(@PathVariable String id,
                                                       @RequestBody UpdateStaffRequest req,
                                                       @AuthenticationPrincipal Object principal) {
        UserPrincipal up = (UserPrincipal) principal;
        return ResponseEntity.ok(ApiResponse.ok(staffService.updateStaff(id, req, up), "Staff updated"));
    }
}
