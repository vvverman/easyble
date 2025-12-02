"use server"

import crypto from "node:crypto"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"
import { sendMail } from "@/lib/mailer"

export async function startEmailLogin(formData: FormData) {
  const email = (formData.get("email") as string | null)?.trim().toLowerCase()
  const name = (formData.get("name") as string | null)?.trim() || ""

  if (!email) {
    throw new Error("Email is required")
  }

  const usernameFromEmail = email.split("@")[0] || ""

  // Upsert user silently by email
  await prisma.user.upsert({
    where: { email },
    update: {
      name: name || undefined,
      username: usernameFromEmail || undefined,
    },
    create: {
      email,
      name: name || usernameFromEmail || null,
      username: usernameFromEmail || null,
    },
  })

  const params = new URLSearchParams({
    email,
    name: name || usernameFromEmail || "",
    username: usernameFromEmail || "",
  })

  redirect(`/login/complete?${params.toString()}`)
}

export async function requestPasswordReset(formData: FormData) {
  const identifier = (formData.get("identifier") as string | null)?.trim().toLowerCase()
  if (!identifier) {
    return { ok: true }
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
    select: { id: true, email: true, name: true },
  })

  // Always pretend success to avoid user enumeration
  if (!user?.email) {
    return { ok: true }
  }

  const token = crypto.randomBytes(32).toString("hex")
  const hashed = crypto.createHash("sha256").update(token).digest("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30) // 30 minutes

  await prisma.verification.deleteMany({
    where: { identifier: user.email },
  })

  await prisma.verification.create({
    data: {
      identifier: user.email,
      value: hashed,
      expiresAt,
    },
  })

  const resetLink = `${process.env.BETTER_AUTH_URL || "http://localhost:3100"}/reset?token=${token}`

  await sendMail({
    to: user.email,
    subject: "Сброс пароля Easyble",
    text: `Для сброса пароля перейдите по ссылке: ${resetLink}`,
    html: `<p>Для сброса пароля перейдите по ссылке:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  })

  return { ok: true }
}
