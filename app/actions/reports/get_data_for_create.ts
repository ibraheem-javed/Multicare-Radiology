import Request from '#models/request'
import User from '#models/user'

export default class GetDataForCreate {
  async handle() {
    const requests = await Request.query().preload('patient').orderBy('id', 'desc')

    const radiologists = await User.query().orderBy('firstName', 'asc')

    return { requests, radiologists }
  }
}
