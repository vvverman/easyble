'use server';

import { revalidatePath } from 'next/cache';
import prisma from '~/lib/prisma';

// --- Columns ---

export async function addColumn(projectId: string, title: string) {
  const count = await prisma.column.count({ where: { projectId } });
  await prisma.column.create({
    data: {
      projectId,
      title,
      color: 'primary',
      order: count,
    },
  });
  revalidatePath(`/projects/${projectId}`);
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

export async function addTask(columnId: string, title: string) {
  const count = await prisma.task.count({ where: { columnId } });
  await prisma.task.create({
    data: {
      columnId,
      title,
      order: count,
      status: 'TODO',
    },
  });
  revalidatePath('/projects/[projectId]');
}

export async function updateTaskTitle(taskId: string, title: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { title },
  });
  revalidatePath('/projects/[projectId]');
}

export async function deleteTask(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath('/projects/[projectId]');
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

  // Если позиция и колонка не изменились - ничего не делаем
  if (oldColumnId === newColumnId && oldOrder === newOrder) return;

  await prisma.$transaction(async (tx) => {
    if (oldColumnId === newColumnId) {
      // Перемещение внутри одной колонки
      if (newOrder > oldOrder) {
        // Двигаем вниз: уменьшаем order у тех, кто "всплывает" вверх
        await tx.task.updateMany({
          where: { columnId: oldColumnId, order: { gt: oldOrder, lte: newOrder } },
          data: { order: { decrement: 1 } },
        });
      } else {
        // Двигаем вверх: увеличиваем order у тех, кто "тонет" вниз
        await tx.task.updateMany({
          where: { columnId: oldColumnId, order: { gte: newOrder, lt: oldOrder } },
          data: { order: { increment: 1 } },
        });
      }
    } else {
      // Перемещение в другую колонку
      
      // 1. Смыкаем ряды в старой колонке (все кто ниже ушедшей - поднимаются)
      await tx.task.updateMany({
        where: { columnId: oldColumnId, order: { gt: oldOrder } },
        data: { order: { decrement: 1 } },
      });

      // 2. Раздвигаем ряды в новой колонке (все кто на этом месте и ниже - опускаются)
      await tx.task.updateMany({
        where: { columnId: newColumnId, order: { gte: newOrder } },
        data: { order: { increment: 1 } },
      });
    }

    // 3. Ставим саму задачу на новое место
    await tx.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId, order: newOrder },
    });
  });

  revalidatePath(`/projects/${projectId}`);
}
