import Request from '#models/request'

export default class DeleteRequest {
  /**
   * Delete a radiology request
   * Used in: RequestsController.destroy()
   *
   * Future: Can add logic for:
   * - Checking if request has associated reports
   * - Preventing deletion of completed requests
   * - Soft delete instead of hard delete
   * - Archiving request data
   * - Notifying relevant staff
   * - Canceling related appointments
   */
  async handle(id: string) {
    const request = await Request.findOrFail(id)

    // Future: Check for associated reports
    // const hasReports = await request.related('reports').query().first()
    // if (hasReports) {
    //   throw new Error('Cannot delete request with associated reports')
    // }

    await request.delete()

    // Future: Add notification logic here
    // await notifyRequestCancellation(request)

    return request
  }
}
