<<<<<<< Updated upstream
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

export function toPatientRequests(requests: Request[]) {
  const map: Record<string, any> = {}

  requests.forEach((req) => {
    if (!req.patient) return

    const pid = req.patient.id
    if (!map[pid]) {
      map[pid] = {
        id: req.patient.id,
        firstName: req.patient.firstName,
        lastName: req.patient.lastName,
        pendingRequests: [],
      }
    }

    if (req.status === 'pending') {
      map[pid].pendingRequests.push({
        id: req.id,
        procedure: req.procedureType,
      })
    }
  })

  return Object.values(map)
}
=======
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
>>>>>>> Stashed changes
