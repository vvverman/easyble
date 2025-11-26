import type { ReactNode } from "react"
import prisma from "~/lib/prisma"

import { AppSidebar } from "@/components/app-sidebar"
import { WorkspaceTabs } from "@/components/workspace-tabs"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await prisma.user.findFirst({
    include: {
      projects: {
        include: {
          boards: {
            select: { id: true, title: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  const projects = user?.projects ?? []

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <WorkspaceTabs />
          </div>
        </header>
        <main className="flex h-[calc(100vh-4rem)] flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
