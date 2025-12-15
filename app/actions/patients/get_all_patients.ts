import Patient from '#models/patient'
import PatientDTO from '#dtos/patient'

export default class GetAllPatients {
  /**
   * Get all patients ordered by first name
   * Used in: PatientsController.index()
   */
  async handle() {
    const patients = await Patient.query().orderBy('first_name', 'asc')
    return PatientDTO.toFrontendList(patients)
  }
}
