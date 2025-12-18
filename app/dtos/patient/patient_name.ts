import type Patient from '#models/patient'

export function getPatientFullName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`
}
