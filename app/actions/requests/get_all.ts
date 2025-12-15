import Request from '#models/request'
import RequestDTO from '#dtos/request'

export default class GetAllRequests {
  async handle() {
    const requests = await Request.query()
      .preload('patient')
      .preload('requestedBy')
      .orderBy('id', 'desc')

    return RequestDTO.toFrontendList(requests)
  }
}
