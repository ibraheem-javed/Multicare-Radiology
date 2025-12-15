import Report, { ReportStatus } from '#models/report'
import Request from '#models/request'
import { DateTime } from 'luxon'

export default class CreateReport {
  /**
   * Create a new radiology report
   * Used in: ReportsController.store()
   *
   * Special logic: Fetches patient ID from the associated request
   *
   * Future: Can add logic for:
   * - Auto-updating request status to 'completed'
   * - Sending report notification to patient
   * - Sending report to referring physician
   * - Generating PDF version of report
   * - Quality assurance workflow
   * - Peer review assignment
   */
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

    // Future: Auto-update request status
    // request.status = 'completed'
    // await request.save()

    // Future: Add notification logic here
    // await sendReportNotification(report)
    // await generateReportPDF(report)

    return report
  }
}
