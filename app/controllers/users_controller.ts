import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import Roles from '#enums/roles'
import { userValidator } from '#validators/user'

export default class UsersController {
  // List all users
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('firstName', 'asc')

    const mapped = users.map((u) => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: { id: u.roleId, name: Roles[u.roleId] }, // mapping roleId to role name
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }))

    return inertia.render('users/index', { users: mapped })
  }

  // Show create user form
  async create({ inertia }: HttpContext) {
    return inertia.render('users/create', { roles: Roles })
  }

  // Store new user
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(userValidator)

    await User.create({
      firstName: data.first_name,
      lastName: data.last_name ?? null,
      email: data.email,
      password: await hash.make(data.password),
      roleId: data.role_id,
    })

    return response.redirect().toPath('/users')
  }

  // Show single user
  async show({ params, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const mapped = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: { id: user.roleId, name: Roles[user.roleId] },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return inertia.render('users/show', { user: mapped })
  }

  // Edit user form
  async edit({ params, inertia }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return inertia.render('users/edit', { user, roles: Roles })
  }

  // Update user
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = await request.validateUsing(userValidator)

    user.merge({
      firstName: data.first_name,
      lastName: data.last_name ?? null,
      email: data.email,
      roleId: data.role_id,
    })

    if (data.password) {
      user.password = await hash.make(data.password)
    }

    await user.save()
    return response.redirect().toPath(`/users/${user.id}`)
  }

  // Delete user
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.redirect().toPath('/users')
  }
}
