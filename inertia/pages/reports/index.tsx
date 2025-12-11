import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type Report = {
  id: string
  patient: { first_name: string; last_name: string }
  radiologist?: { first_name: string; last_name: string } | null
  report_date: string
  status: string
  findingsPreview: string
}

export default function ReportsIndex() {
  const { reports } = usePage<{ reports: Report[] }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <Link href="/reports/create">
          <Button>Add Report</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Patient</th>
              <th className="p-2">Radiologist</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">
                  {r.patient.first_name} {r.patient.last_name}
                </td>
                <td className="p-2">
                  {r.radiologist ? `${r.radiologist.first_name} ${r.radiologist.last_name}` : '-'}
                </td>
                <td className="p-2">{r.report_date}</td>
                <td className="p-2 capitalize">{r.status}</td>
                <td className="p-2 text-right">
                  <Link href={`/reports/${r.id}`} className="text-blue-600 hover:underline">
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
