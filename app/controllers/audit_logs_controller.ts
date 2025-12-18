import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetLogs from '#actions/audit/get_logs'

@inject()
export default class AuditLogsController {
  constructor(protected getAuditLogs: GetLogs) {}

  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 50
    const entityType = request.input('entity_type')
    const action = request.input('action')
    const userId = request.input('user_id')
    const entityId = request.input('entity_id')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const { logs, pagination } = await this.getAuditLogs.handle({
      page,
      perPage,
      entityType,
      action,
      userId,
      entityId,
      startDate,
      endDate,
    })

    return inertia.render('audit/logs', {
      logs,
      pagination,
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
