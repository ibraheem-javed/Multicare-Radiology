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

  async show({ params, inertia }: HttpContext) {
    const patient = await this.getPatient.handle(params.id)
    return inertia.render('patients/show', { patient })
  }

  async showCreateForm({ inertia }: HttpContext) {
    return inertia.render('patients/create')
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(patientValidator)
    await this.createPatient.handle(data)
    return response.redirect().toPath('/patients')
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const patient = await this.getPatient.handle(params.id)
    return inertia.render('patients/edit', { patient })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(patientValidator)
    await this.updatePatient.handle(params.id, data)
    return response.redirect().toPath(`/patients/${params.id}`)
  }

  async destroy({ params, response }: HttpContext) {
    await this.deletePatient.handle(params.id)
    return response.redirect().toPath('/patients')
  }
}
