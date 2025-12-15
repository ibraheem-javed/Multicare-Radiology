import User from '#models/user'

type CreateUserParams = {
  first_name: string
  last_name?: string | null
  email: string
  password: string
  role_id: number
}

export default class CreateUser {
  async handle(data: CreateUserParams) {
    const exists = await User.query().where('email', data.email).first()
    if (exists) throw new Error('Email already exists')

    const user = await User.create({
      firstName: data.first_name,
      lastName: data.last_name ?? null,
      email: data.email,
      password: data.password, // model hashes automatically
      roleId: data.role_id,
    })

    return user
  }
}
