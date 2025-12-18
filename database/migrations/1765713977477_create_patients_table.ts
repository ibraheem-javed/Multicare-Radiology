import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.date('date_of_birth').nullable()
      table.string('gender').nullable()
      table.string('age').notNullable()
      table.string('phone').nullable()
      table.string('medical_record_number').notNullable().unique()
      table.string('national_id_type').notNullable().defaultTo('CNIC')
      table.string('national_id_number').nullable()
      table.string('address_line').notNullable()
      table.string('city').notNullable()
      table.string('postal_code').nullable()
      table.string('emergency_contact_name').notNullable()
      table.string('emergency_contact_phone').notNullable()
      table.text('allergies').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
