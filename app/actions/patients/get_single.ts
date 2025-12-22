import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'

export default class GetPatient {
  async handle(ctx: HttpContext, id: string): Promise<Patient> {
    const patient = await Patient.findOrFail(id)

    return patient
  }
}
