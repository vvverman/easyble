'use server';

import { redirect } from 'next/navigation';
import prisma from '~/lib/prisma';

export async function createProject(formData: FormData) {
  const title = formData.get('title') as string;
  
  let user = await prisma.user.findFirst();
  if (!user) {
     try {
       user = await prisma.user.create({
          data: {
              email: 'test@example.com',
              name: 'Test User'
          }
       });
     } catch (e) {
       user = await prisma.user.findFirst();
     }
  }
  
  if (!user) throw new Error("No user found and failed to create one");

  const project = await prisma.project.create({
    data: {
      title,
      ownerId: user.id,
      columns: {
        create: [
          { title: 'To Do', color: 'blue', order: 0 },
          { title: 'In Progress', color: 'yellow', order: 1 },
          { title: 'Done', color: 'green', order: 2 },
        ]
      }
    },
  });

  redirect(`/projects/${project.id}`);
}
