import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import prisma from "~/lib/prisma"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { auth } from "@/auth"
import { SendBoardInviteForm } from "@/components/send-board-invite-form"
import { BoardViewClient } from "./board-view-client"

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
  const { boardId, projectId } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id
  const userEmail = session?.user?.email?.toLowerCase() ?? null

  async function loadBoard(withArchive: boolean) {
    const base = {
      where: {
        id: boardId,
        OR: [
          { project: { ownerId: userId ?? undefined } },
          { members: { some: { userId: userId ?? "" } } },
          userEmail ? { invites: { some: { email: userEmail } } } : undefined,
        ].filter(Boolean) as any,
      },
      columns: {
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              assignees: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
              comments: {
                orderBy: { createdAt: "asc" },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
      project: {
        include: {
          owner: true,
          team: true,
        },
      },
      invites: true,
    };

    if (withArchive) {
      return prisma.board.findFirst({
        where: base.where,
        include: {
          project: base.project,
          invites: base.invites,
          columns: base.columns,
          // archive fields присутствуют в схеме; если колонки есть в БД — всё ок
          // Prisma требует указания, иначе выбрасывает ошибку отсутствия столбца
          // но реальный запрос возьмёт все scalar поля
        },
      } as any);
    }

    // Режим совместимости: выбираем только существующие столбцы (id, title, projectId) + связи
    return prisma.board.findFirst({
      where: base.where,
      select: {
        id: true,
        title: true,
        projectId: true,
        project: base.project as any,
        invites: true,
        columns: base.columns as any,
      },
    });
  }

  let board: any = null
  try {
    board = await loadBoard(true)
  } catch {
    // если колонок архива нет в БД (старая схема), пробуем без них
    board = await loadBoard(false)
  }

  if (!board) {
    notFound()
  }

  // Автоархивация
  if (board.archiveColumnId && board.archiveAfterDays && board.archiveAfterDays > 0) {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - board.archiveAfterDays)

    await prisma.task.updateMany({
      where: {
        columnId: board.archiveColumnId,
        archived: false,
        updatedAt: { lt: threshold },
      },
      data: {
        archived: true,
        status: "ARCHIVED",
      },
    })
  }

  // Подгружаем свежие данные после возможной архивации
  const fresh = await prisma.board.findFirst({
    where: { id: boardId },
    include: {
      project: {
        include: { owner: true, team: true },
      },
      columns: {
        include: {
          tasks: {
            orderBy: { order: "asc" },
            include: {
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              assignees: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
              comments: {
                orderBy: { createdAt: "asc" },
                include: {
                  author: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  const project = fresh?.project ?? board.project
  const owner = project.owner
  const boardIdValue = board.id

  // если есть приглашение по email, но нет membership — добавляем
  if (userId && userEmail) {
    const hasInvite = board.invites.some(
      (i: any) => i.email.toLowerCase() === userEmail && i.status !== "EXPIRED",
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
    <BoardViewClient
      project={project}
      boardId={board.id}
      boardTitle={board.title}
      teamTitle={project.team?.name ?? null}
      columns={fresh?.columns ?? board.columns}
      avatars={avatars}
      archiveAfterDays={board.archiveAfterDays ?? null}
      archiveColumnId={board.archiveColumnId ?? null}
      projectId={projectId}
    />
  )
}
