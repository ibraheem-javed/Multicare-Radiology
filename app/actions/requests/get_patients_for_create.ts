import Patient from '#models/patient'
import User from '#models/user'
import RequestDTO from '#dtos/request'

export default class GetPatientsForCreate {
  /**
   * Get all patients and users for dropdown in create/edit forms
   * Used in: RequestsController.create(), RequestsController.edit()
   */
  async handle() {
    const patients = await Patient.query().orderBy('first_name', 'asc')
    const users = await User.query().orderBy('firstName', 'asc')

    return {
      patients: patients.map((p) => RequestDTO.patientToDropdown(p)),
      users: users.map((u) => RequestDTO.userToDropdown(u)),
    }
  }
}
