import { v4 as uuid } from 'uuid';
import { auditLogRepository } from '../repositories/auditLogRepository.js';

interface AuditParams {
  tenantId: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue?: unknown;
  newValue?: unknown;
  reason?: string;
  ipAddress?: string;
}

export const auditService = {
  log(params: AuditParams) {
    const entry = {
      id: uuid(),
      tenant_id: params.tenantId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: params.actor,
      actor_role: params.actorRole,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId,
      previous_value: params.previousValue != null ? JSON.stringify(params.previousValue) : null,
      new_value: params.newValue != null ? JSON.stringify(params.newValue) : null,
      reason: params.reason ?? null,
      ip_address: params.ipAddress ?? null,
    };
    auditLogRepository.create(entry);
  },

  getAll(tenantId: string, opts?: {
    entity?: string;
    actor?: string;
    action?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    return auditLogRepository.findByTenant(tenantId, opts);
  },

  count(tenantId: string) {
    return auditLogRepository.countByTenant(tenantId);
  },
};
