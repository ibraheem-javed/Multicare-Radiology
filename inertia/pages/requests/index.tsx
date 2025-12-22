import { Link, usePage } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Head } from '@inertiajs/react'

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

export default function RequestsIndex() {
  const { requests } = usePage<{ requests: Request[] }>().props
  const [search, setSearch] = useState('')

  const filteredRequests = useMemo(() => {
    if (!search) return requests

    const q = search.toLowerCase()

    return requests.filter((r) =>
      [
        r.procedureType,
        r.status,
        r.requestDate,
        r.patient?.firstName,
        r.patient?.lastName,
        r.requester?.name,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    )
  }, [requests, search])

  return (
    <>
      <Head title="Multicare - Radiology Requests" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Radiology Requests</h1>

          <Link href="/requests/create">
            <Button>Add Request</Button>
          </Link>
        </div>

        {/* 🔍 Client-side search */}
        <Input
          placeholder="Search patient, procedure, requester, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Procedure</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRequests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : '-'}
                </TableCell>
                <TableCell>{r.procedureType}</TableCell>
                <TableCell>{r.requester?.name || '-'}</TableCell>
                <TableCell>{r.requestDate}</TableCell>
                <TableCell className="capitalize">{r.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/requests/${r.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
