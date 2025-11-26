import { redirect } from "next/navigation"
import prisma from "~/lib/prisma"

export default async function ProjectsIndexPage() {
  const user = await prisma.user.findFirst({
    include: {
      projects: {
        include: {
          boards: {
            select: { id: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  const projects = user?.projects ?? []

  if (projects.length === 0) {
    redirect("/projects/new")
  }

  const project = projects[0]
  const boards = project.boards ?? []

  if (boards.length === 0) {
    redirect(`/projects/${project.id}`)
  }

  const firstBoard = boards[0]

  redirect(`/projects/${project.id}/boards/${firstBoard.id}`)
}
