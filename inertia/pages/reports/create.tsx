import { useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type ReportCreatePageProps = {
  requests: {
    id: string
    patient: string
    procedure: string
  }[]
  radiologists: {
    id: string
    name: string
  }[]
}

export default function ReportCreatePage() {
  const { requests, radiologists } = usePage<ReportCreatePageProps>().props

  const { data, setData, post, processing } = useForm({
    request_id: '',
    radiologist_id: '',
    report_date: new Date().toISOString().slice(0, 10),
    status: 'draft',
    findings: '',
    impression: '',
  })

  const findingsEditor = useEditor({
    extensions: [StarterKit],
    content: '<p>Findings...</p>',
    onUpdate: ({ editor }) => setData('findings', editor.getHTML()),
  })

  const impressionEditor = useEditor({
    extensions: [StarterKit],
    content: '<p>Impression...</p>',
    onUpdate: ({ editor }) => setData('impression', editor.getHTML()),
  })

  useEffect(() => {
    // initialize data with editor HTMLs
    if (findingsEditor) setData('findings', findingsEditor.getHTML())
    if (impressionEditor) setData('impression', impressionEditor.getHTML())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findingsEditor, impressionEditor])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/reports')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Create Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Request</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.request_id}
              onChange={(e) => setData('request_id', e.target.value)}
            >
              <option value="">Select request</option>
              {requests.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.patient} — {r.procedure}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Radiologist</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.radiologist_id}
              onChange={(e) => setData('radiologist_id', e.target.value)}
            >
              <option value="">Select radiologist</option>
              {radiologists.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Report Date</Label>
            <Input
              type="date"
              value={data.report_date}
              onChange={(e) => setData('report_date', e.target.value)}
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.status}
              onChange={(e) => setData('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Findings</Label>
          <div className="border rounded p-2">
            <EditorContent editor={findingsEditor} />
          </div>
        </div>

        <div>
          <Label>Impression</Label>
          <div className="border rounded p-2">
            <EditorContent editor={impressionEditor} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={processing}>
            Save Report
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              // set status to final and submit
              setData('status', 'final')
              // small delay to ensure editor onUpdate fired
              setTimeout(() => {
                // submit
                // @ts-ignore
                document
                  .querySelector('form')
                  ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
              }, 50)
            }}
          >
            Save & Finalize
          </Button>
        </div>
      </form>
    </div>
  )
}
