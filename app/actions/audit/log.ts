import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'
import { EntityType } from '#enums/entity_type'
import { AuditAction } from '#enums/audit_action'

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

  async logAccessed(userId: string, entityType: EntityType, entityId: string) {
    return this.handle({
      userId,
      action: AuditAction.ACCESSED,
      entityType,
      entityId,
    })
  }
}
