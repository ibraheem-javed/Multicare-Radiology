import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

type Patient = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
}
export default function PatientEditPage() {
  const { patient } = usePage<{ patient: Patient }>().props

  // Helper to convert formatted date (Jan 01, 2000) back to ISO format (2000-01-01)
  const convertFormattedDateToISO = (formatted: string | null | undefined): string => {
    if (!formatted) return ''
    try {
      // Handle null or invalid dates
      if (formatted === 'null' || formatted === '-') return ''

      // Try parsing with Date constructor first
      const date = new Date(formatted)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ''
      }

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch (error) {
      console.error('Date conversion error:', error)
      return ''
    }
  }

  const { data, setData, put, errors, processing } = useForm({
    first_name: patient.firstName,
    last_name: patient.lastName,
    date_of_birth: convertFormattedDateToISO(patient.dateOfBirth),
    gender: patient.gender,
    phone: patient.phone,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/patients/${patient.id}`)
  }
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
