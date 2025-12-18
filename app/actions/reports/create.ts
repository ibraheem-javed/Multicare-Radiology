import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import Request from '#models/request'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class CreateReport {
  async handle(
    ctx: HttpContext,
    data: {
      requestId: string
      radiologistId: string | null
      findings: string
      impression: string | null
      status: ReportStatus
      reportDate: Date
    }
  ) {
    const request = await Request.findOrFail(data.requestId)

    const report = await Report.create({
      requestId: data.requestId,
      patientId: request.patientId,
      radiologistId: data.radiologistId,
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.reportDate),
    })

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(ctx.auth.user.id, EntityType.REPORT, report.id, report.toJSON())
    }

    return report
  }
}
