import type Request from '#models/request'
import { getPatientFullName } from '#dtos/patient/patient_name'

export function toDropdown(request: Request) {
  return {
    id: request.id,
    patient: request.patient ? getPatientFullName(request.patient) : 'Unknown',
    procedure: request.procedureType,
  }
}

export function toDropdownList(requests: Request[]) {
  return requests.map(toDropdown)
}

export function patientToDropdown(patient: any) {
  return { id: patient.id, firstName: patient.firstName, lastName: patient.lastName }
}

export function userToDropdown(user: any) {
  return { id: user.id, firstName: user.firstName, lastName: user.lastName }
}

export function requesterToDropdown(requester: any) {
  return {
    id: requester.id,
    name: requester.name,
    additionalInformation: requester.additionalInformation,
  }
}
