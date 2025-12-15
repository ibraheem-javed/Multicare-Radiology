import Report from '#models/report'

export default class DeleteReport {
  /**
   * Delete a radiology report
   * Used in: ReportsController.destroy()
   *
   * Future: Can add logic for:
   * - Requiring supervisor approval for deletion
   * - Preventing deletion of finalized reports
   * - Soft delete with retention period for compliance
   * - Archiving report data before deletion
   * - Notifying relevant parties
   * - Updating request status back to pending
   * - Audit logging for compliance
   */
  async handle(id: string) {
    const report = await Report.findOrFail(id)

    // Future: Add validation
    // if (report.status === 'finalized') {
    //   throw new Error('Cannot delete finalized reports. Please contact supervisor.')
    // }

    await report.delete()

    // Future: Update related request status
    // const request = await Request.find(report.requestId)
    // if (request) {
    //   request.status = 'pending'
    //   await request.save()
    // }

    // Future: Add notification and audit logging
    // await logReportDeletion(report)
    // await notifyReportDeletion(report)

    return report
  }
}
