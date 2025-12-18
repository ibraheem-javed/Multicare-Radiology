import Request from '#models/request'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log'
import { EntityType } from '#enums/entity_type'

export default class DeleteRequest {
  async handle(ctx: HttpContext, id: string) {
    const request = await Request.findOrFail(id)

    const deletedData = request.toJSON()

    await request.delete()

    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.REQUEST, id, deletedData)
    }

    return request
  }
}
