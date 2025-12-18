import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { AuditAction } from '#enums/audit_action'
import { EntityType } from '#enums/entity_type'

export default class AuditLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'user_id' })
  declare userId: string

  @column()
  declare action: AuditAction

  @column({ columnName: 'entity_type' })
  declare entityType: EntityType

  @column({ columnName: 'entity_id' })
  declare entityId: string

  @column()
  declare changes: {
    old?: Record<string, any>
    new?: Record<string, any>
  } | null

  @column({ columnName: 'ip_address' })
  declare ipAddress: string | null

  @column({ columnName: 'user_agent' })
  declare userAgent: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}
