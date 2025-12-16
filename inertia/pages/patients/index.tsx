import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'

type Patient = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
  medicalRecordNumber: string
  city: string
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MRN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {patients.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <span className="font-mono text-xs">{p.medicalRecordNumber}</span>
              </TableCell>
              <TableCell>
                {p.firstName} {p.lastName}
              </TableCell>
              <TableCell>{p.dateOfBirth || '-'}</TableCell>
              <TableCell className="capitalize">{p.gender || '-'}</TableCell>
              <TableCell>{p.city}</TableCell>
              <TableCell>{p.phone || '-'}</TableCell>
              <TableCell className="text-right">
                <Link href={`/patients/${p.id}`} className="text-blue-600 hover:underline">
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
