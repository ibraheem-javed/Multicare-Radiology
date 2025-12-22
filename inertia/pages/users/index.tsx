import { Link, Head, usePage } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { useMemo, useState } from 'react'

type User = {
  id: string
  firstName: string
  lastName: string | null
  email: string
  role?: { id: number; name: string }
}

export default function UsersIndex() {
  const { users } = usePage<{ users: User[] }>().props
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    if (!search) return users

    const q = search.toLowerCase()

    return users.filter((u) => {
      return (
        u.firstName.toLowerCase().includes(q) ||
        (u.lastName?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q) ||
        u.role?.name.toLowerCase().includes(q)
      )
    })
  }, [users, search])

  return (
    <>
      <Head title="Multicare - Users" />

      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/users/create">
          <Button>Create User</Button>
        </Link>
      </div>

      {/* 🔍 Client-side search */}
      <div className="max-w-sm mb-4">
        <Input
          placeholder="Search name, email, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          {filteredUsers.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {u.firstName} {u.lastName ?? ''}
              </TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{u.role?.name}</TableCell>
              <TableCell>
                <Link href={`/users/${u.id}`} className="text-blue-600">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}

          {filteredUsers.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
