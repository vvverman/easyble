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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight">
            {board.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {project.title}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Kanban View
          </span>
          <AvatarGroup>
            {[owner ? (
              <Avatar key={owner.id} className="h-8 w-8 border">
                <AvatarFallback>{ownerInitials}</AvatarFallback>
              </Avatar>
            ) : null]}
          </AvatarGroup>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-4">
        <KanbanBoardWrapper project={project} columns={board.columns} />
      </div>
    </div>
  )
}
