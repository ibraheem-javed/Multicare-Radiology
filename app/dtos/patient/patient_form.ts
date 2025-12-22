import type Patient from '#models/patient'

export type PatientForm = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string | null
  age: string
  phone: string | null
  medicalRecordNumber: string
  nationalIdType: string | null
  nationalIdNumber: string | null
  addressLine: string
  city: string
  postalCode: string | null
  emergencyContactName: string
  emergencyContactPhone: string
  allergies: string | null
}

export function toPatientForm(patient: Patient): PatientForm {
  return {
    id: patient.id,
    firstName: patient.firstName ?? '',
    lastName: patient.lastName ?? '',
    dateOfBirth: patient.dateOfBirth?.toISODate() ?? '',
    gender: patient.gender ?? '',
    age: patient.age ?? '',
    phone: patient.phone ?? '',
    medicalRecordNumber: patient.medicalRecordNumber ?? '',
    nationalIdType: patient.nationalIdType ?? '',
    nationalIdNumber: patient.nationalIdNumber ?? '',
    addressLine: patient.addressLine ?? '',
    city: patient.city ?? '',
    postalCode: patient.postalCode ?? '',
    emergencyContactName: patient.emergencyContactName ?? '',
    emergencyContactPhone: patient.emergencyContactPhone ?? '',
    allergies: patient.allergies ?? '',
  }
}
