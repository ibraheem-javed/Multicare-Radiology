import type Request from '#models/request'
import PatientDTO from '#dtos/patient'
import { DateTime } from 'luxon'

export default class RequestDTO {
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
   * Transform Request model to frontend format (camelCase)
   * Database uses snake_case, frontend uses camelCase
   * Used in: index view
   */
  static toFrontend(request: Request) {
    return {
      id: request.id,
      procedureType: request.procedureType,
      requestDate: this.formatDate(request.requestDate),
      status: request.status,
      patient: request.patient ? PatientDTO.toMinimal(request.patient) : null,
      requestedBy: request.requestedBy
        ? {
            id: request.requestedBy.id,
            firstName: request.requestedBy.firstName,
            lastName: request.requestedBy.lastName,
          }
        : null,
    }
  }

  /**
   * Transform array of Request models to frontend format
   * Used in: index view
   */
  static toFrontendList(requests: Request[]) {
    return requests.map((request) => this.toFrontend(request))
  }

  /**
   * Transform Request model to detailed frontend format
   * Used in: show view
   */
  static toDetailedFrontend(request: Request) {
    return {
      id: request.id,
      procedureType: request.procedureType,
      requestDate: this.formatDate(request.requestDate),
      status: request.status,
      patient: request.patient ? PatientDTO.toMinimal(request.patient) : null,
      requestedBy: request.requestedBy
        ? {
            id: request.requestedBy.id,
            firstName: request.requestedBy.firstName,
            lastName: request.requestedBy.lastName,
          }
        : null,
    }
  }

  /**
   * Transform Request model for edit form (snake_case, unformatted dates)
   * Form fields must match validator field names
   * Used in: edit view
   */
  static toEditForm(request: Request) {
    return {
      id: request.id,
      procedure_type: request.procedureType,
      request_date: request.requestDate.toISODate(),
      status: request.status,
      patient_id: request.patientId,
      requested_by: request.requestedById,
    }
  }

  /**
   * Transform Request model for create dropdowns
   * Used in: create view when showing existing requests
   */
  static toDropdown(request: Request) {
    return {
      id: request.id,
      patient: request.patient ? PatientDTO.getFullName(request.patient) : 'Unknown',
      procedure: request.procedureType,
    }
  }

  /**
   * Transform array of Request models for dropdowns
   * Used in: reports create view
   */
  static toDropdownList(requests: Request[]) {
    return requests.map((request) => this.toDropdown(request))
  }

  /**
   * Transform Patient to dropdown format (camelCase)
   * Used in: create, edit views
   */
  static patientToDropdown(patient: any) {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
    }
  }

  /**
   * Transform User to dropdown format (camelCase)
   * Used in: create, edit views
   */
  static userToDropdown(user: any) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}
