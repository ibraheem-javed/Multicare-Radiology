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
  const [search, setSearch] = useState('')

  const filteredPatients = useMemo(() => {
    if (!search) return patients

    const q = search.toLowerCase()

    return patients.filter((p) =>
      [p.firstName, p.lastName, p.medicalRecordNumber, p.phone, p.city]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    )
  }, [patients, search])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Patients</h1>

        <Link href="/patients/create">
          <Button>Add Patient</Button>
        </Link>
      </div>

      {/* 🔍 Client-side search */}
      <Input
        placeholder="Search name, MRN, phone, city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MRN</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredPatients.map((p) => (
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
                <Link href={`/patients/${p.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}

          {filteredPatients.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No patients found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
