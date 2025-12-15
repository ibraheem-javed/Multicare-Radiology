import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Patient from './patient.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export enum RequestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'patient_id' })
  declare patientId: string

  @column({ columnName: 'procedure_type' })
  declare procedureType: string

  @column({ columnName: 'requested_by' })
  declare requestedById: string

  @column.date({ columnName: 'request_date' })
  declare requestDate: DateTime

  @column()
  declare status: RequestStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => Patient, { foreignKey: 'patientId' })
  declare patient: BelongsTo<typeof Patient>

  @belongsTo(() => User, { foreignKey: 'requestedById' })
  declare requestedBy: BelongsTo<typeof User>
}
