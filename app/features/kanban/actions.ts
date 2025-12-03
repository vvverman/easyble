import type { Prisma } from '@prisma/client';
'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
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

function revalidateBoardViews(projectId: string, boardId?: string) {
  if (boardId) {
    revalidatePath(`/projects/${projectId}/boards/${boardId}`);
  }
  revalidatePath(`/projects/${projectId}`);
  revalidatePath('/projects');
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
  revalidateBoardViews(projectId, boardId);
}

export async function updateColumnTitle(columnId: string, title: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: {
      boardId: true,
      board: { select: { projectId: true } },
    },
  });

  if (!column) return;

  await prisma.column.update({
    where: { id: columnId },
    data: { title },
  });
  revalidateBoardViews(column.board.projectId, column.boardId);
}

export async function deleteColumn(columnId: string) {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: {
      boardId: true,
      board: { select: { projectId: true } },
    },
  });

  if (!column) return;

  await prisma.task.deleteMany({ where: { columnId } });
  await prisma.column.delete({ where: { id: columnId } });
  revalidateBoardViews(column.board.projectId, column.boardId);
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
  const boardId = columnWithBoard.boardId;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const creatorId = session?.user?.id ?? null;

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
        creatorId,
      },
    });
  });

  revalidateBoardViews(projectId, boardId);
}

// Обновляем ТОЛЬКО заголовок задачи, не трогая description
export async function updateTaskTitle(taskId: string, title: string) {
  const trimmed = (title ?? '').trim();
  if (!trimmed) {
    return;
  }

  const taskWithBoard = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      column: {
        select: {
          boardId: true,
          board: { select: { projectId: true } },
        },
      },
    },
  });

  if (!taskWithBoard) return;

  await prisma.task.update({
    where: { id: taskId },
    data: { title: trimmed },
  });

  revalidateBoardViews(taskWithBoard.column.board.projectId, taskWithBoard.column.boardId);
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

  const taskWithBoard = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      column: {
        select: {
          boardId: true,
          board: { select: { projectId: true } },
        },
      },
    },
  });

  if (!taskWithBoard) return;

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

  revalidateBoardViews(taskWithBoard.column.board.projectId, taskWithBoard.column.boardId);
}

// --- Comments ---
export async function addTaskComment(taskId: string, content: string) {
  const trimmed = (content ?? '').trim();
  if (!trimmed) return null;

  const taskWithBoard = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      column: {
        select: {
          boardId: true,
          board: { select: { projectId: true } },
        },
      },
    },
  });
  if (!taskWithBoard) return null;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const authorId = session?.user?.id ?? null;

  const comment = await prisma.taskComment.create({
    data: {
      taskId,
      content: trimmed,
      authorId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  revalidateBoardViews(taskWithBoard.column.board.projectId, taskWithBoard.column.boardId);
  return comment;
}

export async function deleteTask(taskId: string) {
  const taskWithBoard = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      column: {
        select: {
          boardId: true,
          board: { select: { projectId: true } },
        },
      },
    },
  });

  if (!taskWithBoard) return;

  await prisma.task.delete({ where: { id: taskId } });
  revalidateBoardViews(taskWithBoard.column.board.projectId, taskWithBoard.column.boardId);
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
  const boardId = task.column.boardId;
  const boardColumns = task.column.board.columns;

  const doneColumn = boardColumns.find((c: { title: string }) => {
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
    revalidateBoardViews(projectId, boardId);
    return;
  }

  // Если колонка Done есть — двигаем задачу в неё наверх
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

  revalidateBoardViews(projectId, boardId);
}

export async function moveTask(
  taskId: string,
  newColumnId: string,
  newOrder: number,
  projectId: string
) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      order: true,
      columnId: true,
      column: {
        select: {
          boardId: true,
          board: { select: { projectId: true } },
        },
      },
    },
  });
  if (!task) return;

  const newColumn = await prisma.column.findUnique({
    where: { id: newColumnId },
    select: {
      boardId: true,
      board: { select: { projectId: true } },
    },
  });
  if (!newColumn) return;

  const oldColumnId = task.columnId;
  const oldOrder = task.order;
  const sourceBoardId = task.column.boardId;
  const sourceProjectId = task.column.board.projectId;
  const targetBoardId = newColumn.boardId;
  const targetProjectId = newColumn.board.projectId;

  if (oldColumnId === newColumnId && oldOrder === newOrder) return;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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

  revalidateBoardViews(targetProjectId, targetBoardId);
  if (targetBoardId !== sourceBoardId || targetProjectId !== sourceProjectId) {
    revalidateBoardViews(sourceProjectId, sourceBoardId);
  }
}
