"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  FolderKanban,
  SquareKanban,
  SquareDashedKanban,
  Briefcase,
  BriefcaseBusiness,
  BriefcaseMedical,
  Folder,
  FolderOpen,
  ClipboardList,
  ClipboardCheck,
  Target,
  Rocket,
  Layers,
  Cat,
  PanelLeft,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar"

type Board = {
  id: string
  title: string
}

type Project = {
  id: string
  title: string
  icon?: string
  boards?: Board[]
  teamId?: string | null
}

type Team = {
  id: string
  name: string
}

type AppSidebarProps = {
  projects?: Project[]
  teams?: Team[]
} & React.ComponentProps<typeof Sidebar>

const ICON_MAP = {
  FolderKanban,
  SquareKanban,
  SquareDashedKanban,
  Briefcase,
  BriefcaseBusiness,
  BriefcaseMedical,
  Folder,
  FolderOpen,
  ClipboardList,
  ClipboardCheck,
  Target,
  Rocket,
  Layers,
  Cat,
} as const

const TEAM_ICONS = [GalleryVerticalEnd, AudioWaveform, Command]

function AppSidebarInner({
  projects = [],
  teams = [],
  ...props
}: AppSidebarProps) {
  const { toggleSidebar, state } = useSidebar()
  const searchParams = useSearchParams()
  const teamFromUrl = searchParams?.get("team") || undefined

  const defaultTeamId = teams[0]?.id
  const currentTeamId = teamFromUrl ?? defaultTeamId

  const uiTeams = teams.map((team, index) => ({
    id: team.id,
    name: team.name,
    plan: "Workspace",
    logo: TEAM_ICONS[index % TEAM_ICONS.length],
  }))

  const filteredProjects =
    currentTeamId != null
      ? projects.filter((p) => p.teamId === currentTeamId)
      : projects

  const navItems = filteredProjects.map((project) => {
    const boards = project.boards ?? []
    const Icon =
      (project.icon &&
        ICON_MAP[project.icon as keyof typeof ICON_MAP]) ||
      Frame

    const teamQuery = project.teamId
      ? `?team=${project.teamId}`
      : currentTeamId
        ? `?team=${currentTeamId}`
        : ""

    return {
      title: project.title,
      url: `/projects/${project.id}${teamQuery}`,
      icon: Icon,
      isActive: false,
      items: [
        ...boards.map((board) => ({
          title: board.title,
          url: `/projects/${project.id}/boards/${board.id}${teamQuery}`,
        })),
        {
          title: "Create board",
          url: `/projects/${project.id}/boards/new${teamQuery}`,
        },
      ],
    }
  })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={uiTeams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} currentTeamId={currentTeamId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <button
          type="button"
          onClick={toggleSidebar}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          data-sidebar="footer-trigger"
        >
          <PanelLeft className="h-4 w-4" />
          {state !== "collapsed" && <span>Скрыть меню</span>}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Suspense fallback={null}>
      <AppSidebarInner {...props} />
    </Suspense>
  )
}
