import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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

export default function RequestCreatePage() {
  const { patients, users } = usePage<{ patients: Patient[]; users: User[] }>().props

  const { data, setData, post, errors, processing } = useForm({
    patient_id: '',
    procedure_type: '',
    requested_by: '',
    request_date: new Date().toISOString().slice(0, 10),
    status: 'pending',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/requests')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Radiology Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="space-y-2">
          <Label>Procedure Type</Label>
          <Input
            placeholder="X-ray, CT, MRI"
            value={data.procedure_type}
            onChange={(e) => setData('procedure_type', e.target.value)}
          />
        </div>

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

        <div className="space-y-2">
          <Label>Request Date</Label>
          <Input
            type="date"
            value={data.request_date}
            onChange={(e) => setData('request_date', e.target.value)}
          />
        </div>

        <Button type="submit" disabled={processing}>
          Create Request
        </Button>
      </form>
    </div>
  )
}
