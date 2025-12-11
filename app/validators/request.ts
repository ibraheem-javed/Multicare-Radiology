import vine from '@vinejs/vine'

export const requestValidator = vine.compile(
  vine.object({
    patient_id: vine.string().uuid(), // required by default
    procedure_type: vine.string().trim().minLength(1), // required
    requested_by: vine.string().uuid(), // required
    request_date: vine.date(), // required by default
    status: vine
      .enum(['pending', 'completed'])
      .optional()
      .nullable()
      .transform((val) => val ?? 'pending'),
  })
)
