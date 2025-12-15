import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import { DateTime } from 'luxon'

export default class UpdateReport {
  async handle(
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

    report.merge({
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
      radiologistId: data.radiologist_id,
    })

    await report.save()

    return report
  }
}
