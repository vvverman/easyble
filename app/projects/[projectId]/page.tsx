import { notFound } from 'next/navigation';
import prisma from '~/lib/prisma';
import KanbanBoardWrapper from '~/features/kanban/board'; 

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      columns: {
        include: {
          tasks: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <div className="text-sm text-muted-foreground">Kanban View</div>
      </div>
      <div className="flex-1 overflow-hidden p-4">
         <KanbanBoardWrapper project={project} columns={project.columns} />
      </div>
    </div>
  );
}
