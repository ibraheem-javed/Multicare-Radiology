import Patient from '#models/patient'

export default class UpdatePatient {
  /**
   * Update an existing patient record
   * Used in: PatientsController.update()
   *
   * Future: Can add logic for:
   * - Notifying patient of changes
   * - Logging updates for audit trail
   * - Validating changes against existing appointments
   */
  async handle(
    id: number,
    data: {
      first_name: string
      last_name: string
      date_of_birth?: string | null
      gender?: string | null
      phone?: string | null
    }
  ) {
    const patient = await Patient.findOrFail(id)
    patient.merge(data)
    await patient.save()

    // Future: Add notification logic here
    // await notifyPatientUpdate(patient)

    return patient
  }
}
