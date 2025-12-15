import type Report from '#models/report'
import PatientDTO from '#dtos/patient'
import { DateTime } from 'luxon'

export default class ReportDTO {
  /**
   * Format date to readable format: "Jan 01, 2000"
   * Handles both string and DateTime objects from Lucid ORM
   */
  private static formatDate(value: string | DateTime | null): string | null {
    if (!value) return null

    try {
      let date: DateTime

      if (value instanceof DateTime) {
        date = value
      } else if (typeof value === 'string') {
        date = DateTime.fromISO(value)

        if (!date.isValid) {
          date = DateTime.fromFormat(value, 'yyyy-MM-dd')
        }
      } else {
        return null
      }

      if (!date.isValid) {
        return null
      }

      return date.toFormat('MMM dd, yyyy')
    } catch (error) {
      console.error('Date formatting error:', error)
      return null
    }
  }

  /**
   * Transform Report model to frontend format (camelCase)
   * Database uses snake_case, frontend uses camelCase
   * Used in: index view
   */
  static toFrontend(report: Report) {
    return {
      id: report.id,
      status: report.status,
      findingsPreview: report.findings.substring(0, 50) + '...',
      reportDate: this.formatDate(report.reportDate),
      patient: report.patient ? PatientDTO.toMinimal(report.patient) : null,
      radiologist: report.radiologist
        ? {
            firstName: report.radiologist.firstName,
            lastName: report.radiologist.lastName,
          }
        : null,
    }
  }

  /**
   * Transform array of Report models to frontend format
   * Used in: index view
   */
  static toFrontendList(reports: Report[]) {
    return reports.map((report) => this.toFrontend(report))
  }

  /**
   * Transform Report model to detailed frontend format
   * Used in: show view
   */
  static toDetailedFrontend(report: Report) {
    return {
      id: report.id,
      findings: report.findings,
      impression: report.impression,
      status: report.status,
      reportDate: this.formatDate(report.reportDate),
      patient: report.patient ? PatientDTO.toMinimal(report.patient) : null,
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

  /**
   * Transform Report model for edit form (snake_case, unformatted dates)
   * Form fields must match validator field names
   * Used in: edit view
   */
  static toEditForm(report: Report) {
    return {
      id: report.id,
      findings: report.findings,
      impression: report.impression,
      status: report.status,
      report_date: report.reportDate.toISODate(),
      radiologist_id: report.radiologistId,
    }
  }

  /**
   * Transform radiologist data for dropdowns
   * Used in: create, edit views
   */
  static radiologistToDropdown(user: any) {
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    }
  }

  /**
   * Transform array of radiologists for dropdowns
   * Used in: create, edit views
   */
  static radiologistsToDropdownList(users: any[]) {
    return users.map((user) => this.radiologistToDropdown(user))
  }
}
