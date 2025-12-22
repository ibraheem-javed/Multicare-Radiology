import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'
import type { HttpContext } from '@adonisjs/core/http'
import Requester from '#models/requester'

export default class UpdateRequest {
  async handle(
    ctx: HttpContext,
    id: string,
    data: {
      patientId?: string
      procedureType?: string
      requesterId?: string
      requesterName?: string
      requesterAdditionalInformation?: string | null
      requestDate?: Date | string
      status?: RequestStatus
    }
  ) {
    const request = await Request.findOrFail(id)
    const oldData = request.toJSON()

    let requesterId = data.requesterId

    if (!requesterId && data.requesterName) {
      const requester = await Requester.create({
        name: data.requesterName,
        additionalInformation: data.requesterAdditionalInformation ?? null,
      })

      requesterId = requester.id
    }

    request.merge({
      patientId: data.patientId,
      procedureType: data.procedureType,
      requesterId,
      status: data.status,
      requestDate: data.requestDate
        ? typeof data.requestDate === 'string'
          ? DateTime.fromISO(data.requestDate)
          : DateTime.fromJSDate(data.requestDate)
        : undefined,
    })

    await request.save()

    return request
  }
}
