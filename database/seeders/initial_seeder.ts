import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export enum Roles {
  ADMIN = 1,
  RADIOGRAPHER = 2,
  RADIOLOGIST = 3,
}

export default class extends BaseSeeder {
  public async run() {
    const existingRoles = await Role.all()
    const existingRoleIds = existingRoles.map((role) => role.id)

    const rolesToCreate = []

    if (!existingRoleIds.includes(Roles.ADMIN)) {
      rolesToCreate.push({ id: Roles.ADMIN, name: 'Admin' })
    }

    if (!existingRoleIds.includes(Roles.RADIOGRAPHER)) {
      rolesToCreate.push({ id: Roles.RADIOGRAPHER, name: 'Radiographer' })
    }

    if (!existingRoleIds.includes(Roles.RADIOLOGIST)) {
      rolesToCreate.push({ id: Roles.RADIOLOGIST, name: 'Radiologist' })
    }

    if (rolesToCreate.length > 0) {
      await Role.createMany(rolesToCreate)
    }
  }
}
