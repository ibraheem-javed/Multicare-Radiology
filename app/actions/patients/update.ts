import Patient from '#models/patient'

export default class UpdatePatient {
  async handle(
    id: number,
    data: {
      first_name: string
      last_name: string
      date_of_birth?: string | null
      gender?: string | null
      phone?: string | null
    }
  ) {
    const patient = await Patient.findOrFail(id)
    patient.merge(data)
    await patient.save()
    return patient
  }
}
