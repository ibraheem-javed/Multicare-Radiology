import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class GetPatient {
  async handle(ctx: HttpContext, id: string): Promise<Patient> {
    const patient = await Patient.findOrFail(id)

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.PATIENT, patient.id)
    }

    return patient
  }
}
