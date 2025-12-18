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
    ])
  }
}
