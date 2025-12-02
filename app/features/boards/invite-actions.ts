"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"
import { sendMail } from "@/lib/mailer"

async function getSessionUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.id) {
    redirect("/login")
  }
  return session.user
}

export async function sendBoardInvite(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()
  const boardId = (formData.get("boardId") as string | null)?.trim()
  if (!email || !boardId) {
    throw new Error("Email and boardId are required")
  }

  const user = await getSessionUser()

  const board = await prisma.board.findFirst({
    where: { id: boardId, project: { ownerId: user.id } },
    select: { id: true, projectId: true, title: true },
  })
  if (!board) {
    throw new Error("Board not found or access denied")
  }

  const invitee = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })

  const now = new Date()
  const distantFuture = new Date("2100-01-01T00:00:00.000Z")

  await prisma.boardInvite.create({
    data: {
      boardId: board.id,
      email,
      token: email, // не используем ссылку, просто фиксируем запись
      expiresAt: distantFuture,
      invitedById: user.id,
      status: invitee ? "ACCEPTED" : "PENDING",
      acceptedAt: invitee ? now : null,
    },
  })

  if (invitee) {
    await prisma.boardMember.upsert({
      where: {
        boardId_userId: {
          boardId: board.id,
          userId: invitee.id,
        },
      },
      update: {},
      create: {
        boardId: board.id,
        userId: invitee.id,
        role: "VIEWER",
      },
    })
  }

  await sendMail({
    to: email,
    subject: `Вас добавили на доску "${board.title}"`,
    text: `Вас добавили на доску "${board.title}". Просто зайдите в Easyble под своим аккаунтом (${email}), и доска будет доступна.`,
    html: `<p>Вас добавили на доску <b>${board.title}</b>.</p><p>Просто войдите в Easyble под аккаунтом <b>${email}</b> — доска уже доступна.</p>`,
  })
}

export async function acceptBoardInvite(token: string) {
  const user = await getSessionUser()
  const invite = await prisma.boardInvite.findFirst({
    where: {
      token,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      boardId: true,
      email: true,
    },
  })

  if (!invite) {
    throw new Error("Приглашение недействительно или истекло")
  }

  await prisma.$transaction(async (tx) => {
    // помечаем принятие
    await tx.boardInvite.update({
      where: { id: invite.id },
      data: { status: "ACCEPTED", acceptedAt: new Date() },
    })

    // добавляем участника, если его ещё нет
    await tx.boardMember.upsert({
      where: {
        boardId_userId: {
          boardId: invite.boardId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        boardId: invite.boardId,
        userId: user.id,
        role: "VIEWER",
      },
    })
  })
}
