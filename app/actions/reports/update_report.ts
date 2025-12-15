import Report, { ReportStatus } from '#models/report'
import { DateTime } from 'luxon'

export default class UpdateReport {
  /**
   * Update an existing radiology report
   * Used in: ReportsController.update()
   *
   * Future: Can add logic for:
   * - Detecting status changes and triggering workflows
   * - Version control for report changes
   * - Notifying relevant parties of amendments
   * - Audit trail for compliance
   * - Peer review workflow for amendments
   * - Re-generating PDF if findings changed
   */
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

    // Future: Track changes for audit
    // const oldFindings = report.findings
    // const oldStatus = report.status

    report.merge({
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
      radiologistId: data.radiologist_id,
    })

    await report.save()

    // Future: Add notification logic based on changes
    // if (oldFindings !== data.findings) {
    //   await logReportAmendment(report, oldFindings)
    //   await regenerateReportPDF(report)
    // }

    return report
  }
}
