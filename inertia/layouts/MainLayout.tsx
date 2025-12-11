import { type PropsWithChildren } from 'react'
import { Toaster } from 'sonner'
import { SidebarProvider, SidebarTrigger } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/AppSidebar'
import FlashMessages from '../shared/FlashMessage'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Toaster richColors position="top-center" />
      <FlashMessages />
      <SidebarProvider>
        <AppSidebar />
        <main className="px-4 py-4 w-full bg-white min-h-screen">
          <SidebarTrigger className="lg:hidden" />

          {children}
        </main>
      </SidebarProvider>
    </>
  )
}
