import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'

export default class CreateRequest {
  async handle(data: {
    patient_id: string
    procedure_type: string
    requested_by: string
    request_date: Date
    status: RequestStatus
  }) {
    const {
      patient_id: patientId,
      procedure_type: procedureType,
      requested_by: requestedBy,
      request_date: requestDate,
      status,
    } = data

    const request = await Request.create({
      patientId,
      procedureType,
      requestedById: requestedBy,
      requestDate: DateTime.fromJSDate(requestDate),
      status,
    })
    return request
  }
}
