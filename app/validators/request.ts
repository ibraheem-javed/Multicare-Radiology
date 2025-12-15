import vine from '@vinejs/vine'
import { RequestStatus } from '#enums/request_status'

export const requestValidator = vine.compile(
  vine.object({
    patient_id: vine.string().uuid(),
    procedure_type: vine.string().trim().minLength(1),
    requested_by: vine.string().uuid(),
    request_date: vine.date(),
    status: vine
      .enum(Object.values(RequestStatus)) // Use enum values
      .optional()
      .nullable()
      .transform((val) => val ?? RequestStatus.PENDING), // default to PENDING
  })
)
