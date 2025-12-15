import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

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

      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Patient</th>
              <th className="p-2">Procedure</th>
              <th className="p-2">Requested By</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">
                  {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : '-'}
                </td>
                <td className="p-2">{r.procedureType}</td>
                <td className="p-2">
                  {r.requestedBy ? `${r.requestedBy.firstName} ${r.requestedBy.lastName}` : '-'}
                </td>
                <td className="p-2">{r.requestDate}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2 text-right">
                  <Link href={`/requests/${r.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
