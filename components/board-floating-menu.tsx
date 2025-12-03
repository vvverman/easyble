"use client"

import React from "react"
import { KanbanSquare, List, GanttChart, Calendar, Settings } from "lucide-react"
import { AvatarGroup } from "@/components/animate-ui/components/animate/avatar-group"
import { SendBoardInviteForm } from "@/components/send-board-invite-form"

export function BoardFloatingMenu({
  avatars,
  boardId,
}: {
  avatars: React.ReactNode[]
  boardId: string
}) {
  const avatarItems = Array.isArray(avatars) ? avatars : [avatars]
  const groupChildren = [
    ...avatarItems.map((node, idx) => <React.Fragment key={idx}>{node}</React.Fragment>),
    <SendBoardInviteForm key="invite-btn" boardId={boardId} />,
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex h-14 items-center gap-3 rounded-full bg-white/10 px-4 text-white shadow-2xl backdrop-blur-lg">
        <div className="flex items-center gap-3 text-white/70">
          <span className="text-white transition hover:scale-110" aria-label="Kanban view">
            <KanbanSquare className="h-5 w-5 text-white" />
          </span>
          <button
            type="button"
            className="text-white/60 transition hover:scale-110 hover:text-white"
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-white/60 transition hover:scale-110 hover:text-white"
            aria-label="Gantt view"
          >
            <GanttChart className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="text-white/60 transition hover:scale-110 hover:text-white"
            aria-label="Calendar view"
          >
            <Calendar className="h-5 w-5" />
          </button>
        </div>
        <span className="h-6 w-px bg-white/15" aria-hidden />
        <AvatarGroup className="!h-auto !-space-x-2">{groupChildren}</AvatarGroup>
        <span className="h-6 w-px bg-white/15" aria-hidden />
        <div className="text-white/60 transition hover:scale-110 hover:text-white">
          <Settings className="h-5 w-5" aria-label="Settings" />
        </div>
      </div>
    </div>
  )
}
