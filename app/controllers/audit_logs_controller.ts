import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import GetPatientLogs from '#actions/audit/get_patient_logs'
import GetPatientsByActivity from '#actions/audit/get_patients_by_activity'

@inject()
export default class AuditLogsController {
  constructor(
    protected getPatientLogs: GetPatientLogs,
    protected getPatientsByActivity: GetPatientsByActivity
  ) {}

  async index({ inertia }: HttpContext) {
    const patients = await this.getPatientsByActivity.handle()

    return inertia.render('audit/logs', {
      patients,
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
