'use server';

import { redirect } from 'next/navigation';
import prisma from '~/lib/prisma';

export async function createProject(formData: FormData) {
  const title = (formData.get('title') as string).trim();
  const icon = ((formData.get('icon') as string | null) || 'FolderKanban').trim();
  const teamId = (formData.get('teamId') as string | null)?.trim() || null;

  let user = await prisma.user.findFirst();
  if (!user) {
    try {
      user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      });
    } catch {
      user = await prisma.user.findFirst();
    }
  }

  if (!user) throw new Error('No user found and failed to create one');

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

  redirect(`/projects/${project.id}/boards/${firstBoard.id}`);
}
