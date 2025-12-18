import Patient from '#models/patient'

export default class GetAllPatients {
  async handle(): Promise<Patient[]> {
    return Patient.query().orderBy('first_name', 'asc')
  }
}
