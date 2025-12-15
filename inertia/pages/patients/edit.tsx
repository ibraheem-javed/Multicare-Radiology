import { useForm, usePage, Link } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
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
  dateOfBirth?: string | null
  gender?: string | null
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
    gender: patient.gender || '',
    phone: patient.phone || '',
    national_id_type: patient.nationalIdType,
    national_id_number: patient.nationalIdNumber || '',
    address_line: patient.addressLine,
    city: patient.city,
    postal_code: patient.postalCode || '',
    emergency_contact_name: patient.emergencyContactName,
    emergency_contact_phone: patient.emergencyContactPhone,
    allergies: patient.allergies || '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/patients/${patient.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Edit Patient</h1>
        <div className="text-sm text-gray-600">
          MRN: <span className="font-mono font-medium">{patient.medicalRecordNumber}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Basic Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Input
                placeholder="male / female / other"
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Section 2: Identification */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Identification</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>National ID Type</Label>
              <Select
                value={data.national_id_type}
                onValueChange={(value) => setData('national_id_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ID Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNIC">CNIC</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                  <SelectItem value="Health Card">Health Card</SelectItem>
                  <SelectItem value="Driving License">Driving License</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>National ID Number</Label>
              <Input
                placeholder="e.g., 12345-1234567-1"
                value={data.national_id_number}
                onChange={(e) => setData('national_id_number', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Address */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Address</h2>

          <div className="space-y-2">
            <Label>Address Line *</Label>
            <Input
              placeholder="Street address"
              value={data.address_line}
              onChange={(e) => setData('address_line', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City *</Label>
              <Input value={data.city} onChange={(e) => setData('city', e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input
                placeholder="e.g., 54000"
                value={data.postal_code}
                onChange={(e) => setData('postal_code', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contact */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Emergency Contact</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Name *</Label>
              <Input
                placeholder="Full name"
                value={data.emergency_contact_name}
                onChange={(e) => setData('emergency_contact_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Phone *</Label>
              <Input
                placeholder="Phone number"
                value={data.emergency_contact_phone}
                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 5: Medical Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium border-b pb-2">Medical Information</h2>

          <div className="space-y-2">
            <Label>Known Allergies</Label>
            <Textarea
              placeholder="List any known allergies (medications, food, etc.)"
              value={data.allergies}
              onChange={(e) => setData('allergies', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={processing}>
            Update Patient
          </Button>
          <Link href="/patients">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
