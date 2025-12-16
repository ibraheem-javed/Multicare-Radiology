import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import Request from '#models/request'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class CreateReport {
  /**
   * Create a new radiology report
   * Used in: ReportsController.store()
   *
   * Includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    data: {
    request_id: string
    radiologist_id: string | null
    findings: string
    impression: string | null
    status: ReportStatus
    report_date: Date
  }) {
    // Fetch the request to get patient ID
    const request = await Request.findOrFail(data.request_id)

    const report = await Report.create({
      requestId: data.request_id,
      patientId: request.patientId,
      radiologistId: data.radiologist_id,
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
    })

    // Log report creation for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(
        ctx.auth.user.id,
        EntityType.REPORT,
        report.id,
        report.toJSON()
      )
    }

    return report
  }
}
