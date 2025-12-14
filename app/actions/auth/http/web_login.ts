import User from '#models/user'
import { loginValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { Infer } from '@vinejs/vine/types'

type Params = {
  data: Infer<typeof loginValidator>
}

@inject()
export default class WebLogin {
  constructor(protected ctx: HttpContext) {}

  async handle({ data }: Params) {
    console.log('action method hitting')
    console.log(data.email)
    console.log(data.password)

    const user = await User.verifyCredentials(data.email, data.password)
    console.log(user)
    await this.ctx.auth.use('web').login(user)

    return user
  }
}
