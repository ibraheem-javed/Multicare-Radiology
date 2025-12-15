import Patient from '#models/patient'

export default class DeletePatient {
  /**
   * Delete a patient record
   * Used in: PatientsController.destroy()
   *
   * Future: Can add logic for:
   * - Checking for active appointments/requests
   * - Soft delete instead of hard delete
   * - Archiving patient data
   * - Notifying relevant staff
   */
  async handle(id: number) {
    const patient = await Patient.findOrFail(id)

    // Future: Check for dependencies
    // const hasActiveRequests = await patient.related('requests').query().where('status', '!=', 'completed').first()
    // if (hasActiveRequests) {
    //   throw new Error('Cannot delete patient with active requests')
    // }

    await patient.delete()

    // Future: Add archiving logic here
    // await archivePatientData(patient)

    return patient
  }
}
