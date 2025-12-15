import { useForm, Link } from '@inertiajs/react'
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

export default function PatientCreatePage() {
  const { data, setData, post, errors, processing } = useForm({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    medical_record_number: '',
    national_id_type: 'CNIC',
    national_id_number: '',
    address_line: '',
    city: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    allergies: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/patients')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Patient</h1>

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
            Save Patient
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
