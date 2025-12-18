import type Patient from '#models/patient'

export type PatientMinimal = {
  id: string
  firstName: string
  lastName: string
}

export function toPatientMinimal(patient: Patient): PatientMinimal {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
  }
}
