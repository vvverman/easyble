import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, username: true, image: true },
  })

  return NextResponse.json({ user })
}
