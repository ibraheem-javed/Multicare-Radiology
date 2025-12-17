import AuditLog from '#models/audit_log'

type GetLogsParams = {
  page: number
  perPage: number
  entityType?: string
  action?: string
  userId?: string
  entityId?: string
  startDate?: string
  endDate?: string
}

export default class GetLogs {
  async handle(params: GetLogsParams) {
    const { page, perPage, entityType, action, userId, entityId, startDate, endDate } = params

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
    const logsData = logs.all().map((log) => ({
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
    }))

    return {
      logs: logsData,
      pagination: {
        currentPage: logs.currentPage,
        lastPage: logs.lastPage,
        total: logs.total,
        perPage: logs.perPage,
      },
    }
  }
}
