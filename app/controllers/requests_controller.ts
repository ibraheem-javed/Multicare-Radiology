import {
  requestValidator,
  requestWithRequesterIdValidator,
  requestWithRequesterNameValidator,
} from '#validators/request'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import GetAllRequests from '#actions/requests/get_all'
import GetRequest from '#actions/requests/get_single'
import GetPatientsForCreate from '#actions/requests/get_patients_for_create'
import CreateRequest from '#actions/requests/create'
import UpdateRequest from '#actions/requests/update'
import DeleteRequest from '#actions/requests/delete'

import { toRequestView, toRequestViewList } from '#dtos/request/request_view'
import { toRequestForm } from '#dtos/request/request_form'
import { patientToDropdown, requesterToDropdown } from '#dtos/request/request_dropdown'

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

    return inertia.render('requests/index', {
      requests: toRequestViewList(requests),
    })
  }

  async show(ctx: HttpContext) {
    const { params, inertia } = ctx
    const request = await this.getRequest.handleForShow(ctx, params.id)

    return inertia.render('requests/show', {
      request: toRequestView(request),
    })
  }

  async showCreateForm({ inertia }: HttpContext) {
    const { patients, requesters } = await this.getPatientsForCreate.handle()

    return inertia.render('requests/create', {
      patients: patients.map((p) => patientToDropdown(p)),
      requesters: requesters.map((r) => requesterToDropdown(r)),
    })
  }

  // async store(ctx: HttpContext) {
  //   const { request, response } = ctx
  //   const data = await request.validateUsing(requestValidator)

  //   if (!data.requesterId && !data.requesterName) {
  //     return response.badRequest('Either requester_id or requester_name must be provided')
  //   }

  //   await this.createRequest.handle(ctx, data)
  //   return response.redirect().toPath('/requests')
  // }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    const payload = request.all()

    let data
    if (payload.requesterId) {
      data = await request.validateUsing(requestWithRequesterIdValidator)
    } else {
      data = await request.validateUsing(requestWithRequesterNameValidator)
    }

    await this.createRequest.handle(ctx, data)
    return response.redirect().toPath('/requests')
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const request = await this.getRequest.handle(params.id)
    const { patients, requesters } = await this.getPatientsForCreate.handle()

    return inertia.render('requests/edit', {
      request: toRequestForm(request),
      patients: patients.map((p) => patientToDropdown(p)),
      requesters: requesters.map((r) => requesterToDropdown(r)),
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    console.log('controller hitting')
    console.log('data for valudation is', request.all())
    const data = await request.validateUsing(requestValidator)
    console.log('validated data is', data)
    await this.updateRequest.handle(ctx, params.id, data)
    return response.redirect().toPath(`/requests/${params.id}`)
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx

    await this.deleteRequest.handle(ctx, params.id)
    return response.redirect().toPath('/requests')
  }
}
