import Patient from '#models/patient'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'
import { DateTime } from 'luxon'

export default class UpdatePatient {
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      firstName: string
      lastName: string
      dateOfBirth?: string | null
      gender?: string | null
      age: string
      phone?: string | null
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
    const patient = await Patient.findOrFail(id)
    const oldData = patient.toJSON()
    const { dateOfBirth, ...rest } = data
    const updateData = {
      ...rest,
      dateOfBirth: dateOfBirth ? DateTime.fromISO(dateOfBirth) : null,
    }

    patient.merge(updateData)
    await patient.save()

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
