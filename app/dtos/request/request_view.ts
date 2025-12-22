import type Request from '#models/request'
import { toPatientMinimal } from '#dtos/patient/patient_minimal'
import { DateTime } from 'luxon'

function formatDate(value: string | DateTime | null): string | null {
  if (!value) return null
  const date = value instanceof DateTime ? value : DateTime.fromISO(value)
  return date.isValid ? date.toFormat('MMM dd, yyyy') : null
}

export function toRequestView(request: Request) {
  return {
    id: request.id,
    procedureType: request.procedureType,
    requestDate: formatDate(request.requestDate),
    status: request.status,
    patient: request.patient ? toPatientMinimal(request.patient) : null,
    requester: request.requester
      ? {
          id: request.requester.id,
          name: request.requester.name,
          additionalInformation: request.requester.additionalInformation,
        }
      : null,
  }
}

export function toRequestViewList(requests: Request[]) {
  return requests.map(toRequestView)
}
