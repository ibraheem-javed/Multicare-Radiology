import Request, { RequestStatus } from '#models/request'
import { DateTime } from 'luxon'

export default class UpdateRequest {
  /**
   * Update an existing radiology request
   * Used in: RequestsController.update()
   *
   * Future: Can add logic for:
   * - Detecting status changes and sending notifications
   * - Validating status transitions (pending -> completed)
   * - Logging changes for audit trail
   * - Updating related calendar appointments
   * - Notifying patient of changes
   */
  async handle(
    id: string,
    data: {
      patient_id?: string
      procedure_type?: string
      requested_by?: string
      request_date?: Date
      status?: RequestStatus
    }
  ) {
    const request = await Request.findOrFail(id)

    // Future: Detect status change
    // const oldStatus = request.status
    // const newStatus = data.status

    // Map snake_case to camelCase for Lucid
    const updateData: any = {}
    if (data.patient_id) updateData.patientId = data.patient_id
    if (data.procedure_type) updateData.procedureType = data.procedure_type
    if (data.requested_by) updateData.requestedById = data.requested_by
    if (data.request_date) updateData.requestDate = DateTime.fromJSDate(data.request_date)
    if (data.status) updateData.status = data.status

    request.merge(updateData)
    await request.save()

    // Future: Add notification logic based on status change
    // if (oldStatus !== newStatus) {
    //   await notifyStatusChange(request, oldStatus, newStatus)
    // }

    return request
  }
}
