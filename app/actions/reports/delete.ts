import Report from '#models/report'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class DeleteReport {
  async handle(ctx: HttpContext, id: string) {
    const report = await Report.findOrFail(id)

    const deletedData = report.toJSON()

    await report.delete()

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.REPORT, id, deletedData)
    }

    return report
  }
}
