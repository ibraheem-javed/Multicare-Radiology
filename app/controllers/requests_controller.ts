import { requestValidator } from '#validators/request'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetAllRequests from '#actions/requests/get_all'
import GetRequest from '#actions/requests/get_single'
import GetPatientsForCreate from '#actions/requests/get_patients_for_create'
import CreateRequest from '#actions/requests/create'
import UpdateRequest from '#actions/requests/update'
import DeleteRequest from '#actions/requests/delete'

@inject()
export default class RequestsController {
  constructor(
    protected getAllRequests: GetAllRequests,
    protected getRequest: GetRequest,
    protected getPatientsForCreate: GetPatientsForCreate,
    protected createRequest: CreateRequest,
    protected updateRequest: UpdateRequest,
    protected deleteRequest: DeleteRequest
  ) {}

  async index({ inertia }: HttpContext) {
    const requests = await this.getAllRequests.handle()
    return inertia.render('requests/index', { requests })
  }

  async show(ctx: HttpContext) {
    const { params, inertia } = ctx
    const request = await this.getRequest.handleForShow(ctx, params.id)
    return inertia.render('requests/show', { request })
  }

  async showCreateForm({ inertia }: HttpContext) {
    const { patients, users } = await this.getPatientsForCreate.handle()
    return inertia.render('requests/create', { patients, users })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const data = await request.validateUsing(requestValidator)
    await this.createRequest.handle(ctx, data)
    return response.redirect().toPath('/requests')
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const request = await this.getRequest.handle(params.id)
    const { patients, users } = await this.getPatientsForCreate.handle()
    return inertia.render('requests/edit', {
      request,
      patients,
      users,
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const data = await request.validateUsing(requestValidator)
    await this.updateRequest.handle(ctx, params.id, data)
    return response.redirect().toPath(`/requests/${params.id}`)
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    await this.deleteRequest.handle(ctx, params.id)
    return response.redirect().toPath('/requests')
  }
}
