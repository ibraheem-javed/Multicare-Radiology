import User from '#models/user'
import Roles from '#enums/roles'

type ListUsersParams = {
  excludeUserId?: string
}

export default class ListUsers {
  async handle({ excludeUserId }: ListUsersParams = {}) {
    const query = User.query()
    if (excludeUserId) {
      query.whereNot('id', excludeUserId)
    }
    const users = await query.orderBy('firstName', 'asc')

    return users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: { id: u.roleId, name: Roles[u.roleId] },
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }))
  }
}
