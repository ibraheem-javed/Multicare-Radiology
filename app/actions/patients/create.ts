import Patient from '#models/patient'

export default class CreatePatient {
  async handle(data: {
    first_name: string
    last_name: string
    date_of_birth?: string | null
    gender?: string | null
    phone?: string | null
  }) {
    const patient = await Patient.create(data)

    return patient
  }
}
