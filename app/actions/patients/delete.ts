import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class DeletePatient {
  /**
   * Delete a patient record
   * Used in: PatientsController.destroy()
   *
   * Includes audit logging for compliance
   */
  async handle(ctx: HttpContext, id: string) {
    const patient = await Patient.findOrFail(id)

    // Capture patient data before deletion for audit trail
    const deletedData = patient.toJSON()

    await patient.delete()

    // Log patient deletion for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.PATIENT, id, deletedData)
    }

    return patient
  }
}
