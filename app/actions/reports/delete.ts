import Report from '#models/report'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class DeleteReport {
  /**
   * Delete a radiology report
   * Used in: ReportsController.destroy()
   *
   * Includes audit logging for compliance
   */
  async handle(ctx: HttpContext, id: string) {
    const report = await Report.findOrFail(id)

    // Capture report data before deletion for audit trail
    const deletedData = report.toJSON()

    await report.delete()

    // Log report deletion for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.REPORT, id, deletedData)
    }

    return report
  }
}
