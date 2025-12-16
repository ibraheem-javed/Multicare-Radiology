import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log_action'
import { EntityType } from '#models/audit_log'

export default class UpdatePatient {
  /**
   * Update an existing patient record
   * Used in: PatientsController.update()
   *
   * Note: medical_record_number is immutable and cannot be changed after creation
   *
   * Now includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      first_name: string
      last_name: string
      date_of_birth?: string | null
      gender?: string | null
      phone?: string | null
      national_id_type?: string
      national_id_number?: string | null
      address_line: string
      city: string
      postal_code?: string | null
      emergency_contact_name: string
      emergency_contact_phone: string
      allergies?: string | null
    }
  ) {
    const patient = await Patient.findOrFail(id)

    // Capture old data for audit trail
    const oldData = patient.toJSON()

    // Remove medical_record_number if it exists in data (immutable field)
    const { ...updateData } = data

    patient.merge(updateData)
    await patient.save()

    // Log patient update for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logUpdated(
        ctx.auth.user.id,
        EntityType.PATIENT,
        patient.id,
        oldData,
        patient.toJSON()
      )
    }

    return patient
  }
}
