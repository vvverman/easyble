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
