import { reportValidator, updateReportValidator } from '#validators/report'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetAllReports from '#actions/reports/get_all'
import GetReport from '#actions/reports/get_single'
import GetDataForCreate from '#actions/reports/get_data_for_create'
import CreateReport from '#actions/reports/create'
import UpdateReport from '#actions/reports/update'
import DeleteReport from '#actions/reports/delete'

@inject()
export default class ReportsController {
  constructor(
    protected getAllReports: GetAllReports,
    protected getReport: GetReport,
    protected getDataForCreate: GetDataForCreate,
    protected createReport: CreateReport,
    protected updateReport: UpdateReport,
    protected deleteReport: DeleteReport
  ) {}

  async index({ inertia }: HttpContext) {
    const reports = await this.getAllReports.handle()
    return inertia.render('reports/index', { reports })
  }

  async showCreateForm({ inertia }: HttpContext) {
    const { requests, radiologists } = await this.getDataForCreate.handle()
    return inertia.render('reports/create', { requests, radiologists })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(reportValidator)
    await this.createReport.handle(data)
    return response.redirect().toPath('/reports')
  }

  async show({ params, inertia }: HttpContext) {
    const report = await this.getReport.handleForShow(params.id)
    return inertia.render('reports/show', { report })
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const report = await this.getReport.handle(params.id)
    const { radiologists } = await this.getDataForCreate.handle()
    return inertia.render('reports/edit', { report, radiologists })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(updateReportValidator)
    await this.updateReport.handle(params.id, data)
    return response.redirect().toPath(`/reports/${params.id}`)
  }

  async destroy({ params, response }: HttpContext) {
    await this.deleteReport.handle(params.id)
    return response.redirect().toPath('/reports')
  }
}
