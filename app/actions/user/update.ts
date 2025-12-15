import User from '#models/user'

type UpdateUserParams = {
  userId: number
  first_name: string
  last_name?: string | null
  password?: string
  role_id: number
}

export default class UpdateUser {
  async handle({ userId, first_name, last_name, password, role_id }: UpdateUserParams) {
    const user = await User.findOrFail(userId)

    user.merge({
      firstName: first_name,
      lastName: last_name ?? null,
      roleId: role_id,
    })

    if (password) {
      user.password = password // model handles hashing
    }

    await user.save()
    return user
  }
}
