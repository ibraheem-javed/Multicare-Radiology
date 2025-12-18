import vine from '@vinejs/vine'
import { RequestStatus } from '#enums/request_status'

export const requestValidator = vine.compile(
  vine.object({
    patientId: vine.string().uuid(),
    procedureType: vine.string().trim().minLength(1),
    requesterId: vine.string().uuid().optional(), // optional
    requesterName: vine.string().trim().minLength(1).optional(), // optional
    requesterAdditionalInformation: vine.string().trim().optional().nullable(),
    requestDate: vine.date(),
    status: vine
      .enum(Object.values(RequestStatus))
      .optional()
      .nullable()
      .transform((val) => val ?? RequestStatus.PENDING),
  })
)
