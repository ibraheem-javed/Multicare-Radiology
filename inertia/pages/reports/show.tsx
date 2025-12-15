import { usePage, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type ReportShowPageProps = {
  report: {
    id: string
    findings: string
    impression?: string | null
    reportDate: string
    status: string
    patient: { firstName: string; lastName: string }
    radiologist?: { firstName: string; lastName: string } | null
    request?: { procedureType: string } | null
  }
}

export default function ReportShowPage() {
  const { report } = usePage<ReportShowPageProps>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Report</h1>

        <div className="flex gap-2">
          <Link href={`/reports/${report.id}/edit`}>
            <Button>Edit</Button>
          </Link>

          {report.status === 'final' && (
            <Link href={`/reports/${report.id}/print`} method="get">
              <Button variant="outline">Print</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>Patient:</strong> {report.patient.firstName} {report.patient.lastName}
        </div>

        <div>
          <strong>Radiologist:</strong>{' '}
          {report.radiologist
            ? `${report.radiologist.firstName} ${report.radiologist.lastName}`
            : '-'}
        </div>

        <div>
          <strong>Date:</strong> {report.reportDate}
        </div>

        <div>
          <strong>Status:</strong> {report.status}
        </div>
      </div>

      <hr />

      <div>
        <h2 className="text-lg font-medium">Findings</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.findings }} />
      </div>

      <div>
        <h2 className="text-lg font-medium">Impression</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: report.impression || '' }}
        />
      </div>
    </div>
  )
}
