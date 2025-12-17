import { patientValidator } from '#validators/patient'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetAllPatients from '#actions/patients/get_all'
import GetPatient from '#actions/patients/get_single'
import CreatePatient from '#actions/patients/create'
import UpdatePatient from '#actions/patients/update'
import DeletePatient from '#actions/patients/delete'

@inject()
export default class PatientsController {
  constructor(
    protected getAllPatients: GetAllPatients,
    protected getPatient: GetPatient,
    protected createPatient: CreatePatient,
    protected updatePatient: UpdatePatient,
    protected deletePatient: DeletePatient
  ) {}

  async index({ inertia }: HttpContext) {
    const patients = await this.getAllPatients.handle()
    return inertia.render('patients/index', { patients })
  }

  async show(ctx: HttpContext) {
    const { params, inertia } = ctx
    const patient = await this.getPatient.handle(ctx, params.id)
    return inertia.render('patients/show', { patient })
  }

  async showCreateForm({ inertia }: HttpContext) {
    return inertia.render('patients/create')
  }

  async store(ctx: HttpContext) {
    const { request, response, session } = ctx
    const data = await request.validateUsing(patientValidator)
    await this.createPatient.handle(ctx, data)

    session.flash('success', 'Patient created successfully')
    return response.redirect().toPath('/patients')
  }

  async showEditForm(ctx: HttpContext) {
    const { params, inertia } = ctx
    const patient = await this.getPatient.handle(ctx, params.id)
    return inertia.render('patients/edit', { patient })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const data = await request.validateUsing(patientValidator)
    await this.updatePatient.handle(ctx, params.id, data)
    return response.redirect().toPath(`/patients/${params.id}`)
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx
    await this.deletePatient.handle(ctx, params.id)
    return response.redirect().toPath('/patients')
  }
}
