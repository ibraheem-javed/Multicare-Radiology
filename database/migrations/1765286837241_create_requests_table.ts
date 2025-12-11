import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('patient_id').references('patients.id').onDelete('CASCADE').notNullable()
      table.string('procedure_type').notNullable()
      table.uuid('requested_by').references('users.id').onDelete('SET NULL').notNullable()
      table.date('request_date').notNullable()
      table.enum('status', ['pending', 'completed']).defaultTo('pending')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
