import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"
import { CompleteProfileClient, type CompleteProfileProps } from "./client"

export const dynamic = "force-dynamic"

export default async function CompleteProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const email = session?.user?.email ?? ""
  const name = session?.user?.name ?? ""
  const image = session?.user?.image ?? ""

  if (!email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { name: true, username: true, image: true },
  })

  if (user?.name && user?.username) {
    redirect("/projects")
  }

  const initial: CompleteProfileProps = {
    email,
    displayName: user?.name ?? name ?? "",
    username: user?.username ?? (email.split("@")[0] || ""),
    avatar: user?.image ?? image ?? "",
  }

  return <CompleteProfileClient initial={initial} />
}
