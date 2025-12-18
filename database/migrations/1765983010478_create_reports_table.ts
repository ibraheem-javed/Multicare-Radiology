import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.uuid('request_id').references('requests.id').onDelete('CASCADE').notNullable()
      table.uuid('patient_id').references('patients.id').onDelete('CASCADE').notNullable()
      table.uuid('radiologist_id').references('users.id').onDelete('SET NULL').nullable()
      table.text('findings').notNullable()
      table.text('impression').nullable()
      table.string('status').notNullable().defaultTo('draft')
      table.date('report_date').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
