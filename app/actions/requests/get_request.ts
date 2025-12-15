import Request from '#models/request'
import RequestDTO from '#dtos/request'

export default class GetRequest {
  /**
   * Get single request by ID with patient and requestedBy relationships
   * Used in: RequestsController.show()
   */
  async handleForShow(id: string) {
    const request = await Request.query()
      .where('id', id)
      .preload('patient')
      .preload('requestedBy')
      .firstOrFail()

    return RequestDTO.toDetailedFrontend(request)
  }

  /**
   * Get single request for edit form
   * Used in: RequestsController.edit()
   */
  async handleForEdit(id: string) {
    const request = await Request.findOrFail(id)
    return RequestDTO.toEditForm(request)
  }
}
