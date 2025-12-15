import Report from '#models/report'
import ReportDTO from '#dtos/report'

export default class GetReport {
  async handleForShow(id: string) {
    const report = await Report.query()
      .where('id', id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    return ReportDTO.toDetailedFrontend(report)
  }

  async handle(id: string) {
    const report = await Report.findOrFail(id)
    return ReportDTO.toEditForm(report)
  }
}
