import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import prisma from "~/lib/prisma"
import { createBoard } from "~/features/boards/actions"
import { auth } from "@/auth"

interface NewBoardPageProps {
  params: Promise<{
    projectId: string
  }>
}

// Avoid static prerender so DB access happens at request time
export const dynamic = "force-dynamic"

export default async function NewBoardPage({ params }: NewBoardPageProps) {
  const { projectId } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const userId = session?.user?.id
  if (!userId) {
    redirect("/login")
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true, title: true },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold leading-tight">
          Create board
        </h1>
        <p className="text-sm text-muted-foreground">
          Project: {project.title}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <form action={createBoard} className="space-y-4 max-w-md">
          <input type="hidden" name="projectId" value={project.id} />
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Board name
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Main board"
              className="w-full rounded-md border px-3 py-2 text-sm bg-background"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create board
          </button>
        </form>
      </div>
    </div>
  )
}
