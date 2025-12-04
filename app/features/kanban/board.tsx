'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useJsLoaded } from '@/new-york/hooks/use-js-loaded';
import { 
  KanbanBoard, 
  KanbanBoardColumnSkeleton, 
  KanbanBoardExtraMargin, 
  KanbanBoardProvider 
} from '@/new-york/ui/kanban';
import { Skeleton } from '~/components/ui/skeleton';
import { MyNewKanbanBoardColumn } from './components/new-column';
import { KanbanColumn } from './components/column';
import { 
  addColumn, 
  updateColumnTitle, 
  deleteColumn, 
  addTask, 
  updateTaskTitle, 
  deleteTask, 
  moveTask,
  completeTask,
} from './actions';

type KanbanColor =
  | 'blue'
  | 'yellow'
  | 'green'
  | 'primary'
  | 'cyan'
  | 'gray'
  | 'indigo'
  | 'pink'
  | 'purple'
  | 'red'
  | 'violet';

type Card = {
  id: string;
  title: string;
  order: number;
  displayId: string;
  columnId?: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerImage?: string | null;
  members?: { id?: string; name?: string | null; email?: string | null; image?: string | null }[];
  path?: string;
  comments?: {
    id: string;
    content: string;
    createdAt: string;
    authorName?: string | null;
    authorEmail?: string | null;
    authorImage?: string | null;
  }[];
  completed?: boolean;
};

type Column = {
  id: string;
  title: string;
  color: KanbanColor;
  items: Card[];
  order: number;
};

type BoardProps = {
  projectId: string;
  boardId: string;
  initialColumns: Column[];
  onOpenEasyble?: () => void;
};

export default function KanbanBoardWrapper({
  project,
  boardId,
  boardTitle,
  teamTitle,
  columns,
  onOpenEasyble,
}: {
  project: any;
  boardId: string;
  boardTitle: string;
  teamTitle: string | null;
  columns: any[];
  onOpenEasyble?: () => void;
}) {
  const resolvedTeamTitle = teamTitle ?? project.team?.name ?? project.title ?? 'Team';
  const boardPath = `${resolvedTeamTitle}/${project.title ?? 'Project'}/${boardTitle ?? 'Board'}`;

  const uiColumns: Column[] = columns.map((c: any) => ({
    id: c.id,
    title: c.title,
    color: (c.color ?? 'primary') as KanbanColor,
    order: c.order,
    items: c.tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      order: t.order,
      displayId: `${project.number ?? ''}-${t.projectTaskNumber}`,
      columnId: c.id,
      ownerName: t.creator?.name ?? null,
      ownerEmail: t.creator?.email ?? null,
      ownerImage: t.creator?.image ?? null,
      members: (t.assignees ?? []).map((a: any) => ({
        id: a.user?.id,
        name: a.user?.name,
        email: a.user?.email,
        image: a.user?.image,
      })),
      path: boardPath,
      comments: (t.comments ?? []).map((c: any) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        authorName: c.author?.name ?? null,
        authorEmail: c.author?.email ?? null,
        authorImage: c.author?.image ?? null,
      })),
      completed: (c.title ?? '').toLowerCase().includes('done'),
    })),
  }));

  return (
    <KanbanBoardProvider>
      <ProjectKanbanBoard
        projectId={project.id}
        boardId={boardId}
        initialColumns={uiColumns}
        onOpenEasyble={onOpenEasyble}
      />
    </KanbanBoardProvider>
  );
}

function ProjectKanbanBoard({ projectId, boardId, initialColumns, onOpenEasyble }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isPending, startTransition] = useTransition();
  const scrollContainerReference = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  function scrollRight() {
    if (scrollContainerReference.current) {
      scrollContainerReference.current.scrollLeft =
        scrollContainerReference.current.scrollWidth;
    }
  }

  const handleAddColumn = (title?: string) => {
    if (title) {
      startTransition(async () => {
        await addColumn(boardId, projectId, title);
        scrollRight();
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    startTransition(async () => {
      await deleteColumn(columnId);
    });
  };

  const handleUpdateColumnTitle = (columnId: string, title: string) => {
    startTransition(async () => {
      await updateColumnTitle(columnId, title);
    });
  };

  const handleAddCard = (columnId: string, cardContent: string) => {
    startTransition(async () => {
      await addTask(columnId, cardContent);
    });
  };

  const handleDeleteCard = (cardId: string) => {
    startTransition(async () => {
      await deleteTask(cardId);
    });
  };

  const handleUpdateCardTitle = (cardId: string, cardTitle: string) => {
    setColumns((previousColumns) =>
      previousColumns.map((column) => ({
        ...column,
        items: column.items.map((item) =>
          item.id === cardId ? { ...item, title: cardTitle } : item,
        ),
      })),
    );

    startTransition(async () => {
      await updateTaskTitle(cardId, cardTitle);
    });
  };

  const handleMoveCardToColumn = (columnId: string, index: number, card: Card) => {
    setColumns((previousColumns) =>
      previousColumns.map((column: Column) => {
        if (column.id === columnId) {
          const otherItems = column.items.filter(({ id }) => id !== card.id);
          const movedCard = { ...card, columnId };
          return {
            ...column,
            items: [...otherItems.slice(0, index), movedCard, ...otherItems.slice(index)],
          };
        } else {
          return {
            ...column,
            items: column.items.filter(({ id }) => id !== card.id),
          };
        }
      }),
    );

    startTransition(async () => {
      await moveTask(card.id, columnId, index, projectId);
    });
  };

  const handleCompleteCard = (cardId: string) => {
    setColumns((previousColumns) =>
      previousColumns.map((column) => ({
        ...column,
        items: column.items.filter((item) => item.id !== cardId),
      })),
    );

    startTransition(async () => {
      await completeTask(cardId);
    });
  };

  const handleDragCancel = (cardId: string) => {};

  const handleDragEnd = (cardId: string, overId: string) => {};

  const jsLoaded = useJsLoaded();

  return (
    <KanbanBoard ref={scrollContainerReference} className="h-full">
      {columns.map((column: Column) =>
        jsLoaded ? (
          <KanbanColumn
            key={column.id}
            column={column}
            statusOptions={columns.map((c) => ({ id: c.id, title: c.title }))}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onDeleteColumn={handleDeleteColumn}
            onMoveCardToColumn={handleMoveCardToColumn}
            onUpdateCardTitle={handleUpdateCardTitle}
            onUpdateColumnTitle={handleUpdateColumnTitle}
            onCompleteCard={handleCompleteCard}
            onDragCancel={handleDragCancel}
            onDragEnd={handleDragEnd}
            onOpenEasyble={onOpenEasyble}
          />
        ) : (
          <KanbanBoardColumnSkeleton key={column.id} />
        ),
      )}
      {jsLoaded ? (
        <MyNewKanbanBoardColumn onAddColumn={handleAddColumn} />
      ) : (
        <Skeleton className="h-9 w-10.5 flex-shrink-0" />
      )}
      <KanbanBoardExtraMargin />
    </KanbanBoard>
  );
}
