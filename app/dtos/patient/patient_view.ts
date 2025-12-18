import type Patient from '#models/patient'
import { DateTime } from 'luxon'

export type PatientView = {
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

function formatDate(value: DateTime | null): string | null {
  return value ? value.toFormat('MMM dd, yyyy') : null
}

export function toPatientView(patient: Patient): PatientView {
  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: formatDate(patient.dateOfBirth),
    gender: patient.gender,
    age: patient.age,
    phone: patient.phone,
    medicalRecordNumber: patient.medicalRecordNumber,
    nationalIdType: patient.nationalIdType,
    nationalIdNumber: patient.nationalIdNumber,
    addressLine: patient.addressLine,
    city: patient.city,
    postalCode: patient.postalCode,
    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,
    allergies: patient.allergies,
  }
}
