import Report from '#models/report'
import { ReportStatus } from '#enums/report_status'
import Request from '#models/request'
import { DateTime } from 'luxon'

export default class CreateReport {
  async handle(data: {
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
    return report
  }
}
