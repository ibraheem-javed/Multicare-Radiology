import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetLogs from '#actions/audit/get_logs'
import ListUsers from '#actions/user/get_all'

@inject()
export default class AuditLogsController {
  constructor(
    protected getAuditLogs: GetLogs,
    protected listUsers: ListUsers
  ) {}

  async index({ request, inertia }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = 50
    const entityType = request.input('entity_type')
    const action = request.input('action')
    const userId = request.input('user_id')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const { logs, pagination } = await this.getAuditLogs.handle({
      page,
      perPage,
      entityType,
      action,
      userId,
      startDate,
      endDate,
    })

    const users = await this.listUsers.handle()

    return inertia.render('audit/logs', {
      logs,
      pagination,
      users,
      filters: {
        entityType,
        action,
        userId,
        startDate,
        endDate,
      },
    })
  }
}
