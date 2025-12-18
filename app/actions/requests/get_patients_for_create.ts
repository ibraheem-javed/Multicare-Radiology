import Patient from '#models/patient'
import Requester from '#models/requester'

export default class GetPatientsForCreate {
  async handle() {
    const patients = await Patient.query().orderBy('firstName', 'asc')
    const requesters = await Requester.query().orderBy('name', 'asc')

    return { patients, requesters }
  }
}
