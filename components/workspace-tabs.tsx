"use client"

import { X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "@/lib/utils"

type Tab = {
  href: string
  title: string
}

function baseTitle(pathname: string): string {
  if (pathname === "/projects/new") return "New project"
  if (pathname === "/projects") return "Projects"
  if (pathname.startsWith("/projects/") && pathname.endsWith("/settings")) {
    return "Project settings"
  }
  if (pathname.startsWith("/projects/")) return "Project"
  if (pathname.startsWith("/boards/")) return "Board"
  return pathname
}

export function WorkspaceTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const [tabs, setTabs] = React.useState<Tab[]>([])

  React.useEffect(() => {
    if (!pathname) return

    const title = baseTitle(pathname)

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
    setTabs((prev) => {
      const next = prev.filter((t) => t.href !== href)
      if (href === pathname) {
        const fallback = next[next.length - 1]?.href ?? "/projects/new"
        if (fallback !== pathname) router.push(fallback)
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
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.href}
            value={tab.href}
            className={cn(
              "group inline-flex items-center gap-2 rounded-md px-3 py-1 text-xs",
              "data-[state=active]:bg-background data-[state=active]:shadow-sm",
            )}
          >
            <span className="truncate max-w-[160px]">{tab.title}</span>
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
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
