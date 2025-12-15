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

type User = {
  id: string
  firstName: string
  lastName: string
}

type Request = {
  id: string
  patient_id: string
  procedure_type: string
  requested_by: string
  request_date: string
  status: string
}

export default function RequestEditPage() {
  const { request, patients, users } = usePage<{
    request: Request
    patients: Patient[]
    users: User[]
  }>().props

  const { data, setData, put, errors, processing } = useForm({
    patient_id: request.patient_id,
    procedure_type: request.procedure_type,
    requested_by: request.requested_by,
    request_date: request.request_date,
    status: request.status,
  })

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
          <Select value={data.patient_id} onValueChange={(value) => setData('patient_id', value)}>
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
            value={data.procedure_type}
            onChange={(e) => setData('procedure_type', e.target.value)}
          />
        </div>

        {/* Requested By */}
        <div className="space-y-2">
          <Label>Requested By</Label>
          <Select
            value={data.requested_by}
            onValueChange={(value) => setData('requested_by', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {users.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Request Date */}
        <div className="space-y-2">
          <Label>Request Date</Label>
          <Input
            type="date"
            value={data.request_date}
            onChange={(e) => setData('request_date', e.target.value)}
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
