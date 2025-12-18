import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class UpdateRequest {
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      patientId?: string
      procedureType?: string
      requesterId?: string
      requesterAdditionalInformation?: string | null
      requestDate?: Date | string
      status?: RequestStatus
    }
  ) {
    const request = await Request.findOrFail(id)
    const oldData = request.toJSON()

    const requestUpdateData = {
      patientId: data.patientId,
      procedureType: data.procedureType,
      requesterId: data.requesterId,
      status: data.status,
      requestDate: data.requestDate
        ? typeof data.requestDate === 'string'
          ? DateTime.fromISO(data.requestDate)
          : DateTime.fromJSDate(data.requestDate)
        : undefined,
    }

    request.merge(requestUpdateData)
    await request.save()

    if (data.requesterAdditionalInformation && data.requesterId) {
      const requester = await request.related('requester').query().first()

      if (requester) {
        requester.additionalInformation = data.requesterAdditionalInformation
        await requester.save()
      }
    }

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
