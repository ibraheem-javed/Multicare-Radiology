import { usePage, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface Requester {
  id: string
  name: string
  additionalInformation?: string | null
}

interface Request {
  id: string
  procedureType: string
  requestDate: string
  status: string
  patient: Patient | null
  requester: Requester | null
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
          <strong>Patient:</strong>{' '}
          {request.patient ? `${request.patient.firstName} ${request.patient.lastName}` : '-'}
        </div>
        <div>
          <strong>Procedure:</strong> {request.procedureType}
        </div>
        <div>
          <strong>Requested By:</strong> {request.requester ? request.requester.name : '-'}
        </div>
        <div>
          <strong>Additional Requester Information:</strong>
          {request.requester?.additionalInformation ?? '-'}
        </div>
        <div>
          <strong>Date:</strong> {request.requestDate}
        </div>
        <div>
          <strong>Status:</strong> {request.status}
        </div>
      </div>
    </div>
  )
}
