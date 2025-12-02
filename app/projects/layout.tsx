import type { ReactNode } from "react"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import prisma from "~/lib/prisma"
import { headers } from "next/headers"
import { auth } from "@/auth"

import { AppSidebar } from "@/components/app-sidebar"
import { WorkspaceTabs } from "@/components/workspace-tabs"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Disable static prerender so database access only happens at request time
export const dynamic = "force-dynamic"

export default async function ProjectsLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user?.id
  if (!userId) {
    redirect("/login")
  }

  const teams = await prisma.team.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "asc" },
  })

  if (teams.length === 0) {
    redirect("/onboarding/team")
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      boards: {
        select: { id: true, title: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  return (
    <SidebarProvider>
      <AppSidebar projects={projects} teams={teams} />
      <SidebarInset>
        <header className="flex h-[40px] shrink-0 items-center gap-2 border-b px-2">
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={null}>
              <WorkspaceTabs projects={projects} teams={teams} />
            </Suspense>
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
