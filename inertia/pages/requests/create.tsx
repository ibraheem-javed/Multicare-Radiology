import { useState } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'

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
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '~/components/ui/calendar'
import { format } from 'date-fns'

type Patient = { id: string; firstName: string; lastName: string }
type Requester = { id: string; name: string; additionalInformation?: string | null }

export default function RequestCreatePage() {
  const [dateOpen, setDateOpen] = useState(false)

  const { patients, requesters, preselectedPatientId } = usePage<{
    patients: Patient[]
    requesters: Requester[]
    preselectedPatientId?: string | null
  }>().props

  // Initialize form with preselected patient if provided
  const { data, setData, post, errors, processing } = useForm({
    patientId: preselectedPatientId ?? '',
    procedureType: '',
    requesterName: '',
    requesterId: '',
    requesterAdditionalInformation: '',
    requestDate: new Date().toISOString().slice(0, 10),
    status: 'pending',
  })

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [filteredRequesters, setFilteredRequesters] = useState<Requester[]>(requesters)

  function handleRequesterInput(val: string) {
    setData('requesterName', val)
    setData('requesterId', '') // CRITICAL: unchanged
    setDropdownOpen(true)

    const filtered = requesters.filter((r) => r.name.toLowerCase().includes(val.toLowerCase()))
    setFilteredRequesters(filtered)
  }

  function handleRequesterSelect(r: Requester) {
    setData('requesterName', r.name)
    setData('requesterId', r.id)
    setData('requesterAdditionalInformation', r.additionalInformation || '')
    setDropdownOpen(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/requests')
  }

  return (
    <>
      <Head title="Multicare - Create New Request" />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>New Radiology Request</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient */}
            <div className="space-y-2">
              <Label>Patient</Label>
              <Select
                value={data.patientId}
                onValueChange={(value) => {
                  // Only allow changing if there is no preselected patient
                  if (!preselectedPatientId) {
                    setData('patientId', value)
                  }
                }}
                disabled={Boolean(preselectedPatientId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>

                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.firstName} {p.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {preselectedPatientId && (
                <p className="text-xs text-muted-foreground">
                  Patient selected from patient creation
                </p>
              )}

              {errors?.patientId && <p className="text-red-400 text-sm">{errors.patientId}</p>}
            </div>

            {/* Procedure */}
            <div className="space-y-2">
              <Label>Procedure Type</Label>
              <Input
                placeholder="X-ray, CT, MRI"
                value={data.procedureType}
                onChange={(e) => setData('procedureType', e.target.value)}
                aria-errormessage={errors?.procedureType}
              />
            </div>

            {/* Requester */}
            <div className="space-y-2 relative">
              <Label>Requester</Label>
              <Input
                placeholder="Select or type requester"
                value={data.requesterName}
                onChange={(e) => handleRequesterInput(e.target.value)}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
                className="cursor-text"
                aria-errormessage={errors?.requesterName}
              />

              {dropdownOpen && filteredRequesters.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto rounded-md border bg-background shadow z-50">
                  {filteredRequesters.map((r) => (
                    <li
                      key={r.id}
                      onMouseDown={() => handleRequesterSelect(r)}
                      className="px-3 py-2 cursor-pointer hover:bg-muted"
                    >
                      {r.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <Label>Additional Information</Label>
              <Input
                placeholder="Optional info"
                value={data.requesterAdditionalInformation}
                onChange={(e) => setData('requesterAdditionalInformation', e.target.value)}
                aria-errormessage={errors?.requesterAdditionalInformation}
              />
            </div>

            {/* Request Date */}
            <div className="space-y-2">
              <Label>Request Date</Label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !data.requestDate && 'text-muted-foreground'
                    )}
                    aria-invalid={Boolean(errors?.requestDate)}
                    aria-describedby="request-date-error"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.requestDate ? format(new Date(data.requestDate), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={data.requestDate ? new Date(data.requestDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setData('requestDate', format(date, 'yyyy-MM-dd'))
                        setDateOpen(false)
                      }
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(1990, 0)}
                    endMonth={new Date(new Date().getFullYear() + 5, 11)}
                  />
                </PopoverContent>
              </Popover>

              {errors?.requestDate && (
                <p className="text-sm text-destructive">{errors.requestDate}</p>
              )}
            </div>

            <Button type="submit" disabled={processing}>
              Create Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
