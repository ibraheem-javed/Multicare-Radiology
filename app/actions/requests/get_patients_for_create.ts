import Patient from '#models/patient'
import User from '#models/user'
import RequestDTO from '#dtos/request'

export default class GetPatientsForCreate {
  async handle() {
    const patients = await Patient.query().orderBy('firstName', 'asc')
    const users = await User.query().orderBy('firstName', 'asc')

    return {
      patients: patients.map((p) => RequestDTO.patientToDropdown(p)),
      users: users.map((u) => RequestDTO.userToDropdown(u)),
    }
  }
}
