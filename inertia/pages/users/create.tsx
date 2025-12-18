import { useForm, Head } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import RolesEnum from '#enums/roles'

type CreateUserProps = {
  roles: typeof RolesEnum
}

export default function CreateUser({ roles }: CreateUserProps) {
  const { data, setData, post, processing, errors } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: 0, // numeric type for enum
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
    post('/users')
  }

  return (
    <>
      <Head title="Create User" />

      <h1 className="text-xl font-semibold mb-6">Create New User</h1>

      <form onSubmit={submit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="firstNname">First Name</Label>
          <Input
            id="firstNname"
            value={data.firstName}
            onChange={(e) => setData('firstName', e.target.value)}
            aria-errormessage={errors?.firstName}
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => setData('lastName', e.target.value)}
            aria-errormessage={errors?.lastName}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            aria-errormessage={errors?.email}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            aria-errormessage={errors?.password}
          />
        </div>

        <div>
          <Label>Role</Label>
          <Select
            value={data.roleId.toString()}
            onValueChange={(value) => setData('roleId', Number(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={processing}>
          Create User
        </Button>
      </form>
    </>
  )
}
