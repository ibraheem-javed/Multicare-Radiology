import { useForm, Head } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import RolesEnum from '#enums/roles'

type Props = {
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    role: { id: number; name: string }
  }
  roles: typeof RolesEnum
}

type EditUserForm = {
  first_name: string
  last_name: string
  password: string
  role_id: number
}

export default function EditUser({ user, roles }: Props) {
  const { data, setData, put, processing } = useForm<EditUserForm>({
    first_name: user.firstName,
    last_name: user.lastName ?? '',
    password: '',
    role_id: user.role?.id || 0, // safe fallback
  })

  const roleOptions = [
    { id: roles.ADMIN, label: 'ADMIN' },
    { id: roles.RECEPTION, label: 'RECEPTION' },
    { id: roles.RADIOGRAPHER, label: 'RADIOGRAPHER' },
    { id: roles.RADIOLOGIST, label: 'RADIOLOGIST' },
    { id: roles.MANAGER, label: 'MANAGER' },
  ]

  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(`/users/${user.id}`)
  }

  return (
    <>
      <Head title="Edit User" />

      <h1 className="text-xl font-semibold mb-6">Edit User</h1>

      <form onSubmit={submit} className="space-y-4 max-w-md">
        <div>
          <Label>First Name</Label>
          <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
        </div>

        <div>
          <Label>New Password (optional)</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
          />
        </div>

        <div>
          <Label>Role</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={data.role_id}
            onChange={(e) => setData('role_id', Number(e.target.value))}
          >
            <option value={0}>Select role</option>
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <Button disabled={processing}>Update User</Button>
      </form>
    </>
  )
}
