import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class UpdateRequest {
  /**
   * Update an existing radiology request
   * Used in: RequestsController.update()
   *
   * Includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      patient_id?: string
      procedure_type?: string
      requested_by?: string
      request_date?: Date
      status?: RequestStatus
    }
  ) {
    const request = await Request.findOrFail(id)

    // Capture old data for audit trail
    const oldData = request.toJSON()

    // Map snake_case to camelCase for Lucid
    const updateData: Partial<Record<string, unknown>> = {}
    if (data.patient_id) updateData.patientId = data.patient_id
    if (data.procedure_type) updateData.procedureType = data.procedure_type
    if (data.requested_by) updateData.requestedById = data.requested_by
    if (data.request_date) updateData.requestDate = DateTime.fromJSDate(data.request_date)
    if (data.status) updateData.status = data.status

    request.merge(updateData)
    await request.save()

    // Log request update for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logUpdated(
        ctx.auth.user.id,
        EntityType.REQUEST,
        request.id,
        oldData,
        request.toJSON()
      )
    }

    return request
  }
}
