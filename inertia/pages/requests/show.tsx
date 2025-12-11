import { usePage, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

interface Patient {
  id: string
  first_name: string
  last_name: string
}

interface User {
  id: string
  first_name: string
  last_name: string
}

interface Request {
  id: string
  procedure_type: string
  request_date: string
  status: string
  patient: Patient
  requested_by: User
}

export default function RequestShowPage() {
  const { request } = usePage<{ request: Request }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Request Details</h1>
        <Link href={`/requests/${request.id}/edit`}>
          <Button>Edit</Button>
        </Link>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Patient:</strong> {request.patient.first_name} {request.patient.last_name}
        </div>
        <div>
          <strong>Procedure:</strong> {request.procedure_type}
        </div>
        <div>
          <strong>Requested By:</strong> {request.requested_by.first_name}{' '}
          {request.requested_by.last_name}
        </div>
        <div>
          <strong>Date:</strong> {request.request_date}
        </div>
        <div>
          <strong>Status:</strong> {request.status}
        </div>
      </div>
    </div>
  )
}
