import { useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type ReportEditPageProps = {
  report: {
    id: string
    findings: string
    impression?: string | null
    reportDate: string
    status: string
    radiologistId?: string | null
  }
  radiologists: { id: string; name: string }[]
}

export default function ReportEditPage() {
  const { report, radiologists } = usePage<ReportEditPageProps>().props

  const { data, setData, put, processing, errors } = useForm({
    findings: report.findings || '',
    impression: report.impression || '',
    reportDate: report.reportDate,
    status: report.status,
    radiologistId: report.radiologistId || '',
  })

  const findingsEditor = useEditor({
    extensions: [StarterKit],
    content: data.findings,
    onUpdate: ({ editor }) => setData('findings', editor.getHTML()),
  })

  const impressionEditor = useEditor({
    extensions: [StarterKit],
    content: data.impression || '<p></p>',
    onUpdate: ({ editor }) => setData('impression', editor.getHTML()),
  })

  useEffect(() => {
    if (findingsEditor && data.findings !== findingsEditor.getHTML()) {
      findingsEditor.commands.setContent(data.findings)
    }
    if (impressionEditor && data.impression !== impressionEditor.getHTML()) {
      impressionEditor.commands.setContent(data.impression || '<p></p>')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findingsEditor, impressionEditor])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/reports/${report.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Report</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Report Date</Label>
            <Input
              type="date"
              value={data.reportDate}
              onChange={(e) => setData('reportDate', e.target.value)}
              aria-errormessage={errors?.reportDate}
            />
          </div>

          <div>
            <Label>Radiologist</Label>
            <select
              className="w-full border rounded px-2 py-1"
              value={data.radiologistId}
              onChange={(e) => setData('radiologistId', e.target.value)}
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
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setData('status', 'final')
              setTimeout(() => {
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
