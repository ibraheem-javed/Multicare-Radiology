import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class DeletePatient {
  async handle(ctx: HttpContext, id: string) {
    const patient = await Patient.findOrFail(id)

    const deletedData = patient.toJSON()

    await patient.delete()

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.PATIENT, id, deletedData)
    }

    return patient
  }
}
