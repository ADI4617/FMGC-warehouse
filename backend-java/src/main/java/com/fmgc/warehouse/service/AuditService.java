package com.fmgc.warehouse.service;

import com.fmgc.warehouse.model.AuditLog;
import com.fmgc.warehouse.repository.AuditLogRepository;
import com.fmgc.warehouse.security.UserPrincipal;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void log(String tenantId, UserPrincipal principal, String action, String entity, String entityId,
                    String previousValue, String newValue, String reason, String ipAddress) {
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID().toString());
        log.setTenantId(tenantId);
        log.setTimestamp(LocalDateTime.now().format(FMT));
        log.setActor(principal.getEmail());
        log.setActorRole(principal.getRole());
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setPreviousValue(previousValue);
        log.setNewValue(newValue);
        log.setReason(reason);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAuditLogs(String tenantId) {
        return auditLogRepository.findByTenantId(tenantId);
    }
}
