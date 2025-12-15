import Patient from '#models/patient'
import PatientDTO from '#dtos/patient'

export default class GetPatient {
  async handle(id: number) {
    const patient = await Patient.findOrFail(id)
    return PatientDTO.toFrontend(patient)
  }
}
