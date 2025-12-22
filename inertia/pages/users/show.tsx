import { Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'

type Props = {
  user: any
}

export default function ShowUser({ user }: Props) {
  return (
    <>
      <Head title="Multicare - User Details" />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">User Details</h1>

        <Link href={`/users/${user.id}/edit`}>
          <Button>Edit User</Button>
        </Link>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-medium">{user.role?.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Link href="/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>
    </>
  )
}
