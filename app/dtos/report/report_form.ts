import type Report from '#models/report'

export type ReportForm = {
  id: string
  findings: string
  impression: string
  status: string
  reportDate: string
  radiologistId: string | null
}

export function toReportForm(report: Report): ReportForm {
  return {
    id: report.id,
    findings: report.findings ?? '',
    impression: report.impression ?? '',
    status: report.status ?? '',
    reportDate: report.reportDate?.toISODate() ?? '',
    radiologistId: report.radiologistId ?? null,
  }
}
