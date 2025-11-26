'use server';

import { redirect } from 'next/navigation';
import prisma from '~/lib/prisma';

export async function createTeam(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim();

  if (!name) {
    throw new Error('Team name is required');
  }

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

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  // Сразу на создание проекта внутри этой команды
  redirect(`/projects/new?team=${team.id}`);
}
