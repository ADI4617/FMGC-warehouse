package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.AddStaffRequest;
import com.fmgc.warehouse.dto.request.UpdateStaffRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.User;
import com.fmgc.warehouse.repository.UserRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getStaff(String tenantId, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin", "Manager");
        return userRepository.findByTenantId(tenantId);
    }

    public User addStaff(AddStaffRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin");
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new AppException(409, "CONFLICT", "Email already registered");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setTenantId(principal.getTenantId());
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setRole(req.getRole());
        user.setDepartment(req.getDepartment());
        user.setStatus("active");
        user.setDateJoined(LocalDate.now().toString());
        user.setPermissions(req.getPermissions() != null ? req.getPermissions() : List.of());
        user.setAccessModules(req.getAccessModules() != null ? req.getAccessModules() : List.of());
        userRepository.save(user);
        return sanitize(user);
    }

    public User updateStaff(String id, UpdateStaffRequest req, UserPrincipal principal) {
        checkRole(principal, "Owner", "Admin");
        User user = userRepository.findById(id)
                .filter(u -> u.getTenantId().equals(principal.getTenantId()))
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "Staff member not found"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getRole() != null) user.setRole(req.getRole());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getDepartment() != null) user.setDepartment(req.getDepartment());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        if (req.getPermissions() != null) user.setPermissions(req.getPermissions());
        if (req.getAccessModules() != null) user.setAccessModules(req.getAccessModules());
        userRepository.update(user);
        return sanitize(user);
    }

    private User sanitize(User user) {
        user.setPasswordHash(null);
        return user;
    }

    private void checkRole(UserPrincipal principal, String... allowedRoles) {
        if (!Arrays.asList(allowedRoles).contains(principal.getRole())) {
            throw new AppException(403, "FORBIDDEN", "Access denied");
        }
    }
}
