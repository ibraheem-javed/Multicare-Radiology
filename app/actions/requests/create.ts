import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#models/audit_log'

export default class CreateRequest {
  /**
   * Create a new radiology request
   * Used in: RequestsController.store()
   *
   * Includes audit logging for compliance
   */
  async handle(
    ctx: HttpContext,
    data: {
    patient_id: string
    procedure_type: string
    requested_by: string
    request_date: Date
    status: RequestStatus
  }) {
    const {
      patient_id: patientId,
      procedure_type: procedureType,
      requested_by: requestedBy,
      request_date: requestDate,
      status,
    } = data

    const request = await Request.create({
      patientId,
      procedureType,
      requestedById: requestedBy,
      requestDate: DateTime.fromJSDate(requestDate),
      status,
    })

    // Log request creation for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(
        ctx.auth.user.id,
        EntityType.REQUEST,
        request.id,
        request.toJSON()
      )
    }

    return request
  }
}
