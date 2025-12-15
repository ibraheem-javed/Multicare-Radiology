import Request from '#models/request'
import { RequestStatus } from '#enums/request_status'
import { DateTime } from 'luxon'

export default class UpdateRequest {
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

    // Map snake_case to camelCase for Lucid
    const updateData: Partial<Record<string, unknown>> = {}
    if (data.patient_id) updateData.patientId = data.patient_id
    if (data.procedure_type) updateData.procedureType = data.procedure_type
    if (data.requested_by) updateData.requestedById = data.requested_by
    if (data.request_date) updateData.requestDate = DateTime.fromJSDate(data.request_date)
    if (data.status) updateData.status = data.status

    request.merge(updateData)
    await request.save()

    return request
  }
}
