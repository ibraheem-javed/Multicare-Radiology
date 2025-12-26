import { useState } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react'
import { X } from 'lucide-react'
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

type PatientWithActivity = {
  id: string
  firstName: string
  lastName: string
  nationalIdNumber: string | null
  phone: string | null
  medicalRecordNumber: string
  lastActivity: string | null
}

export default function AuditLogs() {
  const { patients } = usePage<{
    patients: PatientWithActivity[]
  }>().props

  const [search, setSearch] = useState('')

  const filteredPatients = patients.filter((patient) => {
    if (!search.trim()) return true

    const searchLower = search.toLowerCase()
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
    const mrn = patient.medicalRecordNumber?.toLowerCase() || ''
    const cnic = patient.nationalIdNumber?.toLowerCase() || ''

    return (
      fullName.includes(searchLower) ||
      mrn.includes(searchLower) ||
      cnic.includes(searchLower)
    )
  })

  const handleClearSearch = () => {
    setSearch('')
  }

  return (
    <>
      <Head title="Audit Logs" />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Audit Logs</h1>
          <div className="text-sm text-gray-600">
            {search.trim()
              ? `Showing ${filteredPatients.length} of ${patients.length} patients`
              : `Total: ${patients.length} patients`}
          </div>
        </div>

        <div className="relative w-1/4">
          <Input
            placeholder="Search by patient name, MRN, or CNIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>CNIC</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>MRN #</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {search.trim() ? `No patients found matching "${search}"` : 'No patients found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {patient.nationalIdNumber || '-'}
                    </TableCell>
                    <TableCell className="text-sm">{patient.phone || '-'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {patient.medicalRecordNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/audit-logs/${patient.id}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
