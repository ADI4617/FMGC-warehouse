package com.fmgc.warehouse.service;

import com.fmgc.warehouse.dto.request.LoginRequest;
import com.fmgc.warehouse.dto.request.SignupRequest;
import com.fmgc.warehouse.exception.AppException;
import com.fmgc.warehouse.model.Tenant;
import com.fmgc.warehouse.model.User;
import com.fmgc.warehouse.repository.TenantRepository;
import com.fmgc.warehouse.repository.UserRepository;
import com.fmgc.warehouse.security.JwtUtil;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, TenantRepository tenantRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(401, "UNAUTHORIZED", "Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AppException(401, "UNAUTHORIZED", "Invalid email or password");
        }
        if ("inactive".equalsIgnoreCase(user.getStatus())) {
            throw new AppException(403, "FORBIDDEN", "Account is inactive");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getTenantId(), user.getRole(), user.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", sanitizeUser(user));
        return result;
    }

    @Transactional
    public Map<String, Object> signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(409, "CONFLICT", "Email already registered");
        }
        // Create tenant
        String tenantId = UUID.randomUUID().toString();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setName(request.getTenantName() != null ? request.getTenantName() : request.getName() + "'s Warehouse");
        tenant.setEmail(request.getEmail());
        tenant.setPhone(request.getPhone());
        tenant.setCurrency("INR");
        tenant.setPlan("Starter");
        tenant.setStatus("active");
        tenant.setCreatedDate(LocalDate.now().toString());
        tenant.setTotalSkusCount(0);
        tenantRepository.save(tenant);

        // Create owner user
        String userId = UUID.randomUUID().toString();
        User user = new User();
        user.setId(userId);
        user.setTenantId(tenantId);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("Owner");
        user.setStatus("active");
        user.setDateJoined(LocalDate.now().toString());
        user.setPermissions(List.of());
        user.setAccessModules(List.of());
        userRepository.save(user);

        String token = jwtUtil.generateToken(userId, tenantId, "Owner", request.getEmail());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", sanitizeUser(user));
        return result;
    }

    public Map<String, Object> getMe(UserPrincipal principal) {
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new AppException(404, "NOT_FOUND", "User not found"));
        return sanitizeUser(user);
    }

    private Map<String, Object> sanitizeUser(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("tenantId", user.getTenantId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("role", user.getRole());
        map.put("department", user.getDepartment());
        map.put("avatar", user.getAvatar());
        map.put("status", user.getStatus());
        map.put("lastActive", user.getLastActive());
        map.put("dateJoined", user.getDateJoined());
        map.put("permissions", user.getPermissions());
        map.put("accessModules", user.getAccessModules());
        return map;
    }
}
