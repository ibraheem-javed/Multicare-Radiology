import Request from '#models/request'

export default class GetRequest {
  async handleForShow(id: string): Promise<Request> {
    const request = await Request.query()
      .where('id', id)
      .preload('patient')
      .preload('requester')
      .firstOrFail()

    return request
  }

  async handle(id: string): Promise<Request> {
    return Request.query().where('id', id).preload('patient').preload('requester').firstOrFail()
  }
}
