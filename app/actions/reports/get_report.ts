import Report from '#models/report'
import ReportDTO from '#dtos/report'

export default class GetReport {
  /**
   * Get single report for show view
   * Used in: ReportsController.show()
   */
  async handleForShow(id: string) {
    const report = await Report.query()
      .where('id', id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    return ReportDTO.toDetailedFrontend(report)
  }

  /**
   * Get single report for edit form
   * Used in: ReportsController.edit()
   */
  async handleForEdit(id: string) {
    const report = await Report.findOrFail(id)
    return ReportDTO.toEditForm(report)
  }
}
