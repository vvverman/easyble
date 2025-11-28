import type { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "~/lib/prisma"
import KanbanBoardWrapper from "~/features/kanban/board"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/animate-ui/components/animate/avatar-group"

interface BoardPageProps {
  params: Promise<{
    projectId: string
    boardId: string
  }>
}

interface BoardPageRouteParams {
  params: Promise<{
    projectId: string
    boardId: string
  }>
}

export async function generateMetadata(
  { params }: BoardPageRouteParams
): Promise<Metadata> {
  const { boardId } = await params

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    select: { title: true },
  })

  if (!board || !board.title) {
    return {
      title: "Project",
    }
  }

  const fullTitle = board.title
  const truncatedTitle =
    fullTitle.length > 20 ? fullTitle.slice(0, 20) + "…" : fullTitle

  return {
    title: truncatedTitle,
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { boardId } = await params

  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      project: {
        include: { owner: true },
      },
      columns: {
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!board) {
    notFound()
  }

  const project = board.project
  const owner = project.owner

  const ownerInitials =
    owner && (owner.name || owner.email)
      ? (owner.name || owner.email)!
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?"

  const avatars = owner
    ? [
        <Avatar key={owner.id} className="h-8 w-8 border">
          <AvatarFallback>{ownerInitials}</AvatarFallback>
        </Avatar>,
      ]
    : []

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[50px] items-center border-b px-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Kanban View</span>
          <AvatarGroup>
            {avatars}
          </AvatarGroup>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 flex-col">
        <div
          className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden pl-4 pt-4 pb-0"
          style={{ height: "calc(100vh - 50px)" }}
        >
          <KanbanBoardWrapper
            project={project}
            boardId={board.id}
            columns={board.columns}
          />
        </div>
      </div>
    </div>
  )
}
