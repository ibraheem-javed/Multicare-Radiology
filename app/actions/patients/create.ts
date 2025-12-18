import Patient from '#models/patient'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class CreatePatient {
  async handle(
    ctx: HttpContext,
    data: {
      firstName: string
      lastName: string
      dateOfBirth?: string | null
      gender?: string | null
      age: string
      phone?: string | null
      medicalRecordNumber?: string
      nationalIdType?: string
      nationalIdNumber?: string | null
      addressLine: string
      city: string
      postalCode?: string | null
      emergencyContactName: string
      emergencyContactPhone: string
      allergies?: string | null
    }
  ) {
    if (!data.medicalRecordNumber || data.medicalRecordNumber.trim() === '') {
      data.medicalRecordNumber = await this.generateMRN()
    }

    if (!data.nationalIdType || data.nationalIdType.trim() === '') {
      data.nationalIdType = 'CNIC'
    }

    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth ? DateTime.fromISO(data.dateOfBirth) : null,
    }

    const patient = await Patient.create(payload)

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(ctx.auth.user.id, EntityType.PATIENT, patient.id, patient.toJSON())
    }

    return patient
  }

  private async generateMRN(): Promise<string> {
    const today = DateTime.now().toFormat('yyyyMMdd')
    const prefix = `MRN-${today}-`

    const count = await Patient.query()
      .where('medical_record_number', 'like', `${prefix}%`)
      .count('* as total')

    const total = count[0]?.$extras?.total || 0
    const nextNumber = (Number(total) + 1).toString().padStart(4, '0')

    return `${prefix}${nextNumber}`
  }
}
