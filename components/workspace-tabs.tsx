"use client"

import {
  AudioWaveform,
  Briefcase,
  BriefcaseBusiness,
  BriefcaseMedical,
  Cat,
  ClipboardCheck,
  ClipboardList,
  Command,
  Folder,
  FolderKanban,
  FolderOpen,
  Frame,
  GalleryVerticalEnd,
  Layers,
  Rocket,
  SquareDashedKanban,
  SquareKanban,
  Target,
  X,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "@/lib/utils"
import { setWorkspaceTabs, type WorkspaceTab } from "@/lib/workspace-tabs-store"

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

type WorkspaceTabsProps = {
  projects?: Project[]
  teams?: Team[]
}

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

function resolveTitle(pathname: string, projects: Project[]): string {
  if (pathname === "/projects/new") return "New project"
  if (pathname.endsWith("/boards/new")) return "New board"
  if (pathname === "/projects") return "Projects"
  if (pathname.startsWith("/projects/") && pathname.endsWith("/settings")) {
    return "Project settings"
  }

  const boardMatch = pathname.match(/^\/projects\/([^/]+)\/boards\/([^/]+)/)
  if (boardMatch) {
    const [, projectId, boardId] = boardMatch
    const project = projects.find((p) => p.id === projectId)
    const board = project?.boards?.find((b) => b.id === boardId)
    if (board?.title) return board.title
    if (project?.title) return `${project.title} — Board`
    return "Board"
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)/)
  if (projectMatch) {
    const projectId = projectMatch[1]
    const project = projects.find((p) => p.id === projectId)
    if (project?.title) return project.title
    return "Project"
  }

  return pathname
}

function getProjectForHref(href: string, projects: Project[]): Project | undefined {
  const match = href.match(/^\/projects\/([^/]+)/)
  if (!match) return undefined
  const projectId = match[1]
  return projects.find((p) => p.id === projectId)
}

type Tab = { href: string; title: string }

function dedupeTabs(list: Tab[]): Tab[] {
  const seen = new Set<string>()
  const result: Tab[] = []
  for (const tab of list) {
    if (seen.has(tab.href)) continue
    seen.add(tab.href)
    result.push(tab)
  }
  return result
}

export function WorkspaceTabs({ projects = [], teams = [] }: WorkspaceTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [tabs, setTabs] = useState<Tab[]>([])
  const prevPathRef = useRef<string | null>(null)

  const teamFromUrl = searchParams.get("team") || undefined
  const defaultTeamId = teams[0]?.id
  const currentTeamId = teamFromUrl ?? defaultTeamId

  const totalBoardsInTeam = useMemo(() => {
    if (!currentTeamId) return 0
    return projects
      .filter((p) => p.teamId === currentTeamId)
      .reduce((sum, p) => sum + (p.boards?.length ?? 0), 0)
  }, [projects, currentTeamId])

  const onlyBoardPath = useMemo(() => {
    if (!currentTeamId || totalBoardsInTeam !== 1) return null
    const projectWithBoard = projects.find(
      (p) => p.teamId === currentTeamId && (p.boards?.length ?? 0) > 0,
    )
    const board = projectWithBoard?.boards?.[0]
    if (!projectWithBoard || !board) return null
    return `/projects/${projectWithBoard.id}/boards/${board.id}`
  }, [projects, currentTeamId, totalBoardsInTeam])

  useEffect(() => {
    if (!pathname) return

    // Tabs live only under /projects/*
    if (!pathname.startsWith("/projects")) {
      setTabs([])
      setWorkspaceTabs([])
      prevPathRef.current = pathname
      return
    }

    // Overview clears tabs
    if (pathname === "/projects") {
      setTabs([])
      setWorkspaceTabs([])
      prevPathRef.current = pathname
      return
    }

    const title = resolveTitle(pathname, projects)
    const previousPath = prevPathRef.current

    setTabs((current) => {
      let next = [...current]

      // update title if tab already exists
      const existingIdx = next.findIndex((t) => t.href === pathname)
      if (existingIdx !== -1) {
        if (next[existingIdx].title !== title) {
          next[existingIdx] = { ...next[existingIdx], title }
        }
        return dedupeTabs(next)
      }

      // replace temporary "new project" tab after creation
      const newProjectIdx = next.findIndex((t) => t.href === "/projects/new")
      if (newProjectIdx !== -1 && previousPath === "/projects/new") {
        next[newProjectIdx] = { href: pathname, title }
        return dedupeTabs(next)
      }

      // replace temporary "new board" tab after creation
      const newBoardIdx = next.findIndex((t) => t.href.endsWith("/boards/new"))
      if (newBoardIdx !== -1 && previousPath?.endsWith("/boards/new")) {
        next[newBoardIdx] = { href: pathname, title }
        return dedupeTabs(next)
      }

      // otherwise add new unique tab
      next.push({ href: pathname, title })
      return dedupeTabs(next)
    })

    prevPathRef.current = pathname
  }, [pathname, projects])

  useEffect(() => {
    setWorkspaceTabs(tabs as WorkspaceTab[])
  }, [tabs])

  const handleClose = (href: string) => {
    if (onlyBoardPath && href === onlyBoardPath) return

    const fallback =
      href === pathname
        ? (() => {
            const remaining = tabs.filter((t) => t.href !== href)
            if (remaining.length > 0) return remaining[remaining.length - 1].href
            const teamQuery = currentTeamId ? `?team=${currentTeamId}` : ""
            return `/projects${teamQuery}`
          })()
        : null

    setTabs((current) => dedupeTabs(current).filter((t) => t.href !== href))

    if (fallback && fallback !== pathname) {
      router.push(fallback)
    }
  }

  if (!pathname || tabs.length === 0) return null
  if (!pathname.startsWith("/projects")) return null

  return (
    <Tabs
      value={pathname}
      onValueChange={(value) => {
        if (value !== pathname) {
          router.push(value)
        }
      }}
      className="w-full"
    >
      <TabsList className="h-8 gap-1 bg-transparent p-0">
        {tabs.map((tab) => {
          const isSingleBoardLocked = onlyBoardPath && tab.href === onlyBoardPath
          const projectForTab =
            tab.href.startsWith("/projects/") && tab.href.includes("/boards/")
              ? getProjectForHref(tab.href, projects)
              : undefined

          const Icon =
            projectForTab?.icon &&
            ICON_MAP[projectForTab.icon as keyof typeof ICON_MAP]
              ? ICON_MAP[projectForTab.icon as keyof typeof ICON_MAP]
              : projectForTab
                ? Frame
                : undefined

          return (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className={cn(
                "group inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs",
                "data-[state=active]:bg-background data-[state=active]:shadow-sm",
              )}
            >
              {Icon && <Icon className="h-3 w-3" />}
              <span className="max-w-[140px] truncate">{tab.title}</span>
              {!isSingleBoardLocked && (
                <span
                  role="button"
                  aria-label="Close tab"
                  tabIndex={-1}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleClose(tab.href)
                  }}
                  className="inline-flex h-4 w-4 items-center justify-center rounded hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </span>
              )}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
