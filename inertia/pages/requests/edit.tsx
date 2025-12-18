import { usePage, useForm } from '@inertiajs/react'
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

type Patient = {
  id: string
  firstName: string
  lastName: string
}

type Requester = {
  id: string
  name: string
  additionalInformation?: string | null
}

type Request = {
  id: string
  patientId: string
  procedureType: string
  requesterId: string
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
    requesterId: request.requesterId,
    requesterAdditionalInformation: request.requesterAdditionalInformation ?? '',
    requestDate: request.requestDate,
    status: request.status,
  })

  console.log(request)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/requests/${request.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient */}
        <div className="space-y-2">
          <Label>Patient</Label>
          <Select value={data.patientId} onValueChange={(value) => setData('patientId', value)}>
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

        {/* Procedure Type */}
        <div className="space-y-2">
          <Label>Procedure Type</Label>
          <Input
            value={data.procedureType}
            onChange={(e) => setData('procedureType', e.target.value)}
            aria-errormessage={errors?.procedureType}
          />
        </div>

        {/* Requester */}
        <div className="space-y-2">
          <Label>Requested By</Label>
          <Select
            value={data.requesterId}
            onValueChange={(value) => {
              setData('requesterId', value)

              // Find the selected requester from the requesters array
              const selectedRequester = requesters.find((r) => r.id === value)

              // Update the additional info field accordingly
              setData(
                'requesterAdditionalInformation',
                selectedRequester?.additionalInformation ?? ''
              )
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Requester" />
            </SelectTrigger>
            <SelectContent>
              {requesters.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          <Label>Additional Requester Information</Label>
          <Input
            value={data.requesterAdditionalInformation}
            onChange={(e) => setData('requesterAdditionalInformation', e.target.value)}
            placeholder="Optional info"
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
            aria-errormessage={errors?.requesterAdditionalInformation}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={data.status} onValueChange={(value) => setData('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
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
    </div>
  )
}
