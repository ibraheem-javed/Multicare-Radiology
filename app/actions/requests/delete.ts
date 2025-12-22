import Request from '#models/request'
import type { HttpContext } from '@adonisjs/core/http'

export default class DeleteRequest {
  async handle(ctx: HttpContext, id: string) {
    const request = await Request.findOrFail(id)

    await request.delete()

    return request
  }
}
