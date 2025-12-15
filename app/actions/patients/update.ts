import Patient from '#models/patient'

export default class UpdatePatient {
  /**
   * Update an existing patient record
   * Used in: PatientsController.update()
   *
   * Note: medical_record_number is immutable and cannot be changed after creation
   *
   * Future: Can add logic for:
   * - Notifying patient of changes
   * - Logging updates for audit trail
   * - Validating changes against existing appointments
   */
  async handle(
    id: string,
    data: {
      first_name: string
      last_name: string
      date_of_birth?: string | null
      gender?: string | null
      phone?: string | null
      national_id_type?: string
      national_id_number?: string | null
      address_line: string
      city: string
      postal_code?: string | null
      emergency_contact_name: string
      emergency_contact_phone: string
      allergies?: string | null
    }
  ) {
    const patient = await Patient.findOrFail(id)

    // Remove medical_record_number if it exists in data (immutable field)
    const { ...updateData } = data

    patient.merge(updateData)
    await patient.save()
    return patient
  }
}
