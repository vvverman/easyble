"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "~/lib/prisma";

export async function createProject(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const icon = ((formData.get("icon") as string | null) || "FolderKanban").trim();
  const teamId = (formData.get("teamId") as string | null)?.trim() || null;

  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const userId = session?.user?.id;
  if (!userId) {
    redirect("/");
  }

  const email = session?.user?.email ?? `user-${userId}@example.com`;
  const name = session?.user?.name ?? "User";

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {
      email,
      name,
    },
    create: {
      id: userId,
      email,
      name,
    },
    select: { id: true },
  });

  const project = await prisma.project.create({
    data: {
      title,
      icon,
      ownerId: user.id,
      teamId: teamId && teamId.length > 0 ? teamId : null,
      boards: {
        create: {
          title: 'Main board',
          columns: {
            create: [
              { title: 'To Do', color: 'blue', order: 0 },
              { title: 'In Progress', color: 'yellow', order: 1 },
              { title: 'Done', color: 'green', order: 2 },
            ],
          },
        },
      },
    },
    include: {
      boards: {
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  const firstBoard = project.boards[0];

  const teamQuery = project.teamId ? `?team=${project.teamId}` : "";
  redirect(`/projects/${project.id}/boards/${firstBoard.id}${teamQuery}`);
}

// Обновление проекта: пока даём поменять только title (иконку не трогаем)
export async function updateProject(formData: FormData) {
  const id = (formData.get('projectId') as string | null)?.trim();
  const title = (formData.get('title') as string | null)?.trim();

  if (!id || !title) {
    return;
  }

  await prisma.project.update({
    where: { id },
    data: { title },
  });

  // Перечитываем список проектов/бордов и текущие страницы
  revalidatePath('/projects');
}

// Удаление проекта со всеми бордами/колонками/тасками
export async function deleteProject(formData: FormData) {
  const id = (formData.get('projectId') as string | null)?.trim();
  if (!id) return;

  // Находим все борды проекта
  const boards = await prisma.board.findMany({
    where: { projectId: id },
    select: { id: true },
  });
  const boardIds = boards.map((b: { id: string }) => b.id);

  if (boardIds.length > 0) {
    // Удаляем все задачи по колонкам этих бордов
    await prisma.task.deleteMany({
      where: {
        column: {
          boardId: { in: boardIds },
        },
      },
    });

    // Удаляем колонки этих бордов
    await prisma.column.deleteMany({
      where: { boardId: { in: boardIds } },
    });

    // Удаляем сами борды
    await prisma.board.deleteMany({
      where: { id: { in: boardIds } },
    });
  }

  // И наконец проект
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath('/projects');
}
