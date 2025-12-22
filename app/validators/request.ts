import vine from '@vinejs/vine'
import { RequestStatus } from '#enums/request_status'

export const requestValidator = vine.compile(
  vine.object({
    patientId: vine.string().uuid(),
    procedureType: vine.string().trim().minLength(1),
    requesterId: vine.string().uuid().optional(),
    requesterName: vine.string().trim().minLength(1).optional(),
    requesterAdditionalInformation: vine.string().trim().optional().nullable(),
    requestDate: vine.date(),
    status: vine
      .enum(Object.values(RequestStatus))
      .optional()
      .nullable()
      .transform((val) => val ?? RequestStatus.PENDING),
  })
)

// Validator when requesterId is provided
export const requestWithRequesterIdValidator = vine.compile(
  vine.object({
    patientId: vine.string().uuid(),
    procedureType: vine.string().trim().minLength(1),
    requesterId: vine.string().uuid(),
    requesterName: vine.string().trim().optional(), // ignored if requesterId exists
    requesterAdditionalInformation: vine.string().trim().optional().nullable(),
    requestDate: vine.date(),
    status: vine
      .enum(Object.values(RequestStatus))
      .optional()
      .nullable()
      .transform((val) => val ?? RequestStatus.PENDING),
  })
)

// Validator when requesterName is provided
export const requestWithRequesterNameValidator = vine.compile(
  vine.object({
    patientId: vine.string().uuid(),
    procedureType: vine.string().trim().minLength(1),
    requesterId: vine.string().uuid().optional(), // ignored if requesterName exists
    requesterName: vine.string().trim().minLength(1),
    requesterAdditionalInformation: vine.string().trim().optional().nullable(),
    requestDate: vine.date(),
    status: vine
      .enum(Object.values(RequestStatus))
      .optional()
      .nullable()
      .transform((val) => val ?? RequestStatus.PENDING),
  })
)
