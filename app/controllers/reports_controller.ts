import { reportValidator, updateReportValidator } from '#validators/report'
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import GetAllReports from '#actions/reports/get_all'
import GetReport from '#actions/reports/get_single'
import GetDataForCreate from '#actions/reports/get_data_for_create'
import CreateReport from '#actions/reports/create'
import UpdateReport from '#actions/reports/update'
import DeleteReport from '#actions/reports/delete'

import { toReportViewList, toReportDetailedView } from '#dtos/report/report_view'
import { toReportForm } from '#dtos/report/report_form'
import { toRadiologistDropdownList } from '#dtos/report/radiologist_dropdown'
import { toPatientRequests } from '#dtos/request/request_dropdown'

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

    return inertia.render('reports/index', {
      reports: toReportViewList(reports),
    })
  }

  async showCreateForm({ inertia }: HttpContext) {
    const { requests, radiologists } = await this.getDataForCreate.handle()

    return inertia.render('reports/create', {
      patients: toPatientRequests(requests),
      radiologists: toRadiologistDropdownList(radiologists),
    })
  }

  async store(ctx: HttpContext) {
    const { request, response } = ctx
    console.log(request.all())
    const data = await request.validateUsing(reportValidator)
    console.log(data)
    await this.createReport.handle(ctx, data)
    return response.redirect().toPath('/reports')
  }

  async show(ctx: HttpContext) {
    const { params, inertia } = ctx
    const report = await this.getReport.handleForShow(params.id)

    return inertia.render('reports/show', {
      report: toReportDetailedView(report),
    })
  }

  async showEditForm({ params, inertia }: HttpContext) {
    const report = await this.getReport.handle(params.id)
    const { radiologists } = await this.getDataForCreate.handle()

    return inertia.render('reports/edit', {
      report: toReportForm(report),
      radiologists: toRadiologistDropdownList(radiologists),
    })
  }

  async update(ctx: HttpContext) {
    const { params, request, response } = ctx
    const data = await request.validateUsing(updateReportValidator)

    await this.updateReport.handle(params.id, data)
    return response.redirect().toPath(`/reports/${params.id}`)
  }

  async destroy(ctx: HttpContext) {
    const { params, response } = ctx

    await this.deleteReport.handle(params.id)
    return response.redirect().toPath('/reports')
  }
}
