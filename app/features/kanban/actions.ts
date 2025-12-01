import type { Prisma } from '@prisma/client';
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '~/lib/prisma';

// Вспомогательная функция: из полного текста делаем title (<=100 символов) и description (только если >100)
function splitTaskContent(raw: string): { title: string; description: string | null } {
  const full = (raw ?? '').trim();
  if (!full) {
    return { title: '', description: null };
  }
  const title = full.slice(0, 100);
  const description = full.length > 100 ? full : null;
  return { title, description };
}

// --- Columns ---

export async function addColumn(boardId: string, projectId: string, title: string) {
  const count = await prisma.column.count({ where: { boardId } });
  await prisma.column.create({
    data: {
      boardId,
      title,
      color: 'primary',
      order: count,
    },
  });
  revalidatePath(`/projects/${projectId}/boards/${boardId}`);
}

export async function updateColumnTitle(columnId: string, title: string) {
  await prisma.column.update({
    where: { id: columnId },
    data: { title },
  });
  revalidatePath('/projects/[projectId]');
}

export async function deleteColumn(columnId: string) {
  await prisma.task.deleteMany({ where: { columnId } });
  await prisma.column.delete({ where: { id: columnId } });
  revalidatePath('/projects/[projectId]');
}

// --- Tasks ---

export async function addTask(columnId: string, content: string) {
  const { title, description } = splitTaskContent(content);

  if (!title) {
    return;
  }

  const columnWithBoard = await prisma.column.findUnique({
    where: { id: columnId },
    include: {
      board: true,
    },
  });

  if (!columnWithBoard) {
    return;
  }

  const projectId = columnWithBoard.board.projectId;

  const { _max } = await prisma.task.aggregate({
    where: {
      column: {
        board: {
          projectId,
        },
      },
    },
    _max: {
      projectTaskNumber: true,
    },
  });

  const nextProjectTaskNumber = (_max.projectTaskNumber ?? 0) + 1;

  // Новая задача вверху колонки:
  // 1) увеличиваем order у всех существующих задач
  // 2) создаём новую с order = 0
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.task.updateMany({
      where: { columnId },
      data: { order: { increment: 1 } },
    });

    await tx.task.create({
      data: {
        columnId,
        title,
        description,
        order: 0,
        status: 'TODO',
        projectTaskNumber: nextProjectTaskNumber,
      },
    });
  });

  revalidatePath('/projects/[projectId]');
}

// Обновляем ТОЛЬКО заголовок задачи, не трогая description
export async function updateTaskTitle(taskId: string, title: string) {
  const trimmed = (title ?? '').trim();
  if (!trimmed) {
    return;
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { title: trimmed },
  });

  revalidatePath('/projects/[projectId]');
}

export async function updateTaskDetails(
  taskId: string,
  payload: {
    content: string;
    assignee?: string;
    dueDate?: string | null;
    startAt?: string | null;
    endAt?: string | null;
  },
) {
  const { title, description } = splitTaskContent(payload.content);
  if (!title) {
    return;
  }

  const parseDateTime = (value?: string | null) => {
    if (!value || !value.trim()) return null;
    return new Date(value);
  };

  await prisma.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
      assignee: payload.assignee?.trim() || null,
      dueDate: parseDateTime(payload.dueDate),
      startAt: parseDateTime(payload.startAt),
      endAt: parseDateTime(payload.endAt),
    },
  });

  revalidatePath('/projects/[projectId]');
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath('/projects/[projectId]');
}

// Завершение задачи: статус DONE + перенос в Done-колонку или архив
export async function completeTask(taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        include: {
          board: {
            include: { columns: true },
          },
        },
      },
    },
  });

  if (!task) return;

  const projectId = task.column.board.projectId;
  const boardColumns = task.column.board.columns;

  const doneColumn = boardColumns.find((c) => {
    const t = c.title.toLowerCase();
    return (
      t === 'done' ||
      t === 'готово' ||
      t === 'выполнено' ||
      t === 'завершено'
    );
  });

  // Если колонки Done нет — просто архивируем задачу
  if (!doneColumn) {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'DONE',
        archived: true,
        endAt: new Date(),
      },
    });
    revalidatePath(`/projects/${projectId}`);
    return;
  }

  // Если колонка Done есть — двигаем задачу в неё наверх
  await prisma.$transaction(async (tx) => {
    const current = await tx.task.findUnique({ where: { id: taskId } });
    if (!current) return;

    const oldColumnId = current.columnId;
    const oldOrder = current.order;

    // Сдвигаем задачи в старой колонке
    await tx.task.updateMany({
      where: { columnId: oldColumnId, order: { gt: oldOrder } },
      data: { order: { decrement: 1 } },
    });

    // Освобождаем место сверху в Done-колонке
    await tx.task.updateMany({
      where: { columnId: doneColumn.id },
      data: { order: { increment: 1 } },
    });

    // Переносим задачу в Done c order = 0
    await tx.task.update({
      where: { id: taskId },
      data: {
        columnId: doneColumn.id,
        order: 0,
        status: 'DONE',
        archived: false,
        endAt: new Date(),
      },
    });
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function moveTask(
  taskId: string, 
  newColumnId: string, 
  newOrder: number, 
  projectId: string
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) return;

  const oldColumnId = task.columnId;
  const oldOrder = task.order;

  if (oldColumnId === newColumnId && oldOrder === newOrder) return;

  await prisma.$transaction(async (tx) => {
    if (oldColumnId === newColumnId) {
      if (newOrder > oldOrder) {
        await tx.task.updateMany({
          where: { columnId: oldColumnId, order: { gt: oldOrder, lte: newOrder } },
          data: { order: { decrement: 1 } },
        });
      } else {
        await tx.task.updateMany({
          where: { columnId: oldColumnId, order: { gte: newOrder, lt: oldOrder } },
          data: { order: { increment: 1 } },
        });
      }
    } else {
      await tx.task.updateMany({
        where: { columnId: oldColumnId, order: { gt: oldOrder } },
        data: { order: { decrement: 1 } },
      });

      await tx.task.updateMany({
        where: { columnId: newColumnId, order: { gte: newOrder } },
        data: { order: { increment: 1 } },
      });
    }

    await tx.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId, order: newOrder },
    });
  });

  revalidatePath(`/projects/${projectId}`);
}
