import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetLogs from '#actions/audit/get_logs'
import GetPatientLogs from '#actions/audit/get_patient_logs'
import SearchPatients from '#actions/audit/search_patients'

@inject()
export default class AuditLogsController {
  constructor(
    protected getAuditLogs: GetLogs,
    protected getPatientLogs: GetPatientLogs,
    protected searchPatients: SearchPatients
  ) {}

  async index({ request, inertia }: HttpContext) {
    const search = request.input('search', '').trim()

    if (search) {
      const patients = await this.searchPatients.handle(search)

      return inertia.render('audit/logs', {
        searchResults: patients,
        searchTerm: search,
        logs: [],
        pagination: {
          currentPage: 1,
          lastPage: 1,
          total: 0,
          perPage: 100,
        },
      })
    }

    const { logs } = await this.getAuditLogs.handle({
      page: 1,
      perPage: 100,
    })

    return inertia.render('audit/logs', {
      logs,
      searchResults: [],
      searchTerm: '',
      pagination: {
        currentPage: 1,
        lastPage: 1,
        total: logs.length,
        perPage: 100,
      },
    })
  }

  async show({ params, inertia }: HttpContext) {
    const { patient, patientLogs, requestLogs, reportLogs } =
      await this.getPatientLogs.handle(params.id)

    return inertia.render('audit/patient', {
      patient,
      patientLogs,
      requestLogs,
      reportLogs,
    })
  }
}
