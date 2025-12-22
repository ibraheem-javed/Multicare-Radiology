<<<<<<< Updated upstream
import { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '~/components/ui/calendar'
import { format } from 'date-fns'

type Patient = {
  id: string
  firstName: string
  lastName: string
  pendingRequests: {
    id: string
    procedure: string
  }[]
}

type Radiologist = {
  id: string
  name: string
}

export default function ReportCreatePage() {
  const { patients, radiologists } = usePage<{
    patients: Patient[]
    radiologists: Radiologist[]
  }>().props

  const { data, setData, post, processing, errors } = useForm({
    patientId: '',
    requestId: '',
    radiologistId: '',
    reportDate: new Date().toISOString().slice(0, 10),
    status: 'draft',
    findings: '',
    impression: '',
  })

  const [reportDateOpen, setReportDateOpen] = useState(false)
  const [patientSearch, setPatientSearch] = useState('')
  const [patientDropdownOpen, setPatientDropdownOpen] = useState(false)
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  function handlePatientInput(val: string) {
    setPatientSearch(val)
    setData('patientId', '')
    setData('requestId', '')
    setSelectedPatient(null)
    setPatientDropdownOpen(true)

    const filtered = patients.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(val.toLowerCase())
    )
    setFilteredPatients(filtered)
  }

  function handlePatientSelect(patient: Patient) {
    setPatientSearch(`${patient.firstName} ${patient.lastName}`)
    setData('patientId', patient.id)
    setData('requestId', '')
    setSelectedPatient(patient)
    setPatientDropdownOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/reports')
  }

  return (
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle>Create Report</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Patient (searchable) */}
            <div className="space-y-2 relative">
              <Label>Patient</Label>
              <Input
                placeholder="Select or type patient"
                value={patientSearch}
                onChange={(e) => handlePatientInput(e.target.value)}
                onFocus={() => setPatientDropdownOpen(true)}
                onBlur={() => setTimeout(() => setPatientDropdownOpen(false), 100)}
              />

              {patientDropdownOpen && filteredPatients.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border bg-background shadow z-50">
                  {filteredPatients.map((p) => (
                    <li
                      key={p.id}
                      onMouseDown={() => handlePatientSelect(p)}
                      className="px-3 py-2 cursor-pointer hover:bg-muted"
                    >
                      {p.firstName} {p.lastName}
                    </li>
                  ))}
                </ul>
              )}

              {errors?.patientId && <p className="text-sm text-destructive">{errors.patientId}</p>}
            </div>

            {/* Request (dependent) */}
            <div className="space-y-2">
              <Label>Request</Label>
              <Select
                value={data.requestId}
                onValueChange={(value) => setData('requestId', value)}
                disabled={!selectedPatient}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={selectedPatient ? 'Select request' : 'Select patient first'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedPatient?.pendingRequests.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors?.requestId && <p className="text-sm text-destructive">{errors.requestId}</p>}
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
                        setReportDateOpen(false) // close popover on select
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
              Save Report
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
      </CardContent>
    </Card>
  )
}
=======
import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

type ReportCreatePageProps = {
  requests: {
    id: string
    patient: string
    procedure: string
  }[]
  radiologists: {
    id: string
    name: string
  }[]
}

export default function ReportCreatePage() {
  const { requests, radiologists } = usePage<ReportCreatePageProps>().props

  const { data, setData, post, processing, errors } = useForm({
    requestId: '',
    radiologistId: '',
    reportDate: new Date().toISOString().slice(0, 10),
    status: 'draft',
    findings: '',
    impression: '',
  })

  const findingsEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Enter findings...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => setData('findings', editor.getHTML()),
  })

  const impressionEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Enter impression...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => setData('impression', editor.getHTML()),
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/reports')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Request</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.requestId}
              onChange={(e) => setData('requestId', e.target.value)}
            >
              <option value="">Select request</option>
              {requests.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.patient} — {r.procedure}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Radiologist</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.radiologistId}
              onChange={(e) => setData('radiologistId', e.target.value)}
            >
              <option value="">Select radiologist</option>
              {radiologists.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Report Date</Label>
            <Input
              type="date"
              value={data.reportDate}
              onChange={(e) => setData('reportDate', e.target.value)}
              aria-errormessage={errors?.reportDate}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Findings</Label>
          <div className="border rounded p-2 [&_.tiptap]:min-h-[80px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-gray-400 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none">
            <EditorContent editor={findingsEditor} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Impression</Label>
          <div className="border rounded p-2 [&_.tiptap]:min-h-[80px] [&_.tiptap]:outline-none [&_.tiptap_p.is-editor-empty:first-child::before]:text-gray-400 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none">
            <EditorContent editor={impressionEditor} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={processing}>
            Save Report
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              // set status to final and submit
              setData('status', 'final')
              // small delay to ensure editor onUpdate fired
              setTimeout(() => {
                // submit
                // @ts-ignore
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
>>>>>>> Stashed changes
