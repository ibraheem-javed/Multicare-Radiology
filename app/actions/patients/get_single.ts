import Patient from '#models/patient'
import PatientDTO from '#dtos/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log_action'
import { EntityType } from '#models/audit_log'

export default class GetPatient {
  /**
   * Get a single patient record
   * Used in: PatientsController.show()
   *
   * Logs patient access for compliance
   */
  async handle(ctx: HttpContext, id: string) {
    const patient = await Patient.findOrFail(id)

    // Log patient access for audit trail (compliance requirement)
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.PATIENT, patient.id)
    }

    return PatientDTO.toFrontend(patient)
  }
}
