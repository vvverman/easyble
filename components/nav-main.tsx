"use client"

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
        {items.map((item) => (
          <Collapsible
            key={item.url}
            asChild
            defaultOpen={item.isActive}
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
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
