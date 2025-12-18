import Request from '#models/request'

export default class GetAllRequests {
  async handle(): Promise<Request[]> {
    return Request.query().preload('patient').preload('requester').orderBy('id', 'desc')
  }
}
