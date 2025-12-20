import { usePage, Link, Head } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

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
    <>
      <Head title="Multicare - Requests" />

      <div className="max-w-xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Request Details</h1>

          <Link href={`/requests/${request.id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <Detail label="Patient">
              {request.patient ? `${request.patient.firstName} ${request.patient.lastName}` : '—'}
            </Detail>

            <Detail label="Procedure">{request.procedureType}</Detail>

            <Detail label="Requested By">{request.requester?.name ?? '—'}</Detail>

            <Detail label="Additional Requester Information">
              {request.requester?.additionalInformation ?? '—'}
            </Detail>

            <Separator />

            <Detail label="Date">{request.requestDate}</Detail>

            <Detail label="Status">{request.status}</Detail>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{children}</span>
    </div>
  )
}
