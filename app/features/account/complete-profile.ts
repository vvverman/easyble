"use server"

import { headers } from "next/headers"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"

export async function completeProfile(params: {
  displayName: string
  username: string
  avatar?: string | null
  email?: string | null
}) {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  const email = (session?.user?.email || params.email || "").trim().toLowerCase()

  const username = params.username.trim()
  const displayName = params.displayName.trim()
  const avatar = params.avatar?.trim() || null

  if (!email || !username || !displayName) {
    throw new Error("Missing required fields")
  }

  await prisma.user.upsert({
    where: { email },
    update: {
      name: displayName,
      username,
      image: avatar,
    },
    create: {
      email,
      name: displayName,
      username,
      image: avatar,
    },
  })
}
