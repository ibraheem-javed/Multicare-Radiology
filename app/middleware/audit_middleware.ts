import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import LogAction from '#actions/audit/log_action'
import { EntityType, AuditAction } from '#models/audit_log'

/**
 * Audit middleware automatically logs certain requests
 * Currently configured to log all data modifications (POST, PUT, DELETE)
 */
export default class AuditMiddleware {
  /**
   * Map routes to entity types for automatic logging
   */
  private entityTypeMap: Record<string, EntityType> = {
    '/patients': EntityType.PATIENT,
    '/requests': EntityType.REQUEST,
    '/reports': EntityType.REPORT,
  }

  /**
   * Map HTTP methods to audit actions
   */
  private methodToAction: Record<string, AuditAction> = {
    POST: AuditAction.CREATED,
    PUT: AuditAction.UPDATED,
    PATCH: AuditAction.UPDATED,
    DELETE: AuditAction.DELETED,
  }

  async handle(ctx: HttpContext, next: NextFn) {
    // Execute the request first
    await next()

    // Only log if user is authenticated
    if (!ctx.auth.user) {
      return
    }

    // Only log modification requests (POST, PUT, DELETE)
    const method = ctx.request.method()
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return
    }

    // Determine entity type from route
    const route = ctx.request.url()
    const entityType = this.getEntityType(route)

    if (!entityType) {
      return
    }

    // Skip if response is not successful (4xx, 5xx errors)
    if (ctx.response.getStatus() >= 400) {
      return
    }

    // Get entity ID from route params or response
    const entityId = this.getEntityId(ctx)

    if (!entityId) {
      return
    }

    // Log the action
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

  /**
   * Determine entity type from route path
   */
  private getEntityType(route: string): EntityType | null {
    for (const [path, entityType] of Object.entries(this.entityTypeMap)) {
      if (route.startsWith(path)) {
        return entityType
      }
    }
    return null
  }

  /**
   * Extract entity ID from route params
   */
  private getEntityId(ctx: HttpContext): string | null {
    // Try to get from route params (common pattern: /resource/:id)
    const params = ctx.request.params()

    if (params.id) {
      return params.id
    }

    // For POST requests, ID might not be in params
    // We'll handle this in the actions themselves
    return null
  }
}
