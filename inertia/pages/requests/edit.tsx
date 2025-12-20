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

              {/* Date */}
              <div className="space-y-1">
                <Label>Request Date</Label>
                <Input
                  type="date"
                  value={data.requestDate}
                  onChange={(e) => setData('requestDate', e.target.value)}
                  aria-errormessage={errors?.requestDate}
                />
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
