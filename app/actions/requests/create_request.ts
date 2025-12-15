import Request, { RequestStatus } from '#models/request'
import { DateTime } from 'luxon'

export default class CreateRequest {
  /**
   * Create a new radiology request
   * Used in: RequestsController.store()
   *
   * Future: Can add logic for:
   * - Notifying radiologists about new request
   * - Checking radiologist availability
   * - Sending confirmation to patient
   * - Creating calendar appointments
   * - Validating procedure type against patient history
   */
  async handle(data: {
    patient_id: string
    procedure_type: string
    requested_by: string
    request_date: Date
    status: RequestStatus
  }) {
    const request = await Request.create({
      patientId: data.patient_id,
      procedureType: data.procedure_type,
      requestedById: data.requested_by,
      requestDate: DateTime.fromJSDate(data.request_date),
      status: data.status,
    })

    // Future: Add notification logic here
    // await notifyRadiologists(request)
    // await sendPatientConfirmation(request)

    return request
  }
}
