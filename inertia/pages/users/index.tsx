import { Link, Head, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export default function UsersIndex() {
  const { users } = usePage<{ users: any[] }>().props

  return (
    <>
      <Head title="Multicare - Users" />

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {u.firstName} {u.lastName}
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role?.name}</TableCell>
              <TableCell className="space-x-2">
                <Link href={`/users/${u.id}`} className="text-blue-600">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
