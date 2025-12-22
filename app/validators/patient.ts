import vine from '@vinejs/vine'

export const patientValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
    dateOfBirth: vine.string().nullable().optional(),
    gender: vine.string().nullable().optional(),
    age: vine.string().minLength(1),
    phone: vine.string().nullable().optional(),
    medicalRecordNumber: vine.string().trim().optional(),
    nationalIdType: vine
      .enum(['CNIC', 'Passport', 'Health Card', 'Driving License', 'Other'])
      .optional(),
    nationalIdNumber: vine.string().trim().nullable().optional(),
    addressLine: vine.string().trim().minLength(5),
    city: vine.string().trim().minLength(2),
    postalCode: vine.string().trim().nullable().optional(),
    emergencyContactName: vine.string().trim().minLength(2),
    emergencyContactPhone: vine.string().trim().minLength(10),
    allergies: vine.string().trim().nullable().optional(),
  })
)
