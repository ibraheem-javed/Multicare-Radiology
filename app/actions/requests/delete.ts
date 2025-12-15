import Request from '#models/request'

export default class DeleteRequest {
  async handle(id: string) {
    const request = await Request.findOrFail(id)
    await request.delete()

    return request
  }
}
