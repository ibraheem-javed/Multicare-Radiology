import type { HttpContext } from '@adonisjs/core/http'
import Roles from '#enums/roles'
import { userValidator, userUpdateValidator } from '#validators/user'
import ListUsers from '#actions/user/get_all'
import GetUser from '#actions/user/get_single'
import CreateUser from '#actions/user/create'
import UpdateUser from '#actions/user/update'
import DeleteUser from '#actions/user/delete'
import { inject } from '@adonisjs/core'

@inject()
export default class UsersController {
  constructor(
    protected listUsers: ListUsers,
    protected getUser: GetUser,
    protected createUser: CreateUser,
    protected updateUser: UpdateUser,
    protected deleteUser: DeleteUser
  ) {}

  async index({ inertia, auth }: HttpContext) {
    const users = await this.listUsers.handle({ excludeUserId: auth.user!.id })
    return inertia.render('users/index', { users })
  }

  async showCreateForm({ inertia }: HttpContext) {
    return inertia.render('users/create', { roles: Roles })
  }

  async store({ request, response }: HttpContext) {
    console.log(request.all())
    request.updateBody({
      ...request.all(),
      password_confirmation: request.input('passwordConfirmation'),
    })
    const data = await request.validateUsing(userValidator)
    try {
      await this.createUser.handle(data)
    } catch (err: any) {
      return response.badRequest({ message: err.message })
    }
    return response.redirect().toPath('/users')
  }

  async show({ params, inertia }: HttpContext) {
    const user = await this.getUser.handle(params.id)
    return inertia.render('users/show', { user })
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const user = await this.getUser.handle(params.id)
    return inertia.render('users/edit', { user, roles: Roles })
  }

  async update({ params, request, response }: HttpContext) {
    const payload = request.only([
      'firstName',
      'lastName',
      'password',
      'passwordConfirmation',
      'roleId',
    ])

    request.updateBody({
      ...payload,
      password_confirmation: payload.passwordConfirmation,
    })
    const data = await request.validateUsing(userUpdateValidator)
    await this.updateUser.handle({ userId: params.id, ...data })
    return response.redirect().toPath(`/users/${params.id}`)
  }

  async destroy({ params, response }: HttpContext) {
    await this.deleteUser.handle(params.id)
    return response.redirect().toPath('/users')
  }
}
