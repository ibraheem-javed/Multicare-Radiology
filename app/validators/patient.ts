import vine from '@vinejs/vine'

export const patientValidator = vine.compile(
  vine.object({
    first_name: vine.string().trim().minLength(1),
    last_name: vine.string().trim().minLength(1),
    date_of_birth: vine.string().nullable().optional(),
    gender: vine.string().nullable().optional(),
    phone: vine.string().nullable().optional(),
  })
)
