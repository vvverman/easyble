import { useSyncExternalStore } from "react"

export type WorkspaceTab = { href: string; title: string }

let tabs: WorkspaceTab[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function setWorkspaceTabs(next: WorkspaceTab[]) {
  tabs = next
  emit()
}

export function useWorkspaceTabs() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => tabs,
    () => tabs
  )
}

export function getWorkspaceTabs() {
  return tabs
}
