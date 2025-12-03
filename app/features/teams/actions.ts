"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import prisma from "~/lib/prisma";

export async function createTeam(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim();

  if (!name) {
    throw new Error("Team name is required");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.upsert({
    where: { id: userId! },
    update: {
      email: session?.user?.email ?? undefined,
      name: session?.user?.name ?? undefined,
      image: session?.user?.image ?? undefined,
    },
    create: {
      id: userId!,
      email: session?.user?.email ?? `user-${userId}@example.com`,
      name: session?.user?.name ?? "User",
      image: session?.user?.image ?? null,
    },
    select: { id: true },
  });

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  redirect(`/projects/new?team=${team.id}`);
}

export async function updateTeam(formData: FormData) {
  const id = (formData.get('teamId') as string | null)?.trim();
  const name = (formData.get('name') as string | null)?.trim();

  if (!id || !name) {
    return;
  }

  // updateMany не кидает ошибку, если запись уже удалена
  await prisma.team.updateMany({
    where: { id },
    data: { name },
  });

  // Перечитываем страницы, где светится название команды
  revalidatePath('/projects');
  revalidatePath(`/projects?team=${id}`);

  // Обновим страницы всех бордов командных проектов
  const projects = await prisma.project.findMany({
    where: { teamId: id },
    select: {
      id: true,
      boards: {
        select: { id: true },
      },
    },
  });

  for (const project of projects) {
    for (const board of project.boards) {
      revalidatePath(`/projects/${project.id}/boards/${board.id}`);
    }
  }
}

export async function deleteTeam(formData: FormData) {
  const id = (formData.get('teamId') as string | null)?.trim();
  if (!id) return;

  // Удаляем все проекты команды каскадом (борды, колонки, задачи)
  const projects = await prisma.project.findMany({
    where: { teamId: id },
    select: { id: true },
  });

  for (const project of projects) {
    const boards = await prisma.board.findMany({
      where: { projectId: project.id },
      select: { id: true },
    });
    const boardIds = boards.map((b) => b.id);

    if (boardIds.length > 0) {
      await prisma.task.deleteMany({
        where: { column: { boardId: { in: boardIds } } },
      });
      await prisma.column.deleteMany({
        where: { boardId: { in: boardIds } },
      });
      await prisma.board.deleteMany({
        where: { id: { in: boardIds } },
      });
    }

    await prisma.project.deleteMany({
      where: { id: project.id },
    });
  }

  await prisma.team.deleteMany({
    where: { id },
  });

  revalidatePath('/projects');
}
