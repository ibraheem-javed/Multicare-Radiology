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

type Report = {
  id: string
  patient: { firstName: string; lastName: string } | null
  radiologist?: { firstName: string; lastName: string } | null
  reportDate: string
  status: string
  findingsPreview: string
}

export default function ReportsIndex() {
  const { reports } = usePage<{ reports: Report[] }>().props
  const [search, setSearch] = useState('')

  const filteredReports = useMemo(() => {
    if (!search) return reports

    const q = search.toLowerCase()

    return reports.filter((r) =>
      [
        r.patient?.firstName,
        r.patient?.lastName,
        r.radiologist?.firstName,
        r.radiologist?.lastName,
        r.status,
        r.reportDate,
        r.findingsPreview,
      ]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    )
  }, [reports, search])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Link href="/reports/create">
          <Button>Add Report</Button>
        </Link>
      </div>

      {/* 🔍 Client-side search */}
      <Input
        placeholder="Search patient, radiologist, status, findings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Radiologist</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredReports.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                {r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : '-'}
              </TableCell>
              <TableCell>
                {r.radiologist ? `${r.radiologist.firstName} ${r.radiologist.lastName}` : '-'}
              </TableCell>
              <TableCell>{r.reportDate}</TableCell>
              <TableCell className="capitalize">{r.status}</TableCell>
              <TableCell className="text-right">
                <Link href={`/reports/${r.id}`}>
                  <Button size="sm">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}

          {filteredReports.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No reports found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
