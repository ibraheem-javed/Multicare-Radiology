import Patient from '#models/patient'

export default class CreatePatient {
  /**
   * Create a new patient record
   * Used in: PatientsController.store()
   *
   * Future: Can add logic for:
   * - Sending welcome notifications
   * - Creating patient portal account
   * - Logging patient creation for audit
   */
  async handle(data: {
    first_name: string
    last_name: string
    date_of_birth?: string | null
    gender?: string | null
    phone?: string | null
  }) {
    const patient = await Patient.create(data)

    // Future: Add notification logic here
    // await sendWelcomeEmail(patient)

    return patient
  }
}
