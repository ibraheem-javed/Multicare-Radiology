import { useForm, Head } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import RolesEnum from '#enums/roles'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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
  email: string
  passwordConfirmation: string
  roleId: number
}

export default function EditUser({ user, roles }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { data, setData, put, processing, errors } = useForm<EditUserForm>({
    firstName: user.firstName,
    lastName: user.lastName ?? '',
    password: '',
    email: user.email,
    passwordConfirmation: '',
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
      <Head title="Multicare - Edit User" />

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
          <Label>Email Address</Label>
          <Input
            value={data.email}
            readOnly
            className="bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors?.password && <div className="text-red-400 text-sm">{errors.password}</div>}
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={data.passwordConfirmation}
              onChange={(e) => setData('passwordConfirmation', e.target.value)}
              aria-errormessage={errors?.passwordConfirmation}
              className="pr-10"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors?.passwordConfirmation && (
            <div className="text-red-400 text-sm">{errors.passwordConfirmation}</div>
          )}
        </div>

        <div className="space-y-1">
          <Label>Role</Label>

          <Select
            value={data.roleId ? data.roleId.toString() : ''}
            onValueChange={(value) => setData('roleId', Number(value))}
          >
            <SelectTrigger
              className={`w-full ${errors?.roleId ? 'border-red-400 focus:ring-red-400' : ''}`}
              aria-invalid={!!errors?.roleId}
              aria-describedby={errors?.roleId ? 'roleId-error' : undefined}
            >
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

          {errors?.roleId && (
            <p id="roleId-error" className="text-red-400 text-sm">
              {errors.roleId}
            </p>
          )}
        </div>

        <Button disabled={processing}>Update User</Button>
      </form>
    </>
  )
}
