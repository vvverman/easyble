"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type Board = {
  id: string
  title: string
}

type Project = {
  id: string
  title: string
  boards?: Board[]
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
}

export function AppSidebar({
  projects,
  ...props
}: {
  projects: Project[]
} & React.ComponentProps<typeof Sidebar>) {
  const navItems = projects.map((project) => {
    const boards = project.boards ?? []

    return {
      title: project.title,
      url: `/projects/${project.id}`,
      icon: Frame,
      isActive: false,
      items: [
        ...boards.map((board) => ({
          title: board.title,
          url: `/projects/${project.id}/boards/${board.id}`,
        })),
        {
          title: "Create board",
          url: `/projects/${project.id}/boards/new`,
        },
      ],
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
