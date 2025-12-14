import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Roles from '#enums/roles' // <-- import the existing enum

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const existingRoles = await Role.all()
    const existingRoleIds = existingRoles.map((role) => role.id)

    const rolesToCreate = []

    if (!existingRoleIds.includes(Roles.ADMIN)) {
      rolesToCreate.push({ id: Roles.ADMIN, name: 'Admin' })
    }
    if (!existingRoleIds.includes(Roles.RECEPTION)) {
      rolesToCreate.push({ id: Roles.RECEPTION, name: 'Reception' })
    }
    if (!existingRoleIds.includes(Roles.RADIOGRAPHER)) {
      rolesToCreate.push({ id: Roles.RADIOGRAPHER, name: 'Radiographer' })
    }
    if (!existingRoleIds.includes(Roles.RADIOLOGIST)) {
      rolesToCreate.push({ id: Roles.RADIOLOGIST, name: 'Radiologist' })
    }
    if (!existingRoleIds.includes(Roles.MANAGER)) {
      rolesToCreate.push({ id: Roles.MANAGER, name: 'Manager' })
    }

    if (rolesToCreate.length > 0) {
      await Role.createMany(rolesToCreate)
    }
  }
}
