import Request from '#models/request'
import RequestDTO from '#dtos/request'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log_action'
import { EntityType } from '#models/audit_log'

export default class GetRequest {
  /**
   * Get a single request with full details for display
   * Used in: RequestsController.show()
   *
   * Logs request access for compliance
   */
  async handleForShow(ctx: HttpContext, id: string) {
    const request = await Request.query()
      .where('id', id)
      .preload('patient')
      .preload('requestedBy')
      .firstOrFail()

    // Log request access for audit trail (compliance requirement)
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logAccessed(ctx.auth.user.id, EntityType.REQUEST, request.id)
    }

    return RequestDTO.toDetailedFrontend(request)
  }

  /**
   * Get a single request for editing
   * Used in: RequestsController.edit()
   */
  async handle(id: string) {
    const request = await Request.findOrFail(id)
    return RequestDTO.toEditForm(request)
  }
}
