import Request from '#models/request'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class GetRequest {
  async handleForShow(ctx: HttpContext, id: string): Promise<Request> {
    const request = await Request.query()
      .where('id', id)
      .preload('patient')
      .preload('requester')
      .firstOrFail()

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.REQUEST, request.id)
    }

    return request
  }

  async handle(id: string): Promise<Request> {
    return Request.query().where('id', id).preload('patient').preload('requester').firstOrFail()
  }
}
