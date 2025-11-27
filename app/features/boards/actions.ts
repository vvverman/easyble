'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '~/lib/prisma';

export async function createBoard(formData: FormData) {
  const title = (formData.get('title') as string | null)?.trim();
  const projectId = formData.get('projectId') as string;

  if (!projectId) {
    throw new Error('projectId is required');
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const board = await prisma.board.create({
    data: {
      title: title && title.length > 0 ? title : 'New board',
      projectId: projectId,
      columns: {
        create: [
          { title: 'To Do', color: 'blue', order: 0 },
          { title: 'In Progress', color: 'yellow', order: 1 },
          { title: 'Done', color: 'green', order: 2 },
        ],
      },
    },
  });

  redirect(`/projects/${projectId}/boards/${board.id}`);
}

// Обновление названия борда
export async function updateBoard(formData: FormData) {
  const boardId = (formData.get('boardId') as string | null)?.trim();
  const projectId = (formData.get('projectId') as string | null)?.trim();
  const title = (formData.get('title') as string | null)?.trim();

  if (!boardId || !title) return;

  await prisma.board.update({
    where: { id: boardId },
    data: { title },
  });

  if (projectId) {
    revalidatePath(`/projects/${projectId}/boards/${boardId}`);
    revalidatePath('/projects');
  } else {
    revalidatePath('/projects');
  }
}

// Удаление борда со всеми колонками и задачами
export async function deleteBoard(formData: FormData) {
  const boardId = (formData.get('boardId') as string | null)?.trim();
  const projectId = (formData.get('projectId') as string | null)?.trim();

  if (!boardId) return;

  const columns = await prisma.column.findMany({
    where: { boardId },
    select: { id: true },
  });
  const columnIds = columns.map((c) => c.id);

  if (columnIds.length > 0) {
    await prisma.task.deleteMany({
      where: { columnId: { in: columnIds } },
    });

    await prisma.column.deleteMany({
      where: { id: { in: columnIds } },
    });
  }

  await prisma.board.delete({
    where: { id: boardId },
  });

  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }
  revalidatePath('/projects');
}
