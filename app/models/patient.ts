import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public first_name: string

  @column()
  declare public last_name: string

  @column()
  declare public date_of_birth: string | null

  @column()
  declare public gender: string | null

  @column()
  declare public phone: string | null
}
