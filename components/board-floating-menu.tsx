"use client"

import React from "react"
import Image from "next/image"
import { KanbanSquare, List, GanttChart, Calendar, Settings } from "lucide-react"
import { AvatarGroup } from "@/components/animate-ui/components/animate/avatar-group"
import { SendBoardInviteForm } from "@/components/send-board-invite-form"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

type ViewMode = "kanban" | "gantt" | "list" | "calendar"

export function BoardFloatingMenu({
  avatars,
  boardId,
  projectId,
  activeView = "kanban",
  onChangeView,
  onOpenSettings,
  onOpenEasyble,
  onOpenMyTasks,
}: {
  avatars: React.ReactNode[]
  boardId: string
  projectId: string
  activeView?: ViewMode
  onChangeView?: (view: ViewMode) => void
  onOpenSettings?: () => void
  onOpenEasyble?: () => void
  onOpenMyTasks?: () => void
}) {
  const avatarItems = Array.isArray(avatars) ? avatars : [avatars]
  const groupChildren = [
    <SendBoardInviteForm key="invite-btn" boardId={boardId} />,
    ...avatarItems.map((node, idx) => <React.Fragment key={idx}>{node}</React.Fragment>),
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-3">
      <TooltipProvider>
        <div className="flex h-14 items-center gap-3 rounded-full bg-white/10 px-4 text-white shadow-2xl backdrop-blur-lg">
          <AvatarGroup className="!h-auto !-space-x-2">{groupChildren}</AvatarGroup>
          <span className="h-6 w-px bg-white/15" aria-hidden />
          <div className="flex items-center gap-3 text-white/70">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`transition hover:scale-110 ${activeView === "kanban" ? "text-white" : "text-white/60"}`}
                  aria-label="Kanban view"
                  onClick={() => onChangeView?.("kanban")}
                >
                  <KanbanSquare className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Канбан</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`transition hover:scale-110 ${activeView === "list" ? "text-white" : "text-white/60"}`}
                  aria-label="List view"
                  onClick={() => onOpenMyTasks ? onOpenMyTasks() : onChangeView?.("list")}
                >
                  <List className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{onOpenMyTasks ? "Мои задачи" : "Таблица"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={`transition hover:scale-110 ${activeView === "gantt" ? "text-white" : "text-white/60"}`}
                  aria-label="Gantt view"
                  onClick={() => onChangeView?.("gantt")}
                >
                  <GanttChart className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Гантт</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-white/60 transition hover:scale-110 hover:text-white"
                  aria-label="Calendar view"
                  onClick={() => onChangeView?.("calendar")}
                >
                  <Calendar className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Календарь</TooltipContent>
            </Tooltip>
          </div>
          <span className="h-6 w-px bg-white/15" aria-hidden />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onOpenSettings?.()}
                className="text-white/60 transition hover:scale-110 hover:text-white"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Настройки</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      <button
        type="button"
        aria-label="Easyble"
        onClick={() => onOpenEasyble?.()}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#E83344,#F55A01)] shadow-2xl transition hover:scale-105"
      >
        <Image
          src="/images/icon-easyble-24-white.svg"
          alt="Easyble"
          width={42}
          height={42}
          className="drop-shadow"
          priority
        />
      </button>
    </div>
  )
}
