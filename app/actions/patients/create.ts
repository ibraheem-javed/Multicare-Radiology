import Patient from '#models/patient'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class CreatePatient {
  /**
   * Create a new patient record
   * Used in: PatientsController.store()
   *
   * Generates unique Medical Record Number (MRN) in format: MRN-YYYYMMDD-####
   * Example: MRN-20250115-0001
   *
   * Now includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    data: {
    first_name: string
    last_name: string
    date_of_birth?: string | null
    gender?: string | null
    phone?: string | null
    medical_record_number?: string
    national_id_type?: string
    national_id_number?: string | null
    address_line: string
    city: string
    postal_code?: string | null
    emergency_contact_name: string
    emergency_contact_phone: string
    allergies?: string | null
  }) {
    // Generate unique Medical Record Number if not provided or empty
    if (!data.medical_record_number || data.medical_record_number.trim() === '') {
      data.medical_record_number = await this.generateMRN()
    }

    // Set default national_id_type to CNIC if not provided or empty
    if (!data.national_id_type || data.national_id_type.trim() === '') {
      data.national_id_type = 'CNIC'
    }

    const patient = await Patient.create(data)

    // Log patient creation for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(
        ctx.auth.user.id,
        EntityType.PATIENT,
        patient.id,
        patient.toJSON()
      )
    }

    // Future: Add notification logic here
    // await sendWelcomeEmail(patient)

    return patient
  }

  /**
   * Generate unique Medical Record Number
   * Format: MRN-YYYYMMDD-####
   * Example: MRN-20250115-0001
   */
  private async generateMRN(): Promise<string> {
    const today = DateTime.now().toFormat('yyyyMMdd')
    const prefix = `MRN-${today}-`

    // Get count of patients created today
    const count = await Patient.query()
      .where('medical_record_number', 'like', `${prefix}%`)
      .count('* as total')

    const total = count[0]?.$extras?.total || 0
    const nextNumber = (Number(total) + 1).toString().padStart(4, '0')

    return `${prefix}${nextNumber}`
  }
}
