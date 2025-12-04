'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import prisma from '~/lib/prisma';

export async function updateBoardArchiveSettings(
  boardId: string,
  archiveColumnId: string,
  archiveAfterDays: number,
  projectId?: string,
) {
  if (!boardId) return;

  await prisma.board.update({
    where: { id: boardId },
    data: {
      archiveColumnId,
      archiveAfterDays,
    },
  });

  if (projectId) {
    revalidatePath(`/projects/${projectId}/boards/${boardId}`);
  } else {
    revalidatePath(`/projects/${boardId}`);
  }
}

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
          { title: 'New', color: 'blue', order: 0 },
          { title: 'In Job', color: 'yellow', order: 1 },
          { title: 'Review', color: 'orange', order: 2 },
          { title: 'Done', color: 'green', order: 3 },
        ],
      },
    },
  });

  redirect(`/projects/${projectId}/boards/${board.id}`);
}

// Форма для сохранения настроек архивации (используется из шита на борде)
export async function saveBoardArchiveSettingsForm(formData: FormData) {
  'use server';

  const boardId = (formData.get('boardId') as string | null) ?? '';
  const projectId = (formData.get('projectId') as string | null) ?? undefined;
  const archiveColumnId = (formData.get('archiveColumnId') as string | null) ?? '';
  const daysRaw = (formData.get('archiveAfterDays') as string | null) ?? '30';
  const archiveAfterDays = Math.max(1, parseInt(daysRaw, 10) || 30);

  if (!boardId || !archiveColumnId) return;

  await updateBoardArchiveSettings(boardId, archiveColumnId, archiveAfterDays, projectId);
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
  const columnIds = columns.map((c: { id: string }) => c.id);

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
