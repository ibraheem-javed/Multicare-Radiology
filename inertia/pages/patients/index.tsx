import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type Patient = {
  id: number
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
}

export default function PatientsIndex() {
  const { patients } = usePage<{ patients: Patient[] }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Patients</h1>

        <Link href="/patients/create">
          <Button>Add Patient</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Phone</th>
              <th className="p-2"></th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">
                  {p.firstName} {p.lastName}
                </td>
                <td className="p-2">{p.dateOfBirth || '-'}</td>
                <td className="p-2 capitalize">{p.gender || '-'}</td>
                <td className="p-2">{p.phone || '-'}</td>
                <td className="p-2 text-right">
                  <Link href={`/patients/${p.id}`} className="text-blue-600 hover:underline">
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
