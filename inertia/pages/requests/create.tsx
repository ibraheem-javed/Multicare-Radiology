import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'

type Patient = { id: string; firstName: string; lastName: string }
type Requester = { id: string; name: string; additionalInformation?: string | null }

export default function RequestCreatePage() {
  const { patients, requesters } = usePage<{ patients: Patient[]; requesters: Requester[] }>().props

  const { data, setData, post, errors, processing } = useForm({
    patientId: '',
    procedureType: '',
    requesterName: '', // either typed or matched
    requesterId: '', // optional: filled if selected from dropdown
    requesterAdditionalInformation: '', // optional
    requestDate: new Date().toISOString().slice(0, 10),
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
        {/* Patient */}
        <div className="space-y-2">
          <Label>Patient</Label>
          <select
            value={data.patientId}
            onChange={(e) => setData('patientId', e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Select Patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Procedure */}
        <div className="space-y-2">
          <Label>Procedure Type</Label>
          <Input
            placeholder="X-ray, CT, MRI"
            value={data.procedureType}
            onChange={(e) => setData('procedureType', e.target.value)}
            aria-errormessage={errors?.procedureType}
          />
        </div>

        {/* Requester Combobox */}
        <div className="space-y-2">
          <Label>Requester</Label>
          <Input
            list="requesters"
            placeholder="Select or type requester"
            value={data.requesterName}
            onChange={(e) => setData('requesterName', e.target.value)}
            aria-errormessage={errors?.requesterName}
          />
          <datalist id="requesters">
            {requesters.map((r) => (
              <option key={r.id} value={r.name} />
            ))}
          </datalist>
        </div>

        {/* Additional Information */}
        <div className="space-y-2">
          <Label>Additional Information</Label>
          <Input
            placeholder="Optional info"
            value={data.requesterAdditionalInformation}
            onChange={(e) => setData('requesterAdditionalInformation', e.target.value)}
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
            aria-errormessage={errors?.requestDate}
          />
        </div>

        <Button type="submit" disabled={processing}>
          Create Request
        </Button>
      </form>
    </div>
  )
}
