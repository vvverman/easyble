import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import prisma from "~/lib/prisma"
import { auth } from "@/auth"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

// Avoid static prerender so DB access happens at request time
export const dynamic = "force-dynamic"

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id

  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId ?? undefined },
    include: {
      boards: {
        select: { id: true },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!project) {
    notFound()
  }

  const firstBoard = project.boards[0]
  if (!firstBoard) {
    notFound()
  }

  redirect(`/projects/${project.id}/boards/${firstBoard.id}`)
}
