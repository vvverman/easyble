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
  moveTask 
} from './actions';

type Card = {
  id: string;
  title: string;
  order: number;
  displayId: string;
};

type Column = {
  id: string;
  title: string;
  color: string;
  items: Card[];
  order: number;
};

type BoardProps = {
  projectId: string;
  boardId: string;
  initialColumns: Column[];
};

export default function KanbanBoardWrapper({ project, boardId, columns }: { project: any; boardId: string; columns: any[] }) {
  const uiColumns = columns.map((c: any) => ({
    id: c.id,
    title: c.title,
    color: c.color,
    order: c.order,
    items: c.tasks.map((t: any) => ({
      id: t.id,
      title: t.title,
      order: t.order,
      displayId: `${project.number}-${t.projectTaskNumber}`,
    })),
  }));

  return (
    <KanbanBoardProvider>
      <ProjectKanbanBoard projectId={project.id} boardId={boardId} initialColumns={uiColumns} />
    </KanbanBoardProvider>
  );
}

function ProjectKanbanBoard({ projectId, boardId, initialColumns }: BoardProps) {
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
    // оптимистично обновляем локальный стейт, чтобы сразу увидеть новый заголовок
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
          return {
            ...column,
            items: [...otherItems.slice(0, index), card, ...otherItems.slice(index)],
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

  const jsLoaded = useJsLoaded();

  return (
    <KanbanBoard
      ref={scrollContainerReference}
      className="h-full"
    >
      {columns.map((column: Column) =>
        jsLoaded ? (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
            onDeleteCard={handleDeleteCard}
            onDeleteColumn={handleDeleteColumn}
            onMoveCardToColumn={handleMoveCardToColumn}
            onUpdateCardTitle={handleUpdateCardTitle}
            onUpdateColumnTitle={handleUpdateColumnTitle}
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
