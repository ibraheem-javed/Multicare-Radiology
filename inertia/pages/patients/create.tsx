import { useForm, Link } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

export default function PatientCreatePage() {
  const { data, setData, post, errors, processing } = useForm({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/patients')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add Patient</h1>

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

        <Button type="submit" disabled={processing}>
          Save
        </Button>
      </form>
    </div>
  )
}
