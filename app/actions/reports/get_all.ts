import Report from '#models/report'
import ReportDTO from '#dtos/report'

export default class GetAllReports {
  async handle() {
    const reports = await Report.query()
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .orderBy('created_at', 'desc')

    return ReportDTO.toFrontendList(reports)
  }
}
