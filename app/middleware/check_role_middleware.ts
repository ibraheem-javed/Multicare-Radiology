import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckRoleMiddleware {
  public async handle(ctx: HttpContext, next: NextFn, options: { roles?: number[] } = {}) {
    const user = ctx.auth.user
    if (!user) return ctx.response.unauthorized({ message: 'Not authenticated' })

    const allowedRoles = options.roles ?? []
    if (!allowedRoles.includes(user.roleId)) {
      return ctx.response.unauthorized({ message: 'You do not have permission' })
    }

    await next()
  }
}
