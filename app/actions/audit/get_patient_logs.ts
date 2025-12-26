import AuditLog from '#models/audit_log'
import Patient from '#models/patient'

export default class GetPatientLogs {
  async handle(patientId: string) {
    const patient = await Patient.findOrFail(patientId)

    const allLogs = await AuditLog.query()
      .preload('user')
      .where((query) => {
        query.where((subQuery) => {
          subQuery.where('entity_type', 'Patient').where('entity_id', patientId)
        })

        query.orWhereRaw(
          "(changes->'new'->'patient'->>'id' = ? OR changes->'old'->'patient'->>'id' = ?)",
          [patientId, patientId]
        )
      })
      .orderBy('created_at', 'desc')

    const patientLogs = allLogs.filter((log) => log.entityType === 'Patient')
    const requestLogs = allLogs.filter((log) => log.entityType === 'Request')
    const reportLogs = allLogs.filter((log) => log.entityType === 'Report')

    const mapLog = (log: AuditLog) => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      changes: log.changes,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISO(),
      user: log.user
        ? {
            id: log.user.id,
            firstName: log.user.firstName,
            lastName: log.user.lastName,
            email: log.user.email,
          }
        : null,
    })

    return {
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        nationalIdNumber: patient.nationalIdNumber,
        medicalRecordNumber: patient.medicalRecordNumber,
        addressLine: patient.addressLine,
        city: patient.city,
        phone: patient.phone,
      },
      patientLogs: patientLogs.map(mapLog),
      requestLogs: requestLogs.map(mapLog),
      reportLogs: reportLogs.map(mapLog),
    }
  }
}
