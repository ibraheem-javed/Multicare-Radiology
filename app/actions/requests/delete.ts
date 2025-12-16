import Request from '#models/request'
import type { HttpContext } from '@adonisjs/core/http'
import LogAction from '#actions/audit/log_action'
import { EntityType } from '#models/audit_log'

export default class DeleteRequest {
  /**
   * Delete a radiology request
   * Used in: RequestsController.destroy()
   *
   * Includes audit logging for compliance
   */
  async handle(ctx: HttpContext, id: string) {
    const request = await Request.findOrFail(id)

    // Capture request data before deletion for audit trail
    const deletedData = request.toJSON()

    await request.delete()

    // Log request deletion for audit trail
    if (ctx.auth.user) {
      const logAction = new LogAction(ctx)
      await logAction.logDeleted(ctx.auth.user.id, EntityType.REQUEST, id, deletedData)
    }

    return request
  }
}
