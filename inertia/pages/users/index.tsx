import { Link, Head, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'

export default function UsersIndex() {
  const { users } = usePage<{ users: any[] }>().props

  return (
    <>
      <Head title="Users" />

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role?.name}</td>
              <td className="p-2 space-x-2">
                <Link href={`/users/${u.id}`} className="text-blue-600">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
