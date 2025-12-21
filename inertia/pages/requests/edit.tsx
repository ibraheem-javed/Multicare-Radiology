import { useState } from 'react'
import { usePage, useForm, Head } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '~/components/ui/calendar'
import { format } from 'date-fns'

type Patient = { id: string; firstName: string; lastName: string }
type Requester = { id: string; name: string; additionalInformation?: string | null }
type Request = {
  id: string
  patientId: string
  procedureType: string
  requesterId: string | null
  requesterName?: string
  requesterAdditionalInformation?: string | null
  requestDate: string
  status: string
}

export default function RequestEditPage() {
  const [dateOpen, setDateOpen] = useState(false)

  const { request, patients, requesters } = usePage<{
    request: Request
    patients: Patient[]
    requesters: Requester[]
  }>().props

  const { data, setData, put, errors, processing } = useForm({
    patientId: request.patientId,
    procedureType: request.procedureType,
    requesterId: request.requesterId ?? null,
    requesterName: request.requesterName ?? '',
    requesterAdditionalInformation: request.requesterAdditionalInformation ?? '',
    requestDate: request.requestDate,
    status: request.status,
  })

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [filteredRequesters, setFilteredRequesters] = useState<Requester[]>(requesters)

  function handleRequesterInput(val: string) {
    setData('requesterName', val)
    setData('requesterId', null)
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
    put(`/requests/${request.id}`)
  }

  return (
    <>
      <Head title="Multicare - Edit Request" />

      <div className="max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Edit Request</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Patient */}
              <div className="space-y-1">
                <Label>Patient</Label>
                <Select
                  value={data.patientId}
                  onValueChange={(value) => setData('patientId', value)}
                >
                  <SelectTrigger>
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
              </div>

              {/* Procedure */}
              <div className="space-y-1">
                <Label>Procedure Type</Label>
                <Input
                  value={data.procedureType}
                  onChange={(e) => setData('procedureType', e.target.value)}
                  aria-errormessage={errors?.procedureType}
                />
              </div>

              {/* Requester (CUSTOM — untouched logic) */}
              <div className="space-y-1 relative">
                <Label>Requester</Label>
                <Input
                  placeholder="Select or type requester"
                  value={data.requesterName}
                  onChange={(e) => handleRequesterInput(e.target.value)}
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
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

              {/* Additional Info */}
              <div className="space-y-1">
                <Label>Additional Requester Information</Label>
                <Input
                  value={data.requesterAdditionalInformation || ''}
                  onChange={(e) => setData('requesterAdditionalInformation', e.target.value)}
                  placeholder="Optional info"
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
                          setDateOpen(false) // ✅ close on select
                        }
                      }}
                      captionLayout="dropdown"
                      startMonth={new Date(1990, 0)}
                      endMonth={new Date(new Date().getFullYear() + 5, 11)}
                    />
                  </PopoverContent>
                </Popover>

                {errors?.requestDate && (
                  <p id="request-date-error" className="text-sm text-destructive">
                    {errors.requestDate}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={processing}>
                Update Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
