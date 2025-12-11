import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

type Patient = {
  id: number
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
}
export default function PatientEditPage() {
  const { patient } = usePage<{ patient: Patient }>().props

  const { data, setData, put, errors, processing } = useForm({
    first_name: patient.firstName,
    last_name: patient.lastName,
    date_of_birth: patient.dateOfBirth
      ? new Date(patient.dateOfBirth).toISOString().split('T')[0]
      : '',
    gender: patient.gender,
    phone: patient.phone,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/patients/${patient.id}`)
  }
  console.log(data.date_of_birth)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Patient</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>First Name</Label>
          <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={data.date_of_birth ?? ''}
            onChange={(e) => setData('date_of_birth', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Input value={data.gender ?? ''} onChange={(e) => setData('gender', e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={data.phone ?? ''} onChange={(e) => setData('phone', e.target.value)} />
        </div>

        <Button type="submit" disabled={processing}>
          Update
        </Button>
      </form>
    </div>
  )
}
