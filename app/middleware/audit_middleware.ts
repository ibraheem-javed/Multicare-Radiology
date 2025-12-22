import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'
import { AuditAction } from '#enums/audit_action'
import Patient from '#models/patient'
import Request from '#models/request'
import Report from '#models/report'

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
    GET: AuditAction.ACCESSED,
  }

  private modelMap: Record<EntityType, any> = {
    [EntityType.PATIENT]: Patient,
    [EntityType.REQUEST]: Request,
    [EntityType.REPORT]: Report,
    [EntityType.USER]: Patient,
  }

  async handle(ctx: HttpContext, next: NextFn) {
    if (!ctx.auth.user) {
      await next()
      return
    }

    const method = ctx.request.method()
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      await next()
      return
    }

    const route = ctx.request.url()
    const entityType = this.getEntityType(route)

    if (!entityType) {
      await next()
      return
    }

    let oldData: Record<string, any> | undefined
    let entityId = this.getEntityIdFromRoute(ctx)

    if (entityId && method !== 'POST' && method !== 'GET') {
      try {
        const model = this.modelMap[entityType]
        const query = model.query().where('id', entityId)

        this.preloadRelationships(query, entityType)

        const entity = await query.first()
        if (entity) {
          oldData = entity.toJSON()
        }
      } catch (error) {
        console.error('Failed to fetch old entity state:', error)
      }
    }

    await next()

    if (ctx.response.getStatus() >= 400) {
      return
    }

    if (method === 'POST' && ctx.createdEntityId) {
      entityId = ctx.createdEntityId
    }

    if (!entityId) {
      return
    }

    let newData: Record<string, any> | undefined

    if (method !== 'DELETE' && method !== 'GET') {
      try {
        const model = this.modelMap[entityType]
        const query = model.query().where('id', entityId)

        this.preloadRelationships(query, entityType)

        const entity = await query.first()
        if (entity) {
          newData = entity.toJSON()
        }
      } catch (error) {
        console.error('Failed to fetch new entity state:', error)
      }
    }

    const logAction = new LogAction(ctx)
    const action = this.methodToAction[method]

    const changes =
      oldData || newData
        ? {
            old: oldData,
            new: newData,
          }
        : undefined

    try {
      await logAction.handle({
        userId: ctx.auth.user.id,
        action,
        entityType,
        entityId,
        changes,
        ipAddress: ctx.request.ip(),
        userAgent: ctx.request.header('user-agent'),
      })
    } catch (error) {
      console.error('Audit logging failed:', error)
    }
  }

  private getEntityType(route: string): EntityType | null {
    for (const [path, entityType] of Object.entries(this.entityTypeMap)) {
      if (route.startsWith(path)) {
        return entityType
      }
    }
    return null
  }

  private getEntityIdFromRoute(ctx: HttpContext): string | null {
    const params = ctx.request.params()

    if (params.id) {
      return params.id
    }

    return null
  }

  private preloadRelationships(query: any, entityType: EntityType): void {
    switch (entityType) {
      case EntityType.REQUEST:
        query.preload('requester')
        query.preload('patient')
        break
      case EntityType.REPORT:
        query.preload('radiologist')
        query.preload('patient')
        query.preload('request')
        break
      case EntityType.PATIENT:
        break
      default:
        break
    }
  }
}
