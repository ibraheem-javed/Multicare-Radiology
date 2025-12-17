import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

interface Patient {
  id: string
  firstName: string
  lastName: string
}

interface User {
  id: string
  firstName: string
  lastName: string
}

interface Request {
  id: string
  procedureType: string
  requestDate: string
  status: string
  patient: Patient | null
  requestedBy: User | null
}

export default function RequestsIndex() {
  const { requests } = usePage<{ requests: Request[] }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Radiology Requests</h1>
        <Link href="/requests/create">
          <Button>Add Request</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : '-'}
              </TableCell>
              <TableCell>{r.procedureType}</TableCell>
              <TableCell>
                {r.requestedBy ? `${r.requestedBy.firstName} ${r.requestedBy.lastName}` : '-'}
              </TableCell>
              <TableCell>{r.requestDate}</TableCell>
              <TableCell className="capitalize">{r.status}</TableCell>
              <TableCell className="text-right">
                <Link href={`/requests/${r.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
