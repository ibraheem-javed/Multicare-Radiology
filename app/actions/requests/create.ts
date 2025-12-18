import Request from '#models/request'
import Requester from '#models/requester'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class CreateRequest {
  async handle(
    ctx: HttpContext,
    data: {
      patientId: string
      procedureType: string
      requesterId?: string
      requesterName?: string
      requesterAdditionalInformation?: string | null
      requestDate: string | Date
      status: RequestStatus
    }
  ) {
    let requesterId: string

    if (data.requesterId) {
      requesterId = data.requesterId
    } else if (data.requesterName) {
      let requester = await Requester.query().where('name', data.requesterName).first()

      if (!requester) {
        requester = await Requester.create({
          name: data.requesterName,
          additionalInformation: data.requesterAdditionalInformation ?? null,
        })
      } else if (data.requesterAdditionalInformation) {
        requester.additionalInformation = data.requesterAdditionalInformation
        await requester.save()
      }

      requesterId = requester.id
    } else {
      throw new Error('Requester name or id must be provided')
    }

    const request = await Request.create({
      patientId: data.patientId,
      procedureType: data.procedureType,
      requesterId,
      requestDate:
        typeof data.requestDate === 'string'
          ? DateTime.fromISO(data.requestDate)
          : DateTime.fromJSDate(data.requestDate),
      status: data.status,
    })

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logCreated(ctx.auth.user.id, EntityType.REQUEST, request.id, request.toJSON())
    }

    return request
  }
}
