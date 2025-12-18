import User from '#models/user'

type CreateUserParams = {
  firstName: string
  lastName?: string | null
  email: string
  password: string
  roleId: number
}

export default class CreateUser {
  async handle(data: CreateUserParams) {
    const exists = await User.query().where('email', data.email).first()
    if (exists) throw new Error('Email already exists')

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName ?? null,
      email: data.email,
      password: data.password, // model hashes automatically
      roleId: data.roleId,
    })

    return user
  }
}
