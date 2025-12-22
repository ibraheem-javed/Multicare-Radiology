import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'

export default class DeletePatient {
  async handle(ctx: HttpContext, id: string) {
    const patient = await Patient.findOrFail(id)

    await patient.delete()

    return patient
  }
}
