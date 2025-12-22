import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Patient from './patient.js'
import Requester from './requester.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { RequestStatus } from '#enums/request_status'

export default class Request extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'patient_id' })
  declare patientId: string

  @column({ columnName: 'procedure_type' })
  declare procedureType: string

  @column({ columnName: 'requester_id' })
  declare requesterId: string

  @column.date({ columnName: 'request_date' })
  declare requestDate: DateTime

  @column()
  declare status: RequestStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Patient, { foreignKey: 'patientId' })
  declare patient: BelongsTo<typeof Patient>

  @belongsTo(() => Requester, { foreignKey: 'requesterId' })
  declare requester: BelongsTo<typeof Requester>
}
