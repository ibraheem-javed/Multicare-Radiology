import Patient from '#models/patient'
import { patientValidator } from '#validators/patient'
import type { HttpContext } from '@adonisjs/core/http'

export default class PatientsController {
  async index({ inertia }: HttpContext) {
    const patients = await Patient.query().orderBy('id', 'desc')

    return inertia.render('patients/index', {
      patients,
    })
  }

  async show({ params, inertia }: HttpContext) {
    const patient = await Patient.findOrFail(params.id)
    console.log(patient)
    return inertia.render('patients/show', {
      patient,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('patients/create')
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(patientValidator)

    await Patient.create(data)

    return response.redirect().toPath('/patients')
  }

  async edit({ params, inertia }: HttpContext) {
    const patient = await Patient.findOrFail(params.id)

    return inertia.render('patients/edit', {
      patient,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(patientValidator)

    const patient = await Patient.findOrFail(params.id)
    patient.merge(data)
    await patient.save()

    return response.redirect().toPath(`/patients/${patient.id}`)
  }
}
