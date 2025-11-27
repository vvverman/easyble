"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <Breadcrumb className="mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your appearance and preferences.
        </p>
      </div>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div>
          <h2 className="text-sm font-medium">Theme</h2>
          <p className="text-xs text-muted-foreground">
            Choose how Easyble looks on this device.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition ${
              theme === "light"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition ${
              theme === "dark"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            Dark
          </button>
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition ${
              theme === "system"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            System
          </button>
        </div>
      </section>
    </div>
  )
}
