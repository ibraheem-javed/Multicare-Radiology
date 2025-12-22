import type Request from '#models/request'

export type RequestForm = {
  id: string
  procedureType: string
  requestDate: string
  status: string
  patientId: string
  requesterId?: string
  requesterName?: string
  requesterAdditionalInformation?: string
}

export function toRequestForm(request: Request): RequestForm {
  return {
    id: request.id,
    procedureType: request.procedureType,
    requestDate: request.requestDate?.toISODate() ?? '',
    status: request.status,
    patientId: request.patientId,
    requesterId: request.requesterId,
    requesterName: request.requester?.name ?? '',
    requesterAdditionalInformation: request.requester?.additionalInformation ?? '',
  }
}
