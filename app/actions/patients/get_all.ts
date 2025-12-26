import Patient from '#models/patient'

export default class GetAllPatients {
  async handle(): Promise<Patient[]> {
    return Patient.query().orderBy('medical_record_number', 'desc')
  }
}
