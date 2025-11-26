import { redirect, notFound } from "next/navigation"
import prisma from "~/lib/prisma"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
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
