import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import prisma from "~/lib/prisma"
import KanbanBoardWrapper from "~/features/kanban/board"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { auth } from "@/auth"
import { SendBoardInviteForm } from "@/components/send-board-invite-form"
import { BoardFloatingMenu } from "@/components/board-floating-menu"

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

// Avoid static prerender so DB access happens at request time
export const dynamic = "force-dynamic"

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

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id
  const userEmail = session?.user?.email?.toLowerCase() ?? null

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      OR: [
        { project: { ownerId: userId ?? undefined } },
        { members: { some: { userId: userId ?? "" } } },
        userEmail ? { invites: { some: { email: userEmail } } } : undefined,
      ].filter(Boolean) as any,
    },
    include: {
      project: {
        include: { owner: true },
      },
      invites: true,
      columns: {
        include: {
          tasks: {
            where: { archived: false },
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
  const boardIdValue = board.id

  // если есть приглашение по email, но нет membership — добавляем
  if (userId && userEmail) {
    const hasInvite = board.invites.some(
      (i) => i.email.toLowerCase() === userEmail && i.status !== "EXPIRED",
    )
    if (hasInvite) {
      await prisma.$transaction([
        prisma.boardMember.upsert({
          where: { boardId_userId: { boardId: boardIdValue, userId } },
          update: {},
          create: { boardId: boardIdValue, userId, role: "VIEWER" },
        }),
        prisma.boardInvite.updateMany({
          where: { boardId: boardIdValue, email: userEmail },
          data: { status: "ACCEPTED", acceptedAt: new Date() },
        }),
      ])
    }
  }

  const ownerInitials =
    owner && (owner.name || owner.email)
      ? (owner.name || owner.email)!
          .split(" ")
          .map((part: string) => part[0])
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
    <div className="relative flex h-full min-h-0">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden pl-4 pt-4 pb-0">
          <KanbanBoardWrapper
            project={project}
            boardId={board.id}
            columns={board.columns}
          />
        </div>
      </div>
      <BoardFloatingMenu avatars={avatars} boardId={board.id} />
    </div>
  )
}
