"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"

export async function updateDisplayName(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim()
  if (!name) {
    throw new Error("Display name is required")
  }

  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  const userId = session?.user?.id
  if (!userId) {
    redirect("/")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name },
  })

  redirect("/account")
}

export async function updateProfile(formData: FormData) {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  const userId = session?.user?.id
  if (!userId) {
    redirect("/")
  }

  const name = (formData.get("name") as string | null)?.trim()
  const username = (formData.get("username") as string | null)?.trim()
  const avatar = (formData.get("avatar") as string | null)?.trim() || null

  if (!name || !username) {
    throw new Error("Name and username are required")
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      username,
      image: avatar,
    },
  })

  redirect("/account")
}
