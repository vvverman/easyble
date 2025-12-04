"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, Cog } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { updateTeam, deleteTeam } from "~/features/teams/actions"

type Team = {
  id: string
  name: string
  logo: React.ElementType
  plan: string
}

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [teamDialog, setTeamDialog] = React.useState<Team | null>(null)

  const goToNewTeam = () => {
    router.push("/onboarding/team")
  }

  if (!teams || teams.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="justify-between"
            onClick={goToNewTeam}
          >
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Plus className="size-4" />
              </div>
              <div className="grid text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Create team
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Start by creating your first workspace
                </span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const currentTeamId = searchParams?.get("team")
  const activeTeam =
    teams.find((t) => t.id === currentTeamId) ?? teams[0]

  const setTeam = (teamId: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("team", teamId)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <activeTeam.logo className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeTeam.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {activeTeam.plan}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setTeam(team.id)}
                  className="flex items-center gap-2 p-2"
                >
                  <Check
                    className={cn(
                      "size-4",
                      activeTeam.id === team.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <team.logo className="size-4 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{team.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setTeamDialog(team)
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Настройки команды"
                  >
                    <Cog className="size-4" />
                  </button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={goToNewTeam}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Add team</span>
                  <span className="text-xs text-muted-foreground">
                    Create a new team
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Диалог редактирования команды */}
      <Dialog
        open={teamDialog !== null}
        onOpenChange={(open) => {
          if (!open) setTeamDialog(null)
        }}
      >
        {teamDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Team settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <form
                action={async (formData: FormData) => {
                  await updateTeam(formData)
                  setTeamDialog(null)
                }}
                className="space-y-3"
              >
                <input
                  type="hidden"
                  name="teamId"
                  value={teamDialog.id}
                />
                <div className="space-y-1">
                  <label
                    htmlFor="team-name"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Team name
                  </label>
                  <Input
                    id="team-name"
                    name="name"
                    defaultValue={teamDialog.name}
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

              <form
                action={async (formData: FormData) => {
                  await deleteTeam(formData)
                  setTeamDialog(null)
                }}
              >
                <input
                  type="hidden"
                  name="teamId"
                  value={teamDialog.id}
                />
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center"
                >
                  Delete team
                </Button>
              </form>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
