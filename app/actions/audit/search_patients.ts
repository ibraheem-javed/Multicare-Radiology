import Patient from '#models/patient'

export default class SearchPatients {
  async handle(searchTerm: string) {
    const search = `%${searchTerm}%`

    const patients = await Patient.query()
      .where((query) => {
        query
          .whereILike('first_name', search)
          .orWhereILike('last_name', search)
          .orWhereILike('medical_record_number', search)
          .orWhereILike('national_id_number', search)
      })
      .orderBy('created_at', 'desc')
      .limit(50)

    return patients.map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      nationalIdNumber: patient.nationalIdNumber,
      phone: patient.phone,
      medicalRecordNumber: patient.medicalRecordNumber,
    }))
  }
}
