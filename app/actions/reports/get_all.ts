import Report from '#models/report'

export default class GetAllReports {
  async handle(): Promise<Report[]> {
    return Report.query()
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .orderBy('created_at', 'desc')
  }
}
