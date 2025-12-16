import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class UpdateReport {
  /**
   * Update an existing radiology report
   * Used in: ReportsController.update()
   *
   * Includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      findings: string
      impression: string | null
      status: ReportStatus
      report_date: Date
      radiologist_id: string | null
    }
  ) {
    const report = await Report.findOrFail(id)

    // Capture old data for audit trail
    const oldData = report.toJSON()

    report.merge({
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
      radiologistId: data.radiologist_id,
    })

    await report.save()

    // Log report update for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logUpdated(
        ctx.auth.user.id,
        EntityType.REPORT,
        report.id,
        oldData,
        report.toJSON()
      )
    }

    return report
  }
}
