import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Request from './request.js'
import Patient from './patient.js'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { ReportStatus } from '#enums/report_status'

export default class Report extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'request_id' })
  declare requestId: string

  @column({ columnName: 'patient_id' })
  declare patientId: string

  @column({ columnName: 'radiologist_id' })
  declare radiologistId: string | null

  @column()
  declare findings: string

  @column()
  declare impression: string | null

  @column()
  declare status: ReportStatus

  @column.date({ columnName: 'report_date' })
  declare reportDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Request)
  declare request: BelongsTo<typeof Request>

  @belongsTo(() => Patient)
  declare patient: BelongsTo<typeof Patient>

  @belongsTo(() => User, { foreignKey: 'radiologistId' })
  declare radiologist: BelongsTo<typeof User>
}
