import User from '#models/user'
import Roles from '#enums/roles'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@multicare.com',
        password: 'password123',
        roleId: Roles.ADMIN,
      },
      {
        firstName: 'Reception',
        lastName: 'User',
        email: 'reception@multicare.com',
        password: 'password123',
        roleId: Roles.RECEPTION,
      },
      {
        firstName: 'Radiographer',
        lastName: 'User',
        email: 'radiographer@multicare.com',
        password: 'password123',
        roleId: Roles.RADIOGRAPHER,
      },
      {
        firstName: 'Radiologist',
        lastName: 'User',
        email: 'radiologist@multicare.com',
        password: 'password123',
        roleId: Roles.RADIOLOGIST,
      },
      {
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@multicare.com',
        password: 'password123',
        roleId: Roles.MANAGER,
      },
    ])
  }
}
