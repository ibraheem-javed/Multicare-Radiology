import Report from '#models/report'
import ReportDTO from '#dtos/report'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log_action'
import { EntityType } from '#models/audit_log'

export default class GetReport {
  /**
   * Get a single report with full details for display
   * Used in: ReportsController.show()
   *
   * Logs report access for compliance
   */
  async handleForShow(ctx: HttpContext, id: string) {
    const report = await Report.query()
      .where('id', id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    // Log report access for audit trail (compliance requirement)
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.REPORT, report.id)
    }

    return ReportDTO.toDetailedFrontend(report)
  }

  /**
   * Get a single report for editing
   * Used in: ReportsController.edit()
   */
  async handle(id: string) {
    const report = await Report.findOrFail(id)
    return ReportDTO.toEditForm(report)
  }
}
