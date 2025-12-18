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
  firstName: string
  lastName: string
  password: string
  roleId: number
}

export default function EditUser({ user, roles }: Props) {
  const { data, setData, put, processing, errors } = useForm<EditUserForm>({
    firstName: user.firstName,
    lastName: user.lastName ?? '',
    password: '',
    roleId: user.role?.id || 0, // safe fallback
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
          <Input
            value={data.firstName}
            onChange={(e) => setData('firstName', e.target.value)}
            aria-errormessage={errors?.firstName}
          />
        </div>

        <div>
          <Label>Last Name</Label>
          <Input
            value={data.lastName}
            onChange={(e) => setData('lastName', e.target.value)}
            aria-errormessage={errors?.lastName}
          />
        </div>

        <div>
          <Label>New Password (optional)</Label>
          <Input
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            aria-errormessage={errors?.password}
          />
        </div>

        <div>
          <Label>Role</Label>
          <select
            className="w-full border rounded px-3 py-2"
            value={data.roleId}
            onChange={(e) => setData('roleId', Number(e.target.value))}
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
