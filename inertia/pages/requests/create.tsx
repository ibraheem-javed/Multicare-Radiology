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

type Patient = { id: string; firstName: string; lastName: string }
type Requester = { id: string; name: string; additionalInformation?: string | null }

export default function RequestCreatePage() {
  const { patients, requesters } = usePage<{
    patients: Patient[]
    requesters: Requester[]
  }>().props

  const { data, setData, post, errors, processing } = useForm({
    patientId: '',
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
              <Select value={data.patientId} onValueChange={(value) => setData('patientId', value)}>
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
              {errors?.patientId && (
                <p id="roleId-error" className="text-red-400 text-sm">
                  {errors.patientId}
                </p>
              )}
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

            {/* Requester (COMPLEX — untouched logic) */}
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
              <Input
                type="date"
                value={data.requestDate}
                onChange={(e) => setData('requestDate', e.target.value)}
                aria-errormessage={errors?.requestDate}
              />
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
