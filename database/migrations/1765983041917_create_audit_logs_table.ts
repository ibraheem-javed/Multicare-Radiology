import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('SET NULL')
      table
        .enum('action', ['created', 'updated', 'deleted', 'accessed'], {
          useNative: true,
          enumName: 'audit_action',
        })
        .notNullable()
      table.string('entity_type').notNullable()
      table.uuid('entity_id').notNullable()
      table.jsonb('changes').nullable()
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
      table
        .timestamp('created_at', { useTz: true, precision: 3 })
        .notNullable()
        .defaultTo(this.now())
      table.index(['entity_type', 'entity_id'])
      table.index('user_id')
      table.index('created_at')
      table.index('action')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS audit_action')
  }
}
