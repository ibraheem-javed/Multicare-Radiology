import vine from '@vinejs/vine'

export const patientValidator = vine.compile(
  vine.object({
    // Basic information
    first_name: vine.string().trim().minLength(1),
    last_name: vine.string().trim().minLength(1),
    date_of_birth: vine.string().nullable().optional(),
    gender: vine.string().nullable().optional(),
    phone: vine.string().nullable().optional(),

    // Medical Record Number (auto-generated in action if not provided)
    medical_record_number: vine.string().trim().optional(),

    // National ID information
    national_id_type: vine
      .enum(['CNIC', 'Passport', 'Health Card', 'Driving License', 'Other'])
      .optional(),
    national_id_number: vine.string().trim().nullable().optional(),

    // Address information
    address_line: vine.string().trim().minLength(5),
    city: vine.string().trim().minLength(2),
    postal_code: vine.string().trim().nullable().optional(),

    // Emergency contact
    emergency_contact_name: vine.string().trim().minLength(2),
    emergency_contact_phone: vine.string().trim().minLength(10),

    // Medical information
    allergies: vine.string().trim().nullable().optional(),
  })
)
