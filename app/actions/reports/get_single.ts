import Report from '#models/report'

export default class GetReport {
  async handleForShow(id: string): Promise<Report> {
    const report = await Report.query()
      .where('id', id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    return report
  }

  async handle(id: string): Promise<Report> {
    return Report.findOrFail(id)
  }
}
