import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export enum AuditAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  ACCESSED = 'accessed',
}

export enum EntityType {
  PATIENT = 'Patient',
  REQUEST = 'Request',
  REPORT = 'Report',
  USER = 'User',
}

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

  // Relationships
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>
}