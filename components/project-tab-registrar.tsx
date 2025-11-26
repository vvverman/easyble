"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ProjectTabRegistrar({ title }: { title: string }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    window.dispatchEvent(
      new CustomEvent("workspace-tab:register", {
        detail: { href: pathname, title },
      }),
    )
  }, [pathname, title])

  return null
}
