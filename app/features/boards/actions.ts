'use server';

import { redirect } from 'next/navigation';
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
