import Patient from '#models/patient'

export default class DeletePatient {
  async handle(id: number) {
    const patient = await Patient.findOrFail(id)
    await patient.delete()
    return patient
  }
}
