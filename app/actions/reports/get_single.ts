import Report from '#models/report'
import type { HttpContext } from '@adonisjs/core/http'

export default class GetReport {
  async handleForShow(ctx: HttpContext, id: string): Promise<Report> {
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
