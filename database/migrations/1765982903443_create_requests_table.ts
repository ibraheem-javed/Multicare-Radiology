import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'requests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('patient_id').references('patients.id').onDelete('CASCADE').notNullable()
      table.string('procedure_type').notNullable()
      table.uuid('requester_id').references('requesters.id').onDelete('RESTRICT').notNullable()
      table.date('request_date').notNullable()
      table.enum('status', ['pending', 'completed']).defaultTo('pending')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
