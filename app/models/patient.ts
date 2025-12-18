import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'first_name' })
  declare firstName: string

  @column({ columnName: 'last_name' })
  declare lastName: string

  @column.date({ columnName: 'date_of_birth' })
  declare dateOfBirth: DateTime | null

  @column()
  declare gender: string | null

  @column()
  declare age: string

  @column()
  declare phone: string | null

  @column({ columnName: 'medical_record_number' })
  declare medicalRecordNumber: string

  @column({ columnName: 'national_id_type' })
  declare nationalIdType: string

  @column({ columnName: 'national_id_number' })
  declare nationalIdNumber: string | null

  @column({ columnName: 'address_line' })
  declare addressLine: string

  @column()
  declare city: string

  @column({ columnName: 'postal_code' })
  declare postalCode: string | null

  @column({ columnName: 'emergency_contact_name' })
  declare emergencyContactName: string

  @column({ columnName: 'emergency_contact_phone' })
  declare emergencyContactPhone: string

  @column()
  declare allergies: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
