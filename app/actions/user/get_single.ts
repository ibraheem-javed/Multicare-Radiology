import User from '#models/user'
import Roles from '#enums/roles'

export default class GetUser {
  async handle(userId: number) {
    const user = await User.findOrFail(userId)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: { id: user.roleId, name: Roles[user.roleId] },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
