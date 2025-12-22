import Report from '#models/report'

export default class DeleteReport {
  async handle(id: string) {
    const report = await Report.findOrFail(id)

    await report.delete()

    return report
  }
}
