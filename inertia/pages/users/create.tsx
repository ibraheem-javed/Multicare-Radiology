import { useForm, Head } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import RolesEnum from '#enums/roles'

type CreateUserProps = {
  roles: typeof RolesEnum
}

export default function CreateUser({ roles }: CreateUserProps) {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 0, // numeric type for enum
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
    post('/users') // updated route
  }

  return (
    <>
      <Head title="Create User" />

      <h1 className="text-xl font-semibold mb-6">Create New User</h1>

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
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
          />
        </div>

        <div>
          <Label>Password</Label>
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

        <Button disabled={processing}>Create User</Button>
      </form>
    </>
  )
}
