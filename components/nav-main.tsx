"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, MoreHorizontal, Plus, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { updateProject, deleteProject } from "~/features/projects/actions"
import { updateBoard, deleteBoard } from "~/features/boards/actions"

const STORAGE_KEY = "easyble.sidebar.projects.open"

type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

// убираем query (?team=...) из сегмента
function stripQuery(segment: string | undefined | null): string | null {
  if (!segment) return null
  return segment.split("?")[0] || null
}

function getProjectIdFromUrl(url: string): string | null {
  const parts = url.split("/").filter(Boolean)
  const idx = parts.indexOf("projects")
  if (idx === -1 || idx + 1 >= parts.length) return null
  return stripQuery(parts[idx + 1])
}

function getBoardIdsFromUrl(url: string): { projectId: string | null; boardId: string | null } {
  const parts = url.split("/").filter(Boolean)
  const pIdx = parts.indexOf("projects")
  const bIdx = parts.indexOf("boards")
  const projectId =
    pIdx !== -1 && pIdx + 1 < parts.length ? stripQuery(parts[pIdx + 1]) : null
  const boardId =
    bIdx !== -1 && bIdx + 1 < parts.length ? stripQuery(parts[bIdx + 1]) : null
  return { projectId, boardId }
}

export function NavMain({
  items,
  currentTeamId,
}: {
  items: NavItem[]
  currentTeamId?: string
}) {
  const router = useRouter()
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  const [projectDialog, setProjectDialog] = React.useState<{
    id: string
    title: string
  } | null>(null)

  const [boardDialog, setBoardDialog] = React.useState<{
    id: string
    projectId: string
    title: string
  } | null>(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === "object") {
        setOpenMap(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(openMap))
    } catch {
      // ignore
    }
  }, [openMap])

  const handleOpenChange = (url: string, open: boolean) => {
    setOpenMap((prev) => ({ ...prev, [url]: open }))
  }

  const newProjectUrl = currentTeamId
    ? `/projects/new?team=${currentTeamId}`
    : "/projects/new"

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupAction
          title="New project"
          onClick={() => router.push(newProjectUrl)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">New project</span>
        </SidebarGroupAction>
        <SidebarMenu>
          {items.map((item) => {
            const isOpen = openMap[item.url] ?? true
            const projectId = getProjectIdFromUrl(item.url)

            // есть ли у проекта хотя бы один борд
            const hasBoards =
              item.items?.some((subItem) => !subItem.url.includes("/boards/new")) ??
              false

            return (
              <Collapsible
                key={item.url}
                asChild
                open={isOpen}
                onOpenChange={(open) => handleOpenChange(item.url, open)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="group flex items-center gap-2"
                    >
                      {item.icon && <item.icon />}
                      <span className="flex-1 truncate">{item.title}</span>
                      {projectId && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setProjectDialog({
                              id: projectId,
                              title: item.title,
                            })
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              e.stopPropagation()
                              setProjectDialog({
                                id: projectId,
                                title: item.title,
                              })
                            }
                          }}
                          className="inline-flex h-4 w-4 items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground transition-opacity"
                          aria-label="Edit project"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </span>
                      )}
                      <ChevronRight className="ml-1 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isCreateBoard = subItem.url.includes("/boards/new")
                        const { projectId: pId, boardId } =
                          getBoardIdsFromUrl(subItem.url)

                        return (
                          <SidebarMenuSubItem key={subItem.url}>
                            <SidebarMenuSubButton asChild>
                              {isCreateBoard ? (
                                <Link
                                  href={subItem.url}
                                  className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                                >
                                  <span className="flex h-5 w-5 items-center justify-center rounded border border-dashed border-muted-foreground/60">
                                    <Plus className="h-3 w-3" />
                                  </span>
                                  {/* если бордов ещё нет — показываем текст Create board, иначе только плюс */}
                                  {!hasBoards && (
                                    <span>{subItem.title}</span>
                                  )}
                                </Link>
                              ) : (
                                <div className="flex w-full items-center gap-1 group/board-row">
                                  <Link
                                    href={subItem.url}
                                    className="flex min-w-0 flex-1 items-center text-xs text-foreground"
                                  >
                                    <span className="truncate">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                  {pId && boardId && (
                                    <span
                                      role="button"
                                      tabIndex={0}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setBoardDialog({
                                          id: boardId,
                                          projectId: pId,
                                          title: subItem.title,
                                        })
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          setBoardDialog({
                                            id: boardId,
                                            projectId: pId,
                                            title: subItem.title,
                                          })
                                        }
                                      }}
                                      className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded opacity-0 group-hover/board-row:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground transition-opacity"
                                      aria-label="Edit board"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </span>
                                  )}
                                </div>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>

      {/* Диалог редактирования проекта */}
      <Dialog
        open={projectDialog !== null}
        onOpenChange={(open) => {
          if (!open) setProjectDialog(null)
        }}
      >
        {projectDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <form action={updateProject} className="space-y-3">
                <input
                  type="hidden"
                  name="projectId"
                  value={projectDialog.id}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="project-title"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Project name
                  </label>
                  <Input
                    id="project-title"
                    name="title"
                    defaultValue={projectDialog.title}
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <DialogFooter className="mt-3 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </DialogFooter>
              </form>

              <form action={deleteProject}>
                <input
                  type="hidden"
                  name="projectId"
                  value={projectDialog.id}
                />
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center"
                >
                  Delete project
                </Button>
              </form>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Диалог редактирования доски */}
      <Dialog
        open={boardDialog !== null}
        onOpenChange={(open) => {
          if (!open) setBoardDialog(null)
        }}
      >
        {boardDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <form action={updateBoard} className="space-y-3">
                <input
                  type="hidden"
                  name="boardId"
                  value={boardDialog.id}
                />
                <input
                  type="hidden"
                  name="projectId"
                  value={boardDialog.projectId}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="board-title"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Board name
                  </label>
                  <Input
                    id="board-title"
                    name="title"
                    defaultValue={boardDialog.title}
                    required
                    className="h-8 text-sm"
                  />
                </div>
                <DialogFooter className="mt-3 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </DialogFooter>
              </form>

              <form action={deleteBoard}>
                <input
                  type="hidden"
                  name="boardId"
                  value={boardDialog.id}
                />
                <input
                  type="hidden"
                  name="projectId"
                  value={boardDialog.projectId}
                />
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center"
                >
                  Delete board
                </Button>
              </form>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
