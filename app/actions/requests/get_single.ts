import Request from '#models/request'
import RequestDTO from '#dtos/request'

export default class GetRequest {
  async handleForShow(id: string) {
    const request = await Request.query()
      .where('id', id)
      .preload('patient')
      .preload('requestedBy')
      .firstOrFail()

    return RequestDTO.toDetailedFrontend(request)
  }

  async handle(id: string) {
    const request = await Request.findOrFail(id)
    return RequestDTO.toEditForm(request)
  }
}
