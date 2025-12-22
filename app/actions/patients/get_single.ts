import Patient from '#models/patient'

export default class GetPatient {
  async handle(id: string): Promise<Patient> {
    const patient = await Patient.findOrFail(id)

    return patient
  }
}
