import Request from '#models/request'
import User from '#models/user'
import RequestDTO from '#dtos/request'
import ReportDTO from '#dtos/report'

export default class GetDataForCreate {
  async handle() {
    const requests = await Request.query().preload('patient').orderBy('id', 'desc')
    const users = await User.query().orderBy('firstName', 'asc')

    return {
      requests: RequestDTO.toDropdownList(requests),
      radiologists: ReportDTO.radiologistsToDropdownList(users),
    }
  }
}
