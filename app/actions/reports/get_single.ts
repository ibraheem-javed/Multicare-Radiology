import Report from '#models/report'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class GetReport {
  async handleForShow(ctx: HttpContext, id: string): Promise<Report> {
    const report = await Report.query()
      .where('id', id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.REPORT, report.id)
    }

    return report
  }

  async handle(id: string): Promise<Report> {
    return Report.findOrFail(id)
  }
}
