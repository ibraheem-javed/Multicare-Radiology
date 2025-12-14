import { Head, router } from '@inertiajs/react'
import { Settings } from 'lucide-react'

export default function Home() {
  function handleLogout(e: React.FormEvent) {
    e.preventDefault()

    router.post(
      '/auth/logout',
      {},
      {
        replace: true,
        preserveScroll: false,
        preserveState: false,
      }
    )
  }

  return (
    <div className="max-w-7xl w-full px-6 py-6 mx-auto">
      <Head title="Multicare" />

      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      <p className="mt-2">Welcome to Multicare!</p>

      <form onSubmit={handleLogout} className="mt-6">
        <button className="flex items-center gap-2 text-red-600 hover:underline">
          <Settings className="w-4 h-4" />
          Logout
        </button>
      </form>
    </div>
  )
}
