import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type Patient = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
}

export default function PatientShowPage() {
  const { patient } = usePage<{ patient: Patient }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {patient.firstName} {patient.lastName}
        </h1>

        <Link href={`/patients/${patient.id}/edit`}>
          <Button>Edit</Button>
        </Link>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>DOB:</strong> {patient.dateOfBirth || '-'}
        </div>
        <div>
          <strong>Gender:</strong> {patient.gender || '-'}
        </div>
        <div>
          <strong>Phone:</strong> {patient.phone || '-'}
        </div>
      </div>
    </div>
  )
}
