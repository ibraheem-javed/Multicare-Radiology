import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuditLog, { AuditAction, EntityType } from '#models/audit_log'

type LogActionParams = {
  userId: string
  action: AuditAction
  entityType: EntityType
  entityId: string
  changes?: {
    old?: Record<string, any>
    new?: Record<string, any>
  }
  ipAddress?: string
  userAgent?: string
}

@inject()
export default class LogAction {
  constructor(protected ctx: HttpContext) {}

  /**
   * Log an audit trail entry
   * Used for tracking all create, update, delete, and access operations
   *
   * @param params - Audit log parameters
   * @returns Created audit log entry
   */
  async handle(params: LogActionParams) {
    const auditLog = await AuditLog.create({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      changes: params.changes || null,
      ipAddress: params.ipAddress || this.ctx.request.ip(),
      userAgent: params.userAgent || this.ctx.request.header('user-agent'),
    })

    return auditLog
  }

  /**
   * Helper: Log creation of an entity
   */
  async logCreated(
    userId: string,
    entityType: EntityType,
    entityId: string,
    newData: Record<string, any>
  ) {
    return this.handle({
      userId,
      action: AuditAction.CREATED,
      entityType,
      entityId,
      changes: { new: newData },
    })
  }

  /**
   * Helper: Log update of an entity
   */
  async logUpdated(
    userId: string,
    entityType: EntityType,
    entityId: string,
    oldData: Record<string, any>,
    newData: Record<string, any>
  ) {
    return this.handle({
      userId,
      action: AuditAction.UPDATED,
      entityType,
      entityId,
      changes: { old: oldData, new: newData },
    })
  }

  /**
   * Helper: Log deletion of an entity
   */
  async logDeleted(
    userId: string,
    entityType: EntityType,
    entityId: string,
    oldData: Record<string, any>
  ) {
    return this.handle({
      userId,
      action: AuditAction.DELETED,
      entityType,
      entityId,
      changes: { old: oldData },
    })
  }

  /**
   * Helper: Log access to an entity
   */
  async logAccessed(userId: string, entityType: EntityType, entityId: string) {
    return this.handle({
      userId,
      action: AuditAction.ACCESSED,
      entityType,
      entityId,
    })
  }
}
