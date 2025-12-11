import Request, { RequestStatus } from '#models/request'
import Patient from '#models/patient'
import User from '#models/user'
import { requestValidator } from '#validators/request'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class RequestsController {
  // List all requests
  async index({ inertia }: HttpContext) {
    // Fetch requests with both relations preloaded
    const requests = await Request.query()
      .preload('patient')
      .preload('requestedBy')
      .orderBy('id', 'desc')

    // Map requests to plain objects suitable for Inertia
    const requestsMapped = requests.map((r) => ({
      id: r.id,
      procedure_type: r.procedureType,
      request_date: r.requestDate.toISODate(), // convert DateTime to string
      status: r.status,
      patient: r.patient
        ? {
            id: r.patient.id,
            first_name: r.patient.first_name,
            last_name: r.patient.last_name,
          }
        : null, // in case patient was deleted
      requested_by: r.requestedBy
        ? {
            id: r.requestedBy.id,
            first_name: r.requestedBy.firstName,
            last_name: r.requestedBy.lastName,
          }
        : null, // in case user was deleted
    }))

    // Render the Inertia page
    return inertia.render('requests/index', { requests: requestsMapped })
  }

  // Show a single request
  async show({ params, inertia }: HttpContext) {
    const requestRecord = await Request.query()
      .where('id', params.id)
      .preload('patient')
      .preload('requestedBy') // <-- preload the user who requested
      .firstOrFail()

    // Map to plain object for frontend
    const requestMapped = {
      id: requestRecord.id,
      procedure_type: requestRecord.procedureType,
      request_date: requestRecord.requestDate.toISODate(),
      status: requestRecord.status,
      patient: requestRecord.patient
        ? {
            id: requestRecord.patient.id,
            first_name: requestRecord.patient.first_name,
            last_name: requestRecord.patient.last_name,
          }
        : null,
      requested_by: requestRecord.requestedBy
        ? {
            id: requestRecord.requestedBy.id,
            first_name: requestRecord.requestedBy.firstName,
            last_name: requestRecord.requestedBy.lastName,
          }
        : null,
    }

    return inertia.render('requests/show', { request: requestMapped })
  }

  // Render create form
  async create({ inertia }: HttpContext) {
    // First, fetch the data
    const patientsQuery = await Patient.query().orderBy('first_name', 'asc')
    const usersQuery = await User.query().orderBy('firstName', 'asc')

    // Then map to plain objects
    const patients = patientsQuery.map((p) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
    }))

    const users = usersQuery.map((u) => ({
      id: u.id,
      first_name: u.firstName,
      last_name: u.lastName,
    }))

    console.log(users)
    console.log(patients)
    return inertia.render('requests/create', { patients, users })
  }

  // Store a new request
  // Store a new request
  async store({ request, response }: HttpContext) {
    const dataValidated = await request.validateUsing(requestValidator)

    // Map snake_case from form/validator to camelCase model properties
    const dataToSave = {
      patientId: dataValidated.patient_id,
      procedureType: dataValidated.procedure_type,
      requestedById: dataValidated.requested_by,
      requestDate: DateTime.fromJSDate(dataValidated.request_date),
      status: dataValidated.status as RequestStatus,
    }

    await Request.create(dataToSave)
    return response.redirect().toPath('/requests')
  }

  // Render edit form
  async edit({ params, inertia }: HttpContext) {
    const requestRecord = await Request.findOrFail(params.id)
    const patients = await Patient.query().orderBy('first_name', 'asc')
    const users = await User.query().orderBy('firstName', 'asc') // fetch users for the dropdown

    // Map request to snake_case for frontend form
    const requestMapped = {
      id: requestRecord.id,
      patient_id: requestRecord.patientId,
      procedure_type: requestRecord.procedureType,
      requested_by: requestRecord.requestedById,
      request_date: requestRecord.requestDate.toISODate(),
      status: requestRecord.status,
    }

    // Map patients and users to plain objects
    const patientsMapped = patients.map((p) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
    }))

    const usersMapped = users.map((u) => ({
      id: u.id,
      first_name: u.firstName,
      last_name: u.lastName,
    }))

    return inertia.render('requests/edit', {
      request: requestMapped,
      patients: patientsMapped,
      users: usersMapped,
    })
  }

  // Update request
  async update({ params, request, response }: HttpContext) {
    const requestRecord = await Request.findOrFail(params.id)
    const dataValidated = await request.validateUsing(requestValidator)

    const dataToUpdate = {
      ...dataValidated,
      request_date: DateTime.fromJSDate(dataValidated.request_date),
      status: dataValidated.status as RequestStatus,
    }

    requestRecord.merge(dataToUpdate)
    await requestRecord.save()
    return response.redirect().toPath(`/requests/${requestRecord.id}`)
  }

  // Delete request
  async destroy({ params, response }: HttpContext) {
    const requestRecord = await Request.findOrFail(params.id)
    await requestRecord.delete()
    return response.redirect().toPath('/requests')
  }
}
