import { Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

type Props = {
  user: any
}

export default function ShowUser({ user }: Props) {
  return (
    <>
      <Head title="User Details" />

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">User Details</h1>

        <Link href={`/users/${user.id}/edit`}>
          <Button>Edit User</Button>
        </Link>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium">{user.role?.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Created At</p>
          <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="font-medium">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    </>
  )
}
