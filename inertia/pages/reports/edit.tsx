import { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { Calendar } from '~/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { format } from 'date-fns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type ReportEditPageProps = {
  report: {
    id: string
    findings: string
    impression?: string | null
    reportDate: string
    status: string
    radiologistId?: string | null
  }
  radiologists: { id: string; name: string }[]
}

export default function ReportEditPage() {
  const { report, radiologists } = usePage<ReportEditPageProps>().props

  const { data, setData, put, processing, errors } = useForm({
    findings: report.findings || '',
    impression: report.impression || '',
    reportDate: report.reportDate,
    status: report.status,
    radiologistId: report.radiologistId || '',
  })

  const [reportDateOpen, setReportDateOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/reports/${report.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Report Date */}
          <div className="space-y-2">
            <Label>Report Date</Label>

            <Popover open={reportDateOpen} onOpenChange={setReportDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !data.reportDate && 'text-muted-foreground'
                  )}
                  aria-invalid={Boolean(errors?.reportDate)}
                  aria-describedby="report-date-error"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.reportDate ? format(new Date(data.reportDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.reportDate ? new Date(data.reportDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setData('reportDate', format(date, 'yyyy-MM-dd'))
                      setReportDateOpen(false)
                    }
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1990, 0)}
                  endMonth={new Date(new Date().getFullYear() + 5, 11)}
                />
              </PopoverContent>
            </Popover>

            {errors?.reportDate && (
              <p id="report-date-error" className="text-sm text-destructive">
                {errors.reportDate}
              </p>
            )}
          </div>

          {/* Radiologist */}
          <div className="space-y-2">
            <Label>Radiologist</Label>
            <Select
              value={data.radiologistId}
              onValueChange={(value) => setData('radiologistId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select radiologist" />
              </SelectTrigger>
              <SelectContent>
                {radiologists.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Findings */}
        <div className="space-y-2">
          <Label>Findings</Label>
          <Textarea
            placeholder="Enter findings..."
            value={data.findings}
            onChange={(e) => setData('findings', e.target.value)}
            rows={5}
            aria-errormessage={errors?.findings}
          />
        </div>

        {/* Impression */}
        <div className="space-y-2">
          <Label>Impression</Label>
          <Textarea
            placeholder="Enter impression..."
            value={data.impression}
            onChange={(e) => setData('impression', e.target.value)}
            rows={5}
            aria-errormessage={errors?.impression}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" disabled={processing}>
            Save
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setData('status', 'final')
              setTimeout(() => {
                document
                  .querySelector('form')
                  ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
              }, 50)
            }}
          >
            Save & Finalize
          </Button>
        </div>
      </form>
    </div>
  )
}
