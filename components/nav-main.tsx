"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Plus, type LucideIcon } from "lucide-react"
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

const STORAGE_KEY = "easyble.sidebar.projects.open"

export function NavMain({
  items,
  currentTeamId,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  currentTeamId?: string
}) {
  const router = useRouter()
  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  // Загружаем состояние раскрытия проектов из localStorage
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
      // игнорируем ошибки чтения
    }
  }, [])

  // Сохраняем состояние при изменении
  React.useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(openMap))
    } catch {
      // игнорируем ошибки записи
    }
  }, [openMap])

  const handleOpenChange = (url: string, open: boolean) => {
    setOpenMap((prev) => ({ ...prev, [url]: open }))
  }

  const newProjectUrl = currentTeamId
    ? `/projects/new?team=${currentTeamId}`
    : "/projects/new"

  return (
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
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isCreateBoard = subItem.url.includes("/boards/new")

                      return (
                        <SidebarMenuSubItem key={subItem.url}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.url}
                              className={
                                isCreateBoard
                                  ? "flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                                  : undefined
                              }
                            >
                              {isCreateBoard ? (
                                <>
                                  <span className="flex h-5 w-5 items-center justify-center rounded border border-dashed border-muted-foreground/60">
                                    <Plus className="h-3 w-3" />
                                  </span>
                                  <span>{subItem.title}</span>
                                </>
                              ) : (
                                <span>{subItem.title}</span>
                              )}
                            </Link>
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
  )
}
