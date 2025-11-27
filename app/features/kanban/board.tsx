'use client';

import {
  MoreHorizontalIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

import { useJsLoaded } from '@/new-york/hooks/use-js-loaded';
import type {
  KanbanBoardDropDirection,
} from '@/new-york/ui/kanban';
import {
  KanbanBoard,
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardButtonGroup,
  KanbanBoardCardDescription,
  KanbanBoardCardTextarea,
  KanbanBoardColumn,
  KanbanBoardColumnButton,
  kanbanBoardColumnClassNames,
  KanbanBoardColumnFooter,
  KanbanBoardColumnHeader,
  KanbanBoardColumnIconButton,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  kanbanBoardColumnListItemClassNames,
  KanbanBoardColumnSkeleton,
  KanbanBoardColumnTitle,
  KanbanBoardExtraMargin,
  KanbanBoardProvider,
  KanbanColorCircle,
  useDndEvents,
} from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Skeleton } from '~/components/ui/skeleton';

// Server Actions
import { 
  addColumn, 
  updateColumnTitle, 
  deleteColumn, 
  addTask, 
  updateTaskTitle, 
  deleteTask, 
  moveTask 
} from './actions';

// Types
type Card = {
  id: string;
  title: string;
  order: number;
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

function ProjectKanbanBoard({ projectId, boardId, initialColumns }: BoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const scrollContainerReference = useRef<HTMLDivElement | null>(null);

  function scrollRight() {
    if (scrollContainerReference.current) {
      scrollContainerReference.current.scrollLeft =
        scrollContainerReference.current.scrollWidth;
    }
  }

  /* Column Logic */
  const handleAddColumn = (title?: string) => {
    if (title) {
      startTransition(async () => {
        await addColumn(boardId, projectId, title);
        scrollRight();
      });
    }
  };

  function handleDeleteColumn(columnId: string) {
    startTransition(async () => {
      await deleteColumn(columnId);
    });
  }

  function handleUpdateColumnTitle(columnId: string, title: string) {
    startTransition(async () => {
      await updateColumnTitle(columnId, title);
    });
  }

  /* Card Logic */
  function handleAddCard(columnId: string, cardContent: string) {
    startTransition(async () => {
      await addTask(columnId, cardContent);
    });
  }

  function handleDeleteCard(cardId: string) {
    startTransition(async () => {
      await deleteTask(cardId);
    });
  }

  function handleUpdateCardTitle(cardId: string, cardTitle: string) {
    startTransition(async () => {
      await updateTaskTitle(cardId, cardTitle);
    });
  }

  /* Move Logic */
  function handleMoveCardToColumn(columnId: string, index: number, card: Card) {
    setColumns(previousColumns =>
      previousColumns.map((column: Column) => {
        if (column.id === columnId) {
          const otherItems = column.items.filter(({ id }) => id !== card.id);
          return {
            ...column,
            items: [
              ...otherItems.slice(0, index),
              card,
              ...otherItems.slice(index),
            ],
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
  }

  const [activeCardId, setActiveCardId] = useState<string>('');
  const originalCardPositionReference = useRef<{
    columnId: string;
    cardIndex: number;
  } | null>(null);
  
  const { onDragStart, onDragEnd, onDragCancel, onDragOver } = useDndEvents();

  function getOverId(column: Column, cardIndex: number): {
    columnIndex: number;
    cardIndex: number;
  } {
    for (const [columnIndex, col] of columns.entries()) {
      const idx = col.items.findIndex((c: Card) => c.id === column.id);
      if (idx !== -1) {
        return { columnIndex, cardIndex: idx };
      }
    }
    return { columnIndex: -1, cardIndex: -1 };
  }

  function findCardPosition(cardId: string): {
    columnIndex: number;
    cardIndex: number;
  } {
    for (const [columnIndex, column] of columns.entries()) {
      const cardIndex = column.items.findIndex((c: Card) => c.id === cardId);
      if (cardIndex !== -1) {
        return { columnIndex, cardIndex };
      }
    }
    return { columnIndex: -1, cardIndex: -1 };
  }

  function handleCardKeyDown(_event: any, _cardId: string) {
    // keyboard DnD опущен для краткости
  }

  function handleCardBlur() {
    setActiveCardId('');
  }

  const jsLoaded = useJsLoaded();

  return (
    <KanbanBoard ref={scrollContainerReference}>
      {columns.map((column: Column) =>
        jsLoaded ? (
          <MyKanbanBoardColumn
            activeCardId={activeCardId}
            column={column}
            key={column.id}
            onAddCard={handleAddCard}
            onCardBlur={handleCardBlur}
            onCardKeyDown={handleCardKeyDown}
            onDeleteCard={handleDeleteCard}
            onDeleteColumn={handleDeleteColumn}
            onMoveCardToColumn={handleMoveCardToColumn}
            onUpdateCardTitle={handleUpdateCardTitle}
            onUpdateColumnTitle={handleUpdateColumnTitle}
            onDragCancel={onDragCancel}
            onDragEnd={onDragEnd}
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

// --- Subcomponents with DnD Hooks ---

function MyKanbanBoardColumn({
  activeCardId,
  column,
  onAddCard,
  onCardBlur,
  onCardKeyDown,
  onDeleteCard,
  onDeleteColumn,
  onMoveCardToColumn,
  onUpdateCardTitle,
  onUpdateColumnTitle,
  onDragCancel,
  onDragEnd
}: any) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  function handleDropOverColumn(dataTransferData: string) {
    const card = JSON.parse(dataTransferData) as Card;
    onMoveCardToColumn(column.id, 0, card);
  }

  function handleDropOverListItem(cardId: string) {
    return (
      dataTransferData: string,
      dropDirection: KanbanBoardDropDirection,
    ) => {
      const card = JSON.parse(dataTransferData) as Card;
      const currentCardIndex = column.items.findIndex((item: Card) => item.id === card.id);
      const targetCardIndex = column.items.findIndex((item: Card) => item.id === cardId);
      
      const baseIndex = dropDirection === 'top' ? targetCardIndex : targetCardIndex + 1;
      
      let finalIndex = baseIndex;
      if (currentCardIndex !== -1 && currentCardIndex < baseIndex) {
        finalIndex = baseIndex - 1;
      }
      
      const safeIndex = Math.max(0, Math.min(finalIndex, column.items.length));
      const overCard = column.items[safeIndex];

      if (card.id === overCard?.id) {
        onDragCancel(card.id);
      } else {
        onMoveCardToColumn(column.id, safeIndex, card);
        onDragEnd(card.id, overCard?.id || column.id);
      }
    };
  }

  function submitNewCard(form: HTMLFormElement | null) {
    if (!form) return;
    const fd = new FormData(form);
    const content = (fd.get('content') as string || '').trim();
    if (content) {
      onAddCard(column.id, content);
    }
    setIsAddingCard(false);
  }

  return (
    <KanbanBoardColumn columnId={column.id} onDropOverColumn={handleDropOverColumn}>
      <KanbanBoardColumnHeader>
        {isEditingTitle ? (
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              onUpdateColumnTitle(column.id, fd.get('title') as string);
              setIsEditingTitle(false);
            }}
          >
            <Input
              name="title"
              defaultValue={column.title}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
            />
          </form>
        ) : (
          <>
            <KanbanBoardColumnTitle columnId={column.id}>
              <KanbanColorCircle color={column.color || 'primary'} />
              {column.title}
            </KanbanBoardColumnTitle>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <KanbanBoardColumnIconButton>
                    <MoreHorizontalIcon />
                  </KanbanBoardColumnIconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteColumn(column.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <KanbanBoardColumnIconButton onClick={() => setIsAddingCard(true)}>
                <PlusIcon />
              </KanbanBoardColumnIconButton>
            </div>
          </>
        )}
      </KanbanBoardColumnHeader>

      {isAddingCard && (
        <form
          className="px-2 pt-1"
          onSubmit={(e) => {
            e.preventDefault();
            submitNewCard(e.currentTarget);
          }}
        >
          <KanbanBoardCardTextarea
            name="content"
            autoFocus
            placeholder="New task..."
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitNewCard(e.currentTarget.form);
              }
            }}
            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
              const form = e.currentTarget.form;
              const next = e.relatedTarget as HTMLElement | null;
              if (!form) return;
              if (next && form.contains(next)) return;
              submitNewCard(form);
            }}
          />
          <KanbanBoardColumnFooter>
            <Button size="sm" type="submit">Add</Button>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </Button>
          </KanbanBoardColumnFooter>
        </form>
      )}

      <KanbanBoardColumnList>
        {column.items.map((card: Card) => (
          <KanbanBoardColumnListItem 
            key={card.id} 
            cardId={card.id}
            onDropOverListItem={handleDropOverListItem(card.id)}
          >
            <MyKanbanBoardCard 
              card={card} 
              onDeleteCard={onDeleteCard} 
              onUpdateCardTitle={onUpdateCardTitle}
            />
          </KanbanBoardColumnListItem>
        ))}
      </KanbanBoardColumnList>
    </KanbanBoardColumn>
  );
}

function MyKanbanBoardCard({ card, onDeleteCard, onUpdateCardTitle }: any) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onUpdateCardTitle(card.id, fd.get('title') as string);
          setIsEditing(false);
        }}
      >
        <KanbanBoardCardTextarea
          name="title"
          defaultValue={card.title}
          autoFocus
          onBlur={() => setIsEditing(false)}
        />
      </form>
    );
  }

  return (
    <KanbanBoardCard data={card} onClick={() => setIsEditing(true)}>
      <KanbanBoardCardDescription className="break-words">
        {card.title}
      </KanbanBoardCardDescription>
      <KanbanBoardCardButtonGroup>
        <KanbanBoardCardButton
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCard(card.id);
          }}
        >
          <Trash2Icon size={16} />
        </KanbanBoardCardButton>
      </KanbanBoardCardButtonGroup>
    </KanbanBoardCard>
  );
}

function MyNewKanbanBoardColumn({ onAddColumn }: any) {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <form
        className={kanbanBoardColumnClassNames}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onAddColumn(fd.get('title') as string);
          setIsAdding(false);
        }}
      >
        <KanbanBoardColumnHeader>
          <Input name="title" autoFocus placeholder="Column title..." />
        </KanbanBoardColumnHeader>
        <KanbanBoardColumnFooter>
          <Button size="sm" type="submit">Add</Button>
          <Button size="sm" variant="outline" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
        </KanbanBoardColumnFooter>
      </form>
    );
  }

  return (
    <Button onClick={() => setIsAdding(true)} variant="outline">
      <PlusIcon /> <span className="sr-only">Add Column</span>
    </Button>
  );
}

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
    })),
  }));

  return (
    <KanbanBoardProvider>
      <ProjectKanbanBoard projectId={project.id} boardId={boardId} initialColumns={uiColumns} />
    </KanbanBoardProvider>
  );
}
