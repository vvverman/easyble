import * as React from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import prisma from "~/lib/prisma"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SearchParams = {
  [key: string]: string | string[] | undefined
}

// Avoid static prerender so DB access happens at request time
export const dynamic = "force-dynamic"

export default async function ProjectsIndexPage(props: {
  searchParams: Promise<SearchParams>
}) {
  const searchParams = await props.searchParams

  const teamFromUrlRaw = searchParams?.team
  const teamFromUrl =
    typeof teamFromUrlRaw === "string"
      ? teamFromUrlRaw
      : Array.isArray(teamFromUrlRaw)
        ? teamFromUrlRaw[0]
        : undefined

  const user = await prisma.user.findFirst({
    include: {
      teams: {
        orderBy: { createdAt: "asc" },
      },
      projects: {
        include: {
          boards: {
            include: {
              columns: {
                include: {
                  tasks: {
                    select: {
                      id: true,
                      title: true,
                      createdAt: true,
                    },
                    orderBy: { createdAt: "asc" },
                  },
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!user) {
    redirect("/projects/new")
  }

  const teams = user.teams ?? []
  const allProjects = user.projects ?? []

  if (allProjects.length === 0) {
    const newProjectUrl = teamFromUrl ? `/projects/new?team=${teamFromUrl}` : "/projects/new"
    redirect(newProjectUrl)
  }

  const defaultTeamId = teams[0]?.id
  const currentTeamId = teamFromUrl ?? defaultTeamId ?? null
  const currentTeam = currentTeamId
    ? teams.find((t: { id: string }) => t.id === currentTeamId) ?? null
    : null

  const projectsForTeam =
    currentTeamId != null
      ? allProjects.filter((p) => p.teamId === currentTeamId)
      : allProjects

  const teamQuery = currentTeamId ? `?team=${currentTeamId}` : ""

  // Если в команде всего один борд — сразу редиректим на него
  const boardsForTeam = projectsForTeam.flatMap((project: any) => project.boards ?? [])
  if (boardsForTeam.length === 1) {
    const onlyBoard = boardsForTeam[0] as any
    redirect(`/projects/${onlyBoard.projectId}/boards/${onlyBoard.id}${teamQuery}`)
  }

  // Кол-во пользователей в текущей команде
  let teamMemberCount = 0
  if (currentTeamId) {
    teamMemberCount = await prisma.user.count({
      where: {
        teams: {
          some: { id: currentTeamId },
        },
      },
    })
  }

  const hasAnyBoards = projectsForTeam.some(
    (project: any) => (project.boards?.length ?? 0) > 0,
  )

  return (
    <div className="flex h-full w-full flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold leading-tight">
          {currentTeam ? currentTeam.name : "Projects"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Boards and their tasks grouped by project in the current workspace.
        </p>
        {currentTeamId && (
          <p className="text-xs text-muted-foreground">
            Members in this workspace: {teamMemberCount}
          </p>
        )}
      </div>

      {!hasAnyBoards ? (
        <div className="mt-4 text-sm text-muted-foreground">
          There are no boards in this team yet.{" "}
          <Link
            href={
              currentTeamId
                ? `/projects/new?team=${currentTeamId}`
                : "/projects/new"
            }
            className="underline underline-offset-4"
          >
            Create your first project.
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {projectsForTeam.map((project: any) => {
            const projectBoards = project.boards ?? []

            // Всего задач в проекте
            const projectTasks = projectBoards.reduce(
              (sum: number, board: any) =>
                sum +
                (board.columns ?? []).reduce(
                  (inner: number, col: any) =>
                    inner + (col.tasks?.length ?? 0),
                  0,
                ),
              0,
            )

            if (projectBoards.length === 0) {
              return null
            }

            return (
              <section key={project.id} className="flex flex-col gap-2">
                {/* Заголовок проекта ВНЕ таблицы */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold">
                      {project.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {projectBoards.length} boards · {projectTasks} tasks
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-xs text-muted-foreground">
                    Project created{" "}
                    {project.createdAt.toISOString().slice(0, 10)}
                  </p>
                </div>

                {/* Таблица только по бордам и задачам */}
                <div className="overflow-auto rounded-md border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[260px] text-xs font-medium uppercase text-muted-foreground">
                          Board / Task
                        </TableHead>
                        <TableHead className="w-[160px] text-xs font-medium uppercase text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="w-[140px] text-xs font-medium uppercase text-muted-foreground">
                          Created
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectBoards.map((board: any) => {
                        const columns = board.columns ?? []
                        const allTasks = columns.flatMap((col: any) => col.tasks ?? [])

                        return (
                          <React.Fragment key={board.id}>
                            {/* Строка борда */}
                            <TableRow className="bg-muted/40 hover:bg-muted/50">
                              <TableCell className="px-4 py-2">
                                <Link
                                  href={`/projects/${project.id}/boards/${board.id}${teamQuery}`}
                                  className="text-sm font-medium text-foreground underline underline-offset-4 decoration-muted-foreground/60 hover:decoration-foreground"
                                >
                                  {board.title}
                                </Link>
                              </TableCell>
                              <TableCell className="px-4 py-2 text-xs text-muted-foreground">
                                {allTasks.length} tasks
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-4 py-2 text-xs text-muted-foreground">
                                {board.createdAt.toISOString().slice(0, 10)}
                              </TableCell>
                            </TableRow>

                            {/* Строки задач этого борда */}
                            {columns.map((column: any) =>
                              (column.tasks ?? []).map((task: any) => (
                                <TableRow key={task.id}>
                                  <TableCell className="px-4 py-1 pl-8 text-xs">
                                    {task.title}
                                  </TableCell>
                                  <TableCell className="px-4 py-1 text-xs text-muted-foreground">
                                    {column.title}
                                  </TableCell>
                                  <TableCell className="whitespace-nowrap px-4 py-1 text-xs text-muted-foreground">
                                    {task.createdAt.toISOString().slice(0, 10)}
                                  </TableCell>
                                </TableRow>
                              )),
                            )}

                            {allTasks.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={3}
                                  className="px-4 py-2 pl-8 text-xs text-muted-foreground"
                                >
                                  No tasks in this board yet.
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
