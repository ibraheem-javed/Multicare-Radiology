import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'audit_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      // Who made the change
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('SET NULL')

      // What action was performed
      table
        .enum('action', ['created', 'updated', 'deleted', 'accessed'], {
          useNative: true,
          enumName: 'audit_action',
        })
        .notNullable()

      // Which entity was affected
      table.string('entity_type').notNullable() // Patient, Request, Report, User
      table.uuid('entity_id').notNullable() // ID of the affected record

      // What changed (JSON storing old -> new values)
      table.jsonb('changes').nullable()

      // Request metadata
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()

      // When it happened (with millisecond precision)
      table.timestamp('created_at', { useTz: true, precision: 3 }).notNullable().defaultTo(this.now())

      // Indexes for fast lookups
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