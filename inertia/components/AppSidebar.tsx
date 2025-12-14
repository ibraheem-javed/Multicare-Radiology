import { Home, Inbox, Search, Settings, Hospital, FileUp } from 'lucide-react'
import { Link } from '@inertiajs/react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    internal: false, // no real page yet
  },
  {
    title: 'Patients',
    url: '/patients',
    icon: Inbox,
    internal: true,
  },

  {
    title: 'Patient Requests',
    url: '/requests',
    icon: Hospital,
    internal: true,
  },
  {
    title: 'Patient Reports',
    url: '/reports',
    icon: Search,
    internal: false, // placeholder
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="px-4">
        <SidebarHeader className="py-4 text-lg font-semibold">Multicare</SidebarHeader>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                {item.internal ? (
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </a>
                )}
              </SidebarMenuButton>
              {/* Add child menu only for Upload Documents */}
              {item.title === 'Upload Documents' && (
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/document-extractions/multi_upload_results"
                        className="flex items-center gap-2 pl-6"
                      >
                        <FileUp className="w-3 h-3" />
                        <span>Pending Documents</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuButton asChild>
          <Link className="flex items-center gap-2" href="/auth/logout" method="post">
            <Settings className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
