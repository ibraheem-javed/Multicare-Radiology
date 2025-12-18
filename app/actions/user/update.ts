import User from '#models/user'

type UpdateUserParams = {
  userId: number
  firstName: string
  lastName?: string | null
  password?: string
  roleId: number
}

export default class UpdateUser {
  async handle({ userId, firstName, lastName, password, roleId }: UpdateUserParams) {
    const user = await User.findOrFail(userId)

    user.merge({
      firstName: firstName,
      lastName: lastName ?? null,
      roleId: roleId,
    })

    if (password) {
      user.password = password // model handles hashing
    }

    await user.save()
    return user
  }
}
