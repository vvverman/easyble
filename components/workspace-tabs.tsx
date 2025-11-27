"use client"

import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "@/lib/utils"

type Board = {
  id: string
  title: string
}

type Project = {
  id: string
  title: string
  boards?: Board[]
  teamId?: string | null
}

type Team = {
  id: string
  name: string
}

type Tab = {
  href: string
  title: string
}

type WorkspaceTabsProps = {
  projects?: Project[]
  teams?: Team[]
}

function baseTitle(pathname: string): string {
  if (pathname === "/projects/new") return "New project"
  if (pathname === "/projects") return "Projects"
  if (pathname.startsWith("/projects/") && pathname.endsWith("/settings")) {
    return "Project settings"
  }
  if (pathname.startsWith("/projects/") && pathname.includes("/boards/")) {
    return "Board"
  }
  if (pathname.startsWith("/projects/")) return "Project"
  if (pathname.startsWith("/boards/")) return "Board"
  return pathname
}

export function WorkspaceTabs({ projects = [], teams = [] }: WorkspaceTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tabs, setTabs] = React.useState<Tab[]>([])

  const teamFromUrl = searchParams.get("team") || undefined
  const defaultTeamId = teams[0]?.id
  const currentTeamId = teamFromUrl ?? defaultTeamId

  const totalBoardsInTeam = React.useMemo(() => {
    if (!currentTeamId) return 0
    return projects
      .filter((p) => p.teamId === currentTeamId)
      .reduce(
        (sum, p) => sum + (p.boards?.length ?? 0),
        0,
      )
  }, [projects, currentTeamId])

  const onlyBoardPath = React.useMemo(() => {
    if (!currentTeamId || totalBoardsInTeam !== 1) return null

    const projectWithBoard = projects.find(
      (p) => p.teamId === currentTeamId && (p.boards?.length ?? 0) > 0,
    )
    const board = projectWithBoard?.boards?.[0]

    if (!projectWithBoard || !board) return null

    return `/projects/${projectWithBoard.id}/boards/${board.id}`
  }, [projects, currentTeamId, totalBoardsInTeam])

  React.useEffect(() => {
    if (!pathname) return

    // Обзорная страница проектов не должна иметь вкладку
    if (pathname === "/projects") {
      setTabs([])
      return
    }

    let title = baseTitle(pathname)

    // Для страниц бордов используем реальное название борда из document.title
    if (
      pathname.startsWith("/projects/") &&
      pathname.includes("/boards/")
    ) {
      if (typeof document !== "undefined") {
        const docTitle = document.title.trim()
        if (docTitle) {
          const full = docTitle
          title = full.length > 20 ? full.slice(0, 20) + "…" : full
        }
      }
    }

    setTabs((prev) => {
      const existing = prev.find((t) => t.href === pathname)

      const fromNew = prev.find((t) => t.href === "/projects/new")
      const isProject =
        pathname.startsWith("/projects/") && pathname !== "/projects/new"

      if (!existing && fromNew && isProject) {
        return prev.map((t) =>
          t.href === "/projects/new" ? { href: pathname, title } : t,
        )
      }

      if (existing) {
        if (existing.title === title) return prev
        return prev.map((t) =>
          t.href === pathname ? { ...t, title } : t,
        )
      }

      return [...prev, { href: pathname, title }]
    })
  }, [pathname])

  const closeTab = (href: string) => {
    // Если в текущей команде только один борд и это он — не даём закрыть вкладку
    if (onlyBoardPath && href === onlyBoardPath) {
      return
    }

    setTabs((prev) => {
      const next = prev.filter((t) => t.href !== href)

      if (href === pathname) {
        const teamFromUrlInner = searchParams.get("team") || undefined
        const defaultTeamIdInner = teams[0]?.id
        const currentTeamIdInner = teamFromUrlInner ?? defaultTeamIdInner

        let fallback: string | undefined

        if (next.length > 0) {
          fallback = next[next.length - 1]?.href
        } else {
          // Нет вкладок: кидаем на обзорную страницу проектов текущей команды
          const teamQuery = currentTeamIdInner ? `?team=${currentTeamIdInner}` : ""
          fallback = `/projects${teamQuery}`
        }

        if (fallback && fallback !== pathname) {
          router.push(fallback)
        }
      }

      return next
    })
  }

  if (!pathname || tabs.length === 0) return null

  return (
    <Tabs
      value={pathname}
      onValueChange={(value) => router.push(value)}
      className="w-full"
    >
      <TabsList className="h-8 gap-1 bg-transparent p-0">
        {tabs.map((tab) => {
          const isSingleBoardLocked =
            onlyBoardPath && tab.href === onlyBoardPath

          return (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              className={cn(
                "group inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs",
                "data-[state=active]:bg-background data-[state=active]:shadow-sm",
              )}
            >
              <span className="truncate max-w-[160px]">{tab.title}</span>
              {!isSingleBoardLocked && (
                <span
                  role="button"
                  aria-label="Close tab"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.href)
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
