import { Head } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import { Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-7xl w-full px-6 py-6 mx-auto">
      <Head title="Multicare" />
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <p className="mt-2">Welcome to Multicare!</p>

      <Link className="flex items-center gap-2" href="/auth/logout" method="post">
        <Settings className="w-4 h-4" />
        <span>Logout</span>
      </Link>
    </div>
  )
}
