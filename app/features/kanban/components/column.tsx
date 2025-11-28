'use client';

import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import type { KanbanBoardDropDirection } from '@/new-york/ui/kanban';
import {
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnIconButton,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardColumnTitle,
  KanbanColorCircle,
} from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { KanbanCard } from './card';
import { NewCardForm } from './new-card';
import SimpleBar from 'simplebar-react';

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

type ColumnProps = {
  column: Column;
  onAddCard: (columnId: string, content: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveCardToColumn: (columnId: string, index: number, card: Card) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onDragCancel: (cardId: string) => void;
  onDragEnd: (cardId: string, overId: string) => void;
};

export function KanbanColumn({
  column,
  onAddCard,
  onDeleteCard,
  onDeleteColumn,
  onMoveCardToColumn,
  onUpdateCardTitle,
  onUpdateColumnTitle,
  onDragCancel,
  onDragEnd,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  function handleDropOverColumn(dataTransferData: string) {
    const card = JSON.parse(dataTransferData) as Card;
    onMoveCardToColumn(column.id, 0, card);
  }

  function handleDropOverListItem(cardId: string) {
    return (dataTransferData: string, dropDirection: KanbanBoardDropDirection) => {
      const card = JSON.parse(dataTransferData) as Card;
      const currentCardIndex = column.items.findIndex((item) => item.id === card.id);
      const targetCardIndex = column.items.findIndex((item) => item.id === cardId);

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
        <NewCardForm
          columnId={column.id}
          onAddCard={onAddCard}
          onCancel={() => setIsAddingCard(false)}
        />
      )}

      {/* Расширяем область скролла вверх и вниз, чтобы совпасть с границей колонки */}
      <div className="flex-1 min-h-0 -mt-2 -mb-2">
        <SimpleBar
          style={{ maxHeight: 620 }}
          autoHide
        >
          <KanbanBoardColumnList className="space-y-2">
            {column.items.map((card) => (
              <KanbanBoardColumnListItem
                key={card.id}
                cardId={card.id}
                onDropOverListItem={handleDropOverListItem(card.id)}
              >
                <KanbanCard
                  card={card}
                  onDeleteCard={onDeleteCard}
                  onUpdateCardTitle={onUpdateCardTitle}
                />
              </KanbanBoardColumnListItem>
            ))}
          </KanbanBoardColumnList>
        </SimpleBar>
      </div>
    </KanbanBoardColumn>
  );
}
