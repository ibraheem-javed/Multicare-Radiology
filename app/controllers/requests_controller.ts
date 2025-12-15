import { requestValidator } from '#validators/request'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetAllRequests from '#actions/requests/get_all_requests'
import GetRequest from '#actions/requests/get_request'
import GetPatientsForCreate from '#actions/requests/get_patients_for_create'
import CreateRequest from '#actions/requests/create_request'
import UpdateRequest from '#actions/requests/update_request'
import DeleteRequest from '#actions/requests/delete_request'
import { RequestStatus } from '#models/request'

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

  async show({ params, inertia }: HttpContext) {
    const request = await this.getRequest.handleForShow(params.id)

    return inertia.render('requests/show', { request })
  }

  async create({ inertia }: HttpContext) {
    const { patients, users } = await this.getPatientsForCreate.handle()

    return inertia.render('requests/create', { patients, users })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(requestValidator)

    await this.createRequest.handle({
      patient_id: data.patient_id,
      procedure_type: data.procedure_type,
      requested_by: data.requested_by,
      request_date: data.request_date,
      status: data.status as RequestStatus,
    })

    return response.redirect().toPath('/requests')
  }

  async edit({ params, inertia }: HttpContext) {
    const request = await this.getRequest.handleForEdit(params.id)
    const { patients, users } = await this.getPatientsForCreate.handle()

    return inertia.render('requests/edit', {
      request,
      patients,
      users,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(requestValidator)

    await this.updateRequest.handle(params.id, {
      patient_id: data.patient_id,
      procedure_type: data.procedure_type,
      requested_by: data.requested_by,
      request_date: data.request_date,
      status: data.status as RequestStatus,
    })

    return response.redirect().toPath(`/requests/${params.id}`)
  }

  async destroy({ params, response }: HttpContext) {
    await this.deleteRequest.handle(params.id)

    return response.redirect().toPath('/requests')
  }
}
