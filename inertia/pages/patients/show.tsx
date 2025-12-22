import { Link, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type Patient = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth?: string | null
  gender?: string | null
  age: string
  phone?: string | null
  medicalRecordNumber: string
  nationalIdType: string
  nationalIdNumber?: string | null
  addressLine: string
  city: string
  postalCode?: string | null
  emergencyContactName: string
  emergencyContactPhone: string
  allergies?: string | null
}

export default function PatientShowPage() {
  const { patient } = usePage<{ patient: Patient }>().props

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            MRN: <span className="font-mono font-medium">{patient.medicalRecordNumber}</span>
          </p>
        </div>

        <Link href={`/patients/${patient.id}/edit`}>
          <Button>Edit</Button>
        </Link>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Date of Birth:</strong> {patient.dateOfBirth || '-'}
          </div>
          <div>
            <strong>Age:</strong> {patient.age || '-'}
          </div>
          <div>
            <strong>Gender:</strong> {patient.gender || '-'}
          </div>
          <div>
            <strong>Phone:</strong> {patient.phone || '-'}
          </div>
        </div>
      </div>

      {/* Identification */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Identification</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>National ID Type:</strong> {patient.nationalIdType}
          </div>
          <div>
            <strong>National ID Number:</strong> {patient.nationalIdNumber || '-'}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Address</h2>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Address:</strong> {patient.addressLine}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>City:</strong> {patient.city}
            </div>
            <div>
              <strong>Postal Code:</strong> {patient.postalCode || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Emergency Contact</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Contact Name:</strong> {patient.emergencyContactName}
          </div>
          <div>
            <strong>Contact Phone:</strong> {patient.emergencyContactPhone}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium border-b pb-2">Medical Information</h2>
        <div className="text-sm">
          <strong>Known Allergies & Medical Conditions:</strong>
          <p className="mt-1 text-gray-700 whitespace-pre-wrap">
            {patient.allergies || 'No known allergies'}
          </p>
        </div>
      </div>
    </div>
  )
}
