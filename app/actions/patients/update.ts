import Patient from '#models/patient'

import { DateTime } from 'luxon'

export default class UpdatePatient {
  async handle(
    id: string,
    data: {
      firstName: string
      lastName: string
      dateOfBirth?: string | null
      gender?: string | null
      age: string
      phone?: string | null
      nationalIdType?: string
      nationalIdNumber?: string | null
      addressLine: string
      city: string
      postalCode?: string | null
      emergencyContactName: string
      emergencyContactPhone: string
      allergies?: string | null
    }
  ) {
    const patient = await Patient.findOrFail(id)
    const { dateOfBirth, ...rest } = data
    const updateData = {
      ...rest,
      dateOfBirth: dateOfBirth ? DateTime.fromISO(dateOfBirth) : null,
    }

    patient.merge(updateData)
    await patient.save()

    return patient
  }
}
