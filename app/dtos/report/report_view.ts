import type Report from '#models/report'
import { DateTime } from 'luxon'
import { toPatientMinimal } from '#dtos/patient/patient_minimal'

function formatDate(value: DateTime | null): string | null {
  return value ? value.toFormat('MMM dd, yyyy') : null
}

export function toReportView(report: Report) {
  return {
    id: report.id,
    status: report.status,
    findingsPreview: report.findings.substring(0, 50) + '...',
    reportDate: formatDate(report.reportDate),
    patient: report.patient ? toPatientMinimal(report.patient) : null,
    radiologist: report.radiologist
      ? {
          firstName: report.radiologist.firstName,
          lastName: report.radiologist.lastName,
        }
      : null,
  }
}

export function toReportViewList(reports: Report[]) {
  return reports.map(toReportView)
}

export function toReportDetailedView(report: Report) {
  return {
    id: report.id,
    findings: report.findings,
    impression: report.impression,
    status: report.status,
    reportDate: formatDate(report.reportDate),
    patient: report.patient ? toPatientMinimal(report.patient) : null,
    radiologist: report.radiologist
      ? {
          firstName: report.radiologist.firstName,
          lastName: report.radiologist.lastName,
        }
      : null,
    request: report.request
      ? {
          procedureType: report.request.procedureType,
        }
      : null,
  }
}
