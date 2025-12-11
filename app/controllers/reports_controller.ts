import Report from '#models/report'
import Request from '#models/request'
import Patient from '#models/patient'
import User from '#models/user'
import { reportValidator } from '#validators/report'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class ReportsController {
  // List reports
  async index({ inertia }: HttpContext) {
    const reports = await Report.query()
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .orderBy('created_at', 'desc')

    const mapped = reports.map((r) => ({
      id: r.id,
      status: r.status,
      findingsPreview: r.findings.substring(0, 50) + '...',
      report_date: r.reportDate.toISODate(),
      patient: r.patient
        ? { first_name: r.patient.first_name, last_name: r.patient.last_name }
        : { first_name: '-', last_name: '-' },
      radiologist: r.radiologist
        ? { first_name: r.radiologist.firstName, last_name: r.radiologist.lastName }
        : null,
    }))

    return inertia.render('reports/index', { reports: mapped })
  }

  // Create
  async create({ inertia }: HttpContext) {
    const requests = await Request.query().preload('patient').orderBy('id', 'desc')
    const users = await User.query().orderBy('firstName', 'asc')

    const reqs = requests.map((r) => ({
      id: r.id,
      patient: `${r.patient.first_name} ${r.patient.last_name}`,
      procedure: r.procedureType,
    }))

    const radiologists = users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
    }))

    return inertia.render('reports/create', { requests: reqs, radiologists })
  }

  // Store
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(reportValidator)

    const reqRecord = await Request.findOrFail(data.request_id)

    await Report.create({
      requestId: data.request_id,
      patientId: reqRecord.patientId,
      radiologistId: data.radiologist_id,
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
    })

    return response.redirect().toPath('/reports')
  }

  // Show
  async show({ params, inertia }: HttpContext) {
    const report = await Report.query()
      .where('id', params.id)
      .preload('patient')
      .preload('radiologist')
      .preload('request')
      .firstOrFail()

    const mapped = {
      id: report.id,
      findings: report.findings,
      impression: report.impression,
      status: report.status,
      report_date: report.reportDate.toISODate(),
      patient: report.patient
        ? { first_name: report.patient.first_name, last_name: report.patient.last_name }
        : { first_name: '-', last_name: '-' },
      radiologist: report.radiologist
        ? { first_name: report.radiologist.firstName, last_name: report.radiologist.lastName }
        : null,
      request: report.request ? { procedureType: report.request.procedureType } : null,
    }

    return inertia.render('reports/show', { report: mapped })
  }

  // Edit
  async edit({ params, inertia }: HttpContext) {
    const report = await Report.findOrFail(params.id)
    const users = await User.query().orderBy('firstName', 'asc')

    const mappedReport = {
      id: report.id,
      findings: report.findings,
      impression: report.impression,
      status: report.status,
      report_date: report.reportDate.toISODate(),
      radiologist_id: report.radiologistId,
    }

    const radiologists = users.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
    }))

    return inertia.render('reports/edit', { report: mappedReport, radiologists })
  }

  // Update
  async update({ params, request, response }: HttpContext) {
    const report = await Report.findOrFail(params.id)
    const data = await request.validateUsing(reportValidator)

    report.merge({
      findings: data.findings,
      impression: data.impression,
      status: data.status,
      reportDate: DateTime.fromJSDate(data.report_date),
      radiologistId: data.radiologist_id,
    })

    await report.save()

    return response.redirect().toPath(`/reports/${report.id}`)
  }

  // Delete
  async destroy({ params, response }: HttpContext) {
    const report = await Report.findOrFail(params.id)
    await report.delete()
    return response.redirect().toPath('/reports')
  }
}
