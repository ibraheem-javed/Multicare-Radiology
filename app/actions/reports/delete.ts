import Report from '#models/report'
import type { HttpContext } from '@adonisjs/core/http'

export default class DeleteReport {
  async handle(ctx: HttpContext, id: string) {
    const report = await Report.findOrFail(id)

    await report.delete()

    return report
  }
}
