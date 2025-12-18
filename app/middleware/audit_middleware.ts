import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'
import { AuditAction } from '#enums/audit_action'

export default class AuditMiddleware {
  private entityTypeMap: Record<string, EntityType> = {
    '/patients': EntityType.PATIENT,
    '/requests': EntityType.REQUEST,
    '/reports': EntityType.REPORT,
  }

  private methodToAction: Record<string, AuditAction> = {
    POST: AuditAction.CREATED,
    PUT: AuditAction.UPDATED,
    PATCH: AuditAction.UPDATED,
    DELETE: AuditAction.DELETED,
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await next()

    if (!ctx.auth.user) {
      return
    }

    const method = ctx.request.method()
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return
    }

    const route = ctx.request.url()
    const entityType = this.getEntityType(route)

    if (!entityType) {
      return
    }

    if (ctx.response.getStatus() >= 400) {
      return
    }

    const entityId = this.getEntityId(ctx)

    if (!entityId) {
      return
    }

    const logAction = new LogAction(ctx)
    const action = this.methodToAction[method]

    await logAction.handle({
      userId: ctx.auth.user.id,
      action,
      entityType,
      entityId,
      ipAddress: ctx.request.ip(),
      userAgent: ctx.request.header('user-agent'),
    })
  }

  private getEntityType(route: string): EntityType | null {
    for (const [path, entityType] of Object.entries(this.entityTypeMap)) {
      if (route.startsWith(path)) {
        return entityType
      }
    }
    return null
  }

  private getEntityId(ctx: HttpContext): string | null {
    const params = ctx.request.params()

    if (params.id) {
      return params.id
    }

    return null
  }
}
