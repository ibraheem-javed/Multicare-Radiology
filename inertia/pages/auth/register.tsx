import { type ReactElement } from 'react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import AuthLayout from '~/layouts/AuthLayout'
import { Link, useForm } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { Head } from '@inertiajs/react'

export default function RegisterPage() {
  const { errors, data, setData, post, processing } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('register')
  }

  return (
    <>
      <Head title="Multicare - Register" />
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Create your Multicare account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            name="first_name"
            type="text"
            placeholder="John"
            aria-errormessage={errors?.first_name}
            value={data.first_name}
            onChange={(e) => setData('first_name', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            name="last_name"
            type="text"
            placeholder="Doe"
            aria-errormessage={errors?.last_name}
            value={data.last_name}
            onChange={(e) => setData('last_name', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            aria-errormessage={errors?.email}
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            aria-errormessage={errors?.password}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            name="confirm"
            type="password"
            placeholder="••••••••"
            value={data.password_confirmation}
            onChange={(e) => setData('password_confirmation', e.target.value)}
            className="border border-gray-300 placeholder:text-gray-500 text-black"
          />
        </div>

        <Button type="submit" className="w-full" disabled={processing}>
          Sign Up
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="../auth/login"
            className={cn(
              'text-blue-600 hover:underline',
              processing && 'pointer-events-none opacity-50'
            )}
          >
            Sign In
          </Link>
        </p>
      </form>
    </>
  )
}

RegisterPage.layout = (page: ReactElement) => <AuthLayout>{page}</AuthLayout>
