import type Request from '#models/request'
import PatientDTO from '#dtos/patient'

export default class RequestDTO {
  /**
   * Transform Request model to frontend format (camelCase)
   * Database uses snake_case, frontend uses camelCase
   * Used in: index view
   */
  static toFrontend(request: Request) {
    return {
      id: request.id,
      procedureType: request.procedureType,
      requestDate: request.requestDate.toISODate(),
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
      requestDate: request.requestDate.toISODate(),
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
   * Transform Request model for edit form
   * Note: Form fields use snake_case to match validator
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
      firstName: patient.first_name,
      lastName: patient.last_name,
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
