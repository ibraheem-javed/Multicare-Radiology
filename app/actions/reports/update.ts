import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'

export default class UpdateReport {
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      findings: string
      impression: string | null
      status: ReportStatus
      reportDate: Date
      radiologistId: string | null
    }
  ) {
    const report = await Report.findOrFail(id)

    const oldData = report.toJSON()

    report.merge({
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.reportDate),
      radiologistId: data.radiologistId,
    })

    await report.save()

    return report
  }
}
