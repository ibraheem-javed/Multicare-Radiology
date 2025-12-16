import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Roles from '#enums/roles'

const PatientsController = () => import('#controllers/patients_controller')
const RequestsController = () => import('#controllers/requests_controller')
const ReportsController = () => import('#controllers/reports_controller')
const UsersController = () => import('#controllers/users_controller')
const AuditLogsController = () => import('#controllers/audit_logs_controller')

router
  .group(() => {
    // Home
    router.on('/').renderInertia('home')

    // Patients (Reception + Admin only for create/store/update)
    router
      .group(() => {
        router.get('/', [PatientsController, 'index']).as('patients.index')
        router.get('/create', [PatientsController, 'showCreateForm']).as('patients.create')
        router
          .post('/', [PatientsController, 'store'])
          .as('patients.store')
          .middleware([middleware.checkRole({ roles: [Roles.RECEPTION, Roles.ADMIN] })])
        router.get('/:id', [PatientsController, 'show']).as('patients.show')
        router.get('/:id/edit', [PatientsController, 'showEditForm']).as('patients.edit')
        router
          .put('/:id', [PatientsController, 'update'])
          .as('patients.update')
          .middleware([middleware.checkRole({ roles: [Roles.RECEPTION, Roles.ADMIN] })])
      })
      .prefix('patients')
      .as('patients')

    // Requests (Reception + Admin only for create/store/update/delete)
    router
      .group(() => {
        router.get('/', [RequestsController, 'index']).as('requests.index')
        router.get('/create', [RequestsController, 'showCreateForm']).as('requests.create')
        router
          .post('/', [RequestsController, 'store'])
          .as('requests.store')
          .middleware([middleware.checkRole({ roles: [Roles.RECEPTION, Roles.ADMIN] })])
        router.get('/:id', [RequestsController, 'show']).as('requests.show')
        router.get('/:id/edit', [RequestsController, 'showEditForm']).as('requests.edit')
        router
          .put('/:id', [RequestsController, 'update'])
          .as('requests.update')
          .middleware([middleware.checkRole({ roles: [Roles.RECEPTION, Roles.ADMIN] })])
        router
          .delete('/:id', [RequestsController, 'destroy'])
          .as('requests.destroy')
          .middleware([middleware.checkRole({ roles: [Roles.RECEPTION, Roles.ADMIN] })])
      })
      .prefix('requests')
      .as('requests')

    // Reports (Radiologist + Admin only for create/store/update/delete)
    router
      .group(() => {
        router.get('/', [ReportsController, 'index']).as('reports.index')
        router.get('/create', [ReportsController, 'showCreateForm']).as('reports.create')
        router
          .post('/', [ReportsController, 'store'])
          .as('reports.store')
          .middleware([middleware.checkRole({ roles: [Roles.RADIOLOGIST, Roles.ADMIN] })])
        router.get('/:id', [ReportsController, 'show']).as('reports.show')
        router.get('/:id/edit', [ReportsController, 'showEditForm']).as('reports.edit')
        router
          .put('/:id', [ReportsController, 'update'])
          .as('reports.update')
          .middleware([middleware.checkRole({ roles: [Roles.RADIOLOGIST, Roles.ADMIN] })])
        router
          .delete('/:id', [ReportsController, 'destroy'])
          .as('reports.destroy')
          .middleware([middleware.checkRole({ roles: [Roles.RADIOLOGIST, Roles.ADMIN] })])
      })
      .prefix('reports')
      .as('reports')

    //user routes only for admin
    router
      .group(() => {
        router.get('/', [UsersController, 'index']).as('users.index')
        router.get('/create', [UsersController, 'showCreateForm']).as('users.create')
        router.post('/', [UsersController, 'store']).as('users.store')
        router.get('/:id', [UsersController, 'show']).as('users.show')
        router.get('/:id/edit', [UsersController, 'showEditForm']).as('users.edit')
        router.put('/:id', [UsersController, 'update']).as('users.update')
        router.delete('/:id', [UsersController, 'destroy']).as('users.destroy')
      })
      .prefix('users') // now /users, /users/create, /users/:id, etc.
      .as('users')
      .middleware([middleware.auth(), middleware.checkRole({ roles: [Roles.ADMIN] })])

    // Audit logs routes (Admin only)
    router
      .group(() => {
        router.get('/', [AuditLogsController, 'index']).as('audit-logs.index')
      })
      .prefix('audit-logs')
      .as('audit-logs')
      .middleware([middleware.auth(), middleware.checkRole({ roles: [Roles.ADMIN] })])
  })
  .middleware([middleware.auth()])
