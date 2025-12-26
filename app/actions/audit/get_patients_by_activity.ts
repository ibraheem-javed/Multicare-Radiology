import db from '@adonisjs/lucid/services/db'

type PatientWithActivity = {
  id: string
  firstName: string
  lastName: string
  nationalIdNumber: string | null
  phone: string | null
  medicalRecordNumber: string
  lastActivity: string | null
}

export default class GetPatientsByActivity {
  async handle(): Promise<PatientWithActivity[]> {
    const patientsWithActivity = await db.rawQuery(`
      SELECT
        p.id,
        p.first_name,
        p.last_name,
        p.national_id_number,
        p.phone,
        p.medical_record_number,
        MAX(al.created_at) as last_activity
      FROM patients p
      LEFT JOIN audit_logs al ON (
        (al.entity_type = 'Patient' AND al.entity_id = p.id)
        OR (al.changes->'new'->'patient'->>'id' = p.id::text)
        OR (al.changes->'old'->'patient'->>'id' = p.id::text)
      )
      GROUP BY p.id, p.first_name, p.last_name, p.national_id_number, p.phone, p.medical_record_number
      ORDER BY last_activity DESC NULLS LAST
    `)

    return patientsWithActivity.rows.map((row: any) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      nationalIdNumber: row.national_id_number,
      phone: row.phone,
      medicalRecordNumber: row.medical_record_number,
      lastActivity: row.last_activity,
    }))
  }
}
