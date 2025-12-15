import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Basic Information
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.date('date_of_birth').nullable()
      table.string('gender').nullable()
      table.string('phone').nullable()

      // Unique patient identifier (Compliance: Medical Record Number)
      table.string('medical_record_number').notNullable().unique()

      // National ID information (Compliance: Patient Identification)
      table.string('national_id_type').notNullable().defaultTo('CNIC')
      table.string('national_id_number').nullable()

      // Address information (Compliance: Patient Demographics)
      table.string('address_line').notNullable()
      table.string('city').notNullable()
      table.string('postal_code').nullable()

      // Emergency contact (Compliance: Required Contact Information)
      table.string('emergency_contact_name').notNullable()
      table.string('emergency_contact_phone').notNullable()

      // Medical information (Compliance: Patient Allergies)
      table.text('allergies').nullable()

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
