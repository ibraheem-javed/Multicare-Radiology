import type { HttpContext } from '@adonisjs/core/http'
import AuditLog from '#models/audit_log'

export default class AuditLogsController {
  /**
   * Display a list of audit logs with optional filters
   * GET /audit-logs
   */
  async index({ inertia, request }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 50

    // Get filter parameters
    const entityType = request.input('entity_type')
    const action = request.input('action')
    const userId = request.input('user_id')
    const entityId = request.input('entity_id')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    // Build query with filters
    const query = AuditLog.query().preload('user').orderBy('created_at', 'desc')

    // Apply filters if provided
    if (entityType) {
      query.where('entity_type', entityType)
    }

    if (action) {
      query.where('action', action)
    }

    if (userId) {
      query.where('user_id', userId)
    }

    if (entityId) {
      query.where('entity_id', entityId)
    }

    if (startDate) {
      query.where('created_at', '>=', startDate)
    }

    if (endDate) {
      query.where('created_at', '<=', endDate)
    }

    // Execute query with pagination
    const logs = await query.paginate(page, perPage)

    // Transform logs for frontend
    const logsData = logs.all().map((log) => {
      return {
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        changes: log.changes,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt.toISO(),
        user: log.user
          ? {
              id: log.user.id,
              firstName: log.user.firstName,
              lastName: log.user.lastName,
              email: log.user.email,
            }
          : null,
      }
    })

    return inertia.render('audit/logs', {
      logs: logsData,
      pagination: {
        currentPage: logs.currentPage,
        lastPage: logs.lastPage,
        total: logs.total,
        perPage: logs.perPage,
      },
      filters: {
        entityType,
        action,
        userId,
        entityId,
        startDate,
        endDate,
      },
    })
  }
}
